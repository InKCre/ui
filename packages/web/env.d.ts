/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="vite/client" />

declare module "*.svg" {
  const source: string;
  export default source;
}

declare module "*.scss";
declare module "virtual:uno.css";
