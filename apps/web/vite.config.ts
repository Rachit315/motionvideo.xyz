import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { intlayer } from "vite-intlayer";

import { STATIC_PAGES } from "./src/constants/routes.ts";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // vite-intlayer keeps its generated dictionary entries out of the client's
  // dependency prebundle, but not the Workers (ssr) environment's: there they
  // got baked into node_modules/.vite/deps_ssr, so the server kept rendering
  // stale strings that the client then replaced on hydration (a visible
  // flash). Excluded, they resolve to the live .intlayer files.
  environments: {
    ssr: {
      optimizeDeps: {
        exclude: [
          "@intlayer/dictionaries-entry",
          "@intlayer/dictionaries-entry/unmerged",
          "@intlayer/dictionaries-entry/remote",
          "@intlayer/dictionaries-entry/dynamic",
          "@intlayer/dictionaries-entry/fetch",
          "@intlayer/config/built",
        ],
      },
    },
  },
  plugins: [
    devtools(),
    intlayer(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      router: {
        routeFileIgnorePattern: "\\.content\\.",
      },
      pages: STATIC_PAGES.map((path) => ({ path })),
      prerender: {
        autoStaticPathsDiscovery: false,
        // `/about.html` rather than `/about/index.html`: Workers assets serve it
        // at `/about` without a trailing-slash redirect.
        autoSubfolderIndex: false,
        crawlLinks: false,
        enabled: true,
        filter: ({ path }) => STATIC_PAGES.includes(path),
      },
    }),
    viteReact(),
  ],
});

export default config;
