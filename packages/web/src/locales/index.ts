import en from "./en";
import zhCN from "./zh-CN";

export const locales = {
  en,
  "zh-CN": zhCN,
};

export { en, zhCN };

export type LocaleMessages = typeof en;
