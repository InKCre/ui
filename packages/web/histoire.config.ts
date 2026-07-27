import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";
import { resolve } from "path";
import { readFileSync, writeFileSync } from "fs";
import type { Plugin } from "vite";
import MarkdownIt from "markdown-it";

const cdnModules = {
  "@codemirror/view": "https://esm.sh/@codemirror/view@6.38.8",
  "@codemirror/state": "https://esm.sh/@codemirror/state@6.5.2",
  "@codemirror/lang-json": "https://esm.sh/@codemirror/lang-json@6.0.2",
  "@codemirror/commands": "https://esm.sh/@codemirror/commands@6.10.0",
  "@codemirror/autocomplete": "https://esm.sh/@codemirror/autocomplete@6.20.0",
  "@codemirror/lint": "https://esm.sh/@codemirror/lint@6.9.2",
  "vscode-json-languageservice": "https://esm.sh/vscode-json-languageservice@5.6.4",
  "vscode-languageserver-textdocument": "https://esm.sh/vscode-languageserver-textdocument@1.0.12",
  // Also externalize Vue and related libraries
  // Note: Versions match peerDependencies in package.json
  // This is only for Histoire build (dev tool), not production builds
  vue: "https://esm.sh/vue@3.5.25",
  "vue-router": "https://esm.sh/vue-router@4.6.4",
  "@vueuse/core": "https://esm.sh/@vueuse/core@14.1.0",
  dayjs: "https://esm.sh/dayjs@1.11.19",
};

