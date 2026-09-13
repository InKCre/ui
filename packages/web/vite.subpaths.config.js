import { defineConfig } from "vite";
import { resolve } from "path";
import packageJson from "./package.json" with { type: "json" };

const externalDependencies = Object.keys({
  ...packageJson.dependencies,
  ...packageJson.peerDependencies,
});
const isExternalDependency = (id) =>
  externalDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));

export default defineConfig({
  build: {
    lib: {
      entry: {
        "utils/index": resolve(__dirname, "src/utils/index.ts"),
        "locales/index": resolve(__dirname, "src/locales/index.ts"),
        "uno/preset-ink": resolve(__dirname, "styles/uno/preset-ink.ts"),
      },
      fileName: (_format, entryName) => `${entryName}.js`,
      formats: ["es"],
    },
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      external: isExternalDependency,
    },
  },
});
