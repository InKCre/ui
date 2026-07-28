import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import UnoCSS from "unocss/vite";
import { isAbsolute, relative, resolve, sep } from "path";
import packageJson from "./package.json" with { type: "json" };

const peerDependencies = Object.keys(packageJson.peerDependencies);
const declarationRoot = resolve(__dirname, "dist");
const isPeerDependency = (id) =>
  peerDependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));

const normalizeDeclarationOutput = (filePath, content) => {
  const isInsideDist = filePath.startsWith(`${declarationRoot}${sep}`);
  const outputPath = isInsideDist
    ? relative(declarationRoot, filePath)
    : relative(__dirname, filePath);
  if (outputPath.startsWith("..") || isAbsolute(outputPath)) {
    throw new Error(`Declaration output escaped the web package: ${filePath}`);
  }

  const normalizedPath = outputPath.replace(/\.d\.vue\.ts$/, ".d.ts");
  if (isInsideDist && normalizedPath === outputPath) return;

  return {
    filePath: resolve(declarationRoot, normalizedPath),
    content,
  };
};

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
      tsconfigPath: resolve(__dirname, "tsconfig.build.json"),
      rollupTypes: false,
      pathsToAliases: false,
      skipDiagnostics: false,
      logDiagnostics: true,
      afterDiagnostic: failOnDiagnostics,
      beforeWriteFile: normalizeDeclarationOutput,
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