const cdnExternalsPlugin = (): Plugin => {
  let isBuild = false;
  let outDir = "";
  let htmlTransformed = false;

  return {
    name: "cdn-externals",
    enforce: "pre",

    configResolved(config) {
      isBuild = config.command === "build";
      outDir = config.build.outDir;
    },

    resolveId(id) {
      if (isBuild && Object.keys(cdnModules).includes(id)) {
        // Return a special virtual module ID
        return "\0" + id;
      }
      return null;
    },

    load(id) {
      if (isBuild && id.startsWith("\0")) {
        const originalId = id.slice(1);
        if (originalId in cdnModules) {
          const cdnUrl = cdnModules[originalId as keyof typeof cdnModules];
          // Return a proxy module that imports from CDN
          return `export * from '${cdnUrl}';`;
        }
      }
      return null;
    },

    closeBundle() {
      if (isBuild && !htmlTransformed) {
        try {
          const htmlPath = resolve(outDir, "index.html");

          // Check if file exists
          try {
            readFileSync(htmlPath, "utf-8");
          } catch {
            // HTML file doesn't exist yet, skip transformation
            return;
          }

          let html = readFileSync(htmlPath, "utf-8");

          // Check if import map already exists using regex
          if (/<script[^>]*type=["']importmap["'][^>]*>/i.test(html)) {
            htmlTransformed = true;
            return;
          }

          // Create import map with proper JSON serialization
          const importMap = {
            imports: Object.fromEntries(
              Object.entries(cdnModules).map(([name, url]) => [name, url]),
            ),
          };
          const importMapScript = `  <script type="importmap">\n${JSON.stringify(
            importMap,
            null,
            4,
          )}\n  </script>\n`;

          html = html.replace(/<\/head>/i, importMapScript + "</head>");
          writeFileSync(htmlPath, html);
          htmlTransformed = true;
          console.log("[CDN] Added import map to HTML");
        } catch (err) {
          console.error("[CDN] Failed to transform HTML:", err);
        }
      }
    },
  };
};

/**
 * Vite plugin to optimize Shiki bundle in different modes
 * - Dev mode: Only allow specific languages (vue, typescript, javascript) by intercepting imports
 * - Build mode: Exclude Shiki completely
 */
const optimizeShikiPlugin = (): Plugin => {
  let isBuild = false;
  // Include both full names and common aliases for language matching
  const allowedLangs = ["vue", "typescript", "javascript", "ts", "js"];

  // Helper function to extract module name from import path
  const extractModuleName = (id: string, prefix: string): string => {
    return id.replace(prefix, "").replace(/\.(mjs|js|ts)$/, "");
  };

  return {
    name: "optimize-shiki",
    enforce: "pre",

    configResolved(config) {
      isBuild = config.command === "build";
    },

    resolveId(id) {
      if (isBuild) {
        // In build mode, block all Shiki-related imports
        if (id.includes("shiki") || id.includes("@shikijs")) {
          console.log(`[Optimize Shiki] Blocking in build mode: ${id}`);
          return "\0shiki-excluded";
        }
      } else {
        // In dev mode, block non-essential language imports
        // Allow index files and only specific language files
        const isLangsIndex = id === "@shikijs/langs" || id.includes("/langs/dist/index.mjs");
        if (id.startsWith("@shikijs/langs/") && !isLangsIndex) {
          const langName = extractModuleName(id, "@shikijs/langs/");
          if (!allowedLangs.includes(langName)) {
            // Block this language
            return "\0shiki-lang-blocked";
          }
        }
        // Block non-essential theme imports (only allow github-light)
        // Allow index files and only the github-light theme
        const isThemesIndex = id === "@shikijs/themes" || id.includes("/themes/dist/index.mjs");
        if (id.startsWith("@shikijs/themes/") && !isThemesIndex) {
          const themeName = extractModuleName(id, "@shikijs/themes/");
          if (themeName !== "github-light") {
            // Block this theme
            return "\0shiki-theme-blocked";
          }
        }
      }
      return null;
    },

    load(id) {
      if (id === "\0shiki-lang-blocked" || id === "\0shiki-theme-blocked") {
        // Return empty module for blocked languages/themes in dev mode
        return `export default null;`;
      }

      if (id === "\0shiki-excluded") {
        // Build mode: Return empty module for all Shiki
        return `
// Shiki excluded in build mode - using plain markdown rendering
export default {};
export const getHighlighter = () => Promise.resolve({});
export const createHighlighter = () => Promise.resolve({});
export const bundledLanguages = {};
export const bundledThemes = {};
export const codeToHtml = () => Promise.resolve('');
        `;
      }
      return null;
    },
  };
};

export default defineConfig({
  plugins: [HstVue()],
  setupFile: "./stories/histoire.setup.ts",
  storyMatch: ["stories/**/*.story.vue"],
  storyIgnored: ["**/node_modules/**", "**/dist/**", "**/.histoire/**"],
  theme: {
    title: "InKCre Web UI",
    defaultColorScheme: "light",
    storeColorScheme: false,
    logo: {
      square: "./src/logo.svg",
      light: "./src/logo.svg",
      dark: "./src/logo.svg",
    },
  },
  sandboxDarkClass: "dark",
  responsivePresets: [
    { label: "Mobile", width: 360, height: 800 },
    { label: "Tablet", width: 768, height: 1024 },
    { label: "Desktop", width: 1440, height: 900 },
  ],
  backgroundPresets: [
    {
      label: "Canvas",
      color: "#ffffff",
      contrastColor: "#18181b",
    },
    {
      label: "Muted",
      color: "#f4f4f5",
      contrastColor: "#18181b",
    },
    {
      label: "Dark",
      color: "#18181b",
      contrastColor: "#fafafa",
    },
  ],
  // Configure markdown rendering
  // In dev mode: Use Histoire's default (which will use our optimized Shiki with limited langs/themes)
  // In build mode: Use plain markdown-it (Shiki excluded by plugin)
  // Note: Using process.env.NODE_ENV here is correct as Histoire sets it based on command
  markdown:
    process.env.NODE_ENV === "production"
      ? (env) => {
          // Build mode: Use markdown-it without Shiki
          const md = new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
          });
          // Code blocks will render as plain <pre><code>...</code></pre>
          return md;
        }
      : undefined, // Dev mode: Use Histoire's default with our optimized Shiki
  vite: {
    plugins: [optimizeShikiPlugin(), cdnExternalsPlugin()],
    build: {
      sourcemap: false,
      minify: "terser",
      cssMinify: true,
    },
  },
});
