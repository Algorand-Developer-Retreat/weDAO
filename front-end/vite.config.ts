import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      global: "global", // explicitly alias `global` to shim it
      buffer: "buffer", // alias for the Buffer polyfill
      process: "process/browser", // alias for the process polyfill
    },
  },
  define: {
    global: "globalThis", // map Node's global to the browser-safe globalThis
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
