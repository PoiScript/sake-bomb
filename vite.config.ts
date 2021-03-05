import { defineConfig } from "vite";
import preactRefresh from "@prefresh/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h, Fragment } from 'preact'`,

    minify: mode !== "development",
    minifyIdentifiers: mode !== "development",
    minifySyntax: mode !== "development",
    minifyWhitespace: mode !== "development",
  },
  build: {
    polyfillDynamicImport: false,
    minify: mode !== "development",
    rollupOptions: {
      input: {
        sidebar: "./sidebar.html",
        options: "./options.html",
      },
    },
  },
  plugins: [preactRefresh()],
}));
