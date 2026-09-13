import { defineConfig } from "histoire";
import { HstVue } from "@histoire/plugin-vue";
import { resolve } from "path";
export default defineConfig({
  plugins: [HstVue()],
  viteIgnorePlugins: ["vite:dts"],
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
  vite: {
    resolve: {
      alias: [{ find: /^@inkcre\/ui-web$/, replacement: resolve(__dirname, "src/index.ts") }],
    },
    build: {
      sourcemap: false,
      minify: "terser",
      cssMinify: true,
    },
  },
});
