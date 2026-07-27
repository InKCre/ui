---
name: i18n
description: Integrate @inkcre/ui-web with vue-i18n for internationalization.
---

# Internationalization (i18n)

Use this skill when setting up internationalization for @inkcre/ui-web components.

## Overview

The design system supports i18n through a provider pattern compatible with vue-i18n.

## Interface

```typescript
import type { Ref, InjectionKey } from "vue";

export interface InkI18n {
  t: (key: string) => string;
  locale: Ref<string>;
}

export const INK_I18N_KEY: InjectionKey<InkI18n> = Symbol("INK_I18N");
```

## Setup

1. Install vue-i18n:

```bash
pnpm add vue-i18n
```

2. Extend provided locales:

```typescript
// locales/en.ts
import { en } from "@inkcre/ui-web/locales";

export default {
  ...en,
  // Your custom translations
}
```

3. Configure vue-i18n:

```typescript
// locales/index.ts
import { createI18n } from "vue-i18n";
import en from "./en";
import zhCN from "./zhCN";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, zhCN },
});

export default i18n;
```

4. Provide to design system:

```typescript
// App.vue
<script setup lang="ts">
import { INK_I18N_KEY } from "@inkcre/ui-web";
import i18n from "./locales";

provide(INK_I18N_KEY, {
  t: i18n.global.t,
  locale: i18n.global.locale,
});
</script>
```

## Usage

Components will automatically use translations if i18n is provided. They fall back to English if not configured.

```typescript
import { useOptionalI18n } from "@inkcre/ui-web";

const i18n = useOptionalI18n();
if (i18n) {
  console.log(i18n.t('common.save'));
}
```
