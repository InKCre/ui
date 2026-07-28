import type { App } from "vue";
import type {} from "./components";

import "../styles/index.scss";

import { publicComponents } from "./public-components";

export default {
  install(app: App) {
    for (const [name, component] of Object.entries(publicComponents)) {
      app.component(name, component);
    }
  },
};

export * from "./public-components";
export { version } from "./version";

// Others

import { INK_ROUTER_KEY } from "./router";
import { INK_I18N_KEY } from "./i18n";

import type { DropdownOption } from "./components/inkDropdown/inkDropdown";
import type { JSONSchema, JSONSchemaProperty } from "./components/inkAutoForm/inkAutoForm";

// others
import type { InkRouter } from "./router";
import type { InkI18n } from "./i18n";

export { INK_ROUTER_KEY, INK_I18N_KEY };

export type { DropdownOption, JSONSchema, JSONSchemaProperty, InkRouter, InkI18n };
