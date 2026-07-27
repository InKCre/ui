import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";
import { resolve } from "path";

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
      name: "InKCreWebDesign",
      fileName: "index",
      formats: ["es"],
    },
    sourcemap: "inline",
    outDir: "dist",
    rollupOptions: {
      external: ["vue", "vue-router", "dayjs"],

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
            return `@use "@inkcre/web-design/styles/mixins" as *;@use "@inkcre/web-design/styles/functions" as *;${source}`;
          }
          return source;
        },
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@inkcre/web-design/styles": resolve(__dirname, "styles"),
    },
  },
});
