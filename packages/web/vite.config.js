import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";
import { resolve } from "path";
import packageJson from "./package.json" with { type: "json" };

const peerDependencies = Object.keys(packageJson.peerDependencies);
const isPeerDependency = (id) =>
  peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));

const failOnDiagnostics = (diagnostics) => {
  if (diagnostics.length > 0) {
    throw new Error(`Declaration generation failed with ${diagnostics.length} diagnostic(s).`);
  }
};

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      rollupTypes: true,
      pathsToAliases: false,
      bundledPackages: ["@vue/shared"],
      skipDiagnostics: false,
      logDiagnostics: true,
      afterDiagnostic: failOnDiagnostics,
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "InKCreUIWeb",
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: "inline",
    outDir: "dist",
    rollupOptions: {
      external: isPeerDependency,

      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: (source, file) => {
          if (file.includes("src/components/")) {
            return `@use "@inkcre/ui-web/styles/mixins" as *;@use "@inkcre/ui-web/styles/functions" as *;${source}`;
          }
          return source;
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@inkcre/ui-web/styles": resolve(__dirname, "styles"),
    },
  },
});
