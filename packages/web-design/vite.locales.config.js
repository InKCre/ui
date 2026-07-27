import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";

const failOnDiagnostics = (diagnostics) => {
  if (diagnostics.length > 0) {
    throw new Error(`Declaration generation failed with ${diagnostics.length} diagnostic(s).`);
  }
};

export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
      skipDiagnostics: false,
      logDiagnostics: true,
      afterDiagnostic: failOnDiagnostics,
      include: ["src/locales/**/*.ts"],
      outDir: "dist",
    }),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, "src/locales/index.ts"),
      name: "InKCreWebDesignLocales",
      fileName: "locales/index",
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: false,
  },
});
