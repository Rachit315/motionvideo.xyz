// The snapcn Pro components are licensed to us, not redistributable in this
// public repo (see apps/videos/.gitignore), so a fresh checkout cannot resolve
// the imports in the launch composition. Skip the project only in that case;
// maintainers with the licensed files installed still get a full typecheck.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const licensed = [
  "src/components/snap-cn/lockup-reveal.tsx",
  "src/components/snap-cn/manifesto.tsx",
];
const missing = licensed.filter((file) => !existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.warn(
    [
      "typecheck: skipped apps/videos because licensed snapcn components are missing:",
      ...missing.map((file) => `  - ${file}`),
      "This is expected on a fresh public checkout. Install them with",
      "SNAPCN_API_KEY=... npx shadcn@latest add @snapcn/manifesto @snapcn/lockup-reveal",
      "to typecheck the video project.",
    ].join("\n")
  );
  process.exit(0);
}

const result = spawnSync("tsc", ["--noEmit"], {
  cwd: root,
  stdio: "inherit",
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
