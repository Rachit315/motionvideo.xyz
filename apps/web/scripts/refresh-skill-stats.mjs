// Refresh each skill's GitHub stars and last push date in
// src/data/resource-directories.json, for the /skills sort options.
//
//   pnpm catalog:refresh:skills
//
// Reads GITHUB_TOKEN, or falls back to `gh auth token`; unauthenticated
// requests run out after 60. A repo that can't be read (renamed, private,
// deleted) keeps its previous numbers and is reported at the end.
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { z } from "zod";

const run = promisify(execFile);
const directoriesPath = fileURLToPath(
  new URL("../src/data/resource-directories.json", import.meta.url)
);
const CONCURRENCY = 8;

// Skills linked to a page other than their repository.
const REPO_BY_ID = { "remotion-skills": "remotion-dev/skills" };

const repoSchema = z.object({
  stargazers_count: z.number(),
  pushed_at: z.string(),
});

const repoOf = (entry) =>
  Object.hasOwn(REPO_BY_ID, entry.id)
    ? REPO_BY_ID[entry.id]
    : entry.url.match(/^https:\/\/github\.com\/(?<repo>[\w.-]+\/[\w.-]+)/u)
        ?.groups.repo;

const token =
  process.env.GITHUB_TOKEN ??
  (await run("gh", ["auth", "token"]).then(
    ({ stdout }) => stdout.trim(),
    () => null
  ));
const headers = { Accept: "application/vnd.github+json" };
if (token) {
  headers.Authorization = `Bearer ${token}`;
}

const directories = JSON.parse(await readFile(directoriesPath, "utf-8"));
const skills = directories.tools.entries.filter(
  (entry) => entry.category === "Skills"
);

const failed = [];
const queue = skills.flatMap((entry) => {
  const repo = repoOf(entry);
  if (!repo) {
    failed.push({ id: entry.id, error: "no GitHub repository" });
    return [];
  }
  return [[entry, repo]];
});
const worker = async () => {
  for (let job = queue.shift(); job; job = queue.shift()) {
    const [entry, repo] = job;
    // oxlint-disable-next-line no-await-in-loop
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      signal: AbortSignal.timeout(20_000),
    }).catch((error) => error);
    if (!(response instanceof Response) || !response.ok) {
      failed.push({
        id: entry.id,
        error:
          response instanceof Response
            ? `HTTP ${response.status}`
            : String(response),
      });
      continue;
    }
    // oxlint-disable-next-line no-await-in-loop
    const data = repoSchema.parse(await response.json());
    entry.stars = data.stargazers_count;
    entry.updatedAt = data.pushed_at;
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

await writeFile(directoriesPath, `${JSON.stringify(directories, null, 2)}\n`);
console.log(
  `${skills.length - failed.length}/${skills.length} skills refreshed.`
);
if (failed.length > 0) {
  console.error(failed);
  process.exitCode = 1;
}
