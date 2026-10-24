// Point Wrangler at the built Worker from the repository root too.
//
// `vite build` (the Cloudflare plugin) writes `.wrangler/deploy/config.json`
// in apps/web, redirecting Wrangler to the generated dist/server/wrangler.json.
// Workers Builds runs its non-production command (`npx wrangler preview`)
// from the repository root, where Wrangler finds no config and reports a
// missing `previews` block. Wrangler looks for this redirect file upward
// from its working directory, so a copy at the root fixes that.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../..", import.meta.url));
const deployDir = path.join(root, ".wrangler/deploy");
const builtConfig = fileURLToPath(
  new URL("../dist/server/wrangler.json", import.meta.url)
);

await mkdir(deployDir, { recursive: true });
await writeFile(
  path.join(deployDir, "config.json"),
  `${JSON.stringify({
    configPath: path.relative(deployDir, builtConfig),
    auxiliaryWorkers: [],
  })}\n`
);
console.log("deploy config linked at the repository root");
