import { defineSetupVue3 } from "@histoire/plugin-vue";
import "../styles/index.scss";
import "virtual:uno.css";
import { INK_ROUTER_KEY } from "../src/router";
import { INK_I18N_KEY } from "../src/i18n";
import { createI18n } from "vue-i18n";
import { locales } from "../src/locales";
import { installThemeBridge } from "./theme";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: locales,
});

installThemeBridge();

export const setupVue3 = defineSetupVue3(({ app }) => {
  app.provide(INK_ROUTER_KEY, {
    // @ts-ignore
    currentPath: { value: "/dashboard" },
    // @ts-ignore
    currentName: { value: "Dashboard" },
  });

  // Provide vue-i18n for Histoire
  app.use(i18n);

  app.provide(INK_I18N_KEY, {
    t: i18n.global.t,
    locale: i18n.global.locale,
  });
});
