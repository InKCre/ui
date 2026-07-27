---
name: router
description: Integrate @inkcre/ui-web with Vue Router using the adapter pattern.
---

# Router Integration

Use this skill when integrating @inkcre/ui-web components with Vue Router.

## Overview

Some components (like InkHeader) need router capabilities. The design system uses a provider pattern that works with any router implementation.

## Interface

```typescript
import type { ComputedRef, InjectionKey } from "vue";

export interface InkRouter {
  /** Current path (reactive) */
  currentPath: ComputedRef<string>;
  /** Current page name */
  currentName: ComputedRef<string | null>;
}

export const INK_ROUTER_KEY: InjectionKey<InkRouter> = Symbol("INK_ROUTER");
```

## Setup

1. Create a router adapter:

```typescript
// router-adapter.ts
import { computed } from "vue";
import type { Router, RouteLocationNormalizedLoaded } from "vue-router";
import type { InkRouter } from "@inkcre/ui-web";

export function createInkRouterAdapter(
  router: Router,
  route: RouteLocationNormalizedLoaded
): InkRouter {
  return {
    currentPath: computed(() => route.path),
    currentName: computed(() => route.name),
  };
}
```

2. Provide in your app:

```typescript
// App.vue
<script setup lang="ts">
import { INK_ROUTER_KEY } from "@inkcre/ui-web";
import { createInkRouterAdapter } from "./router-adapter";
import { useRoute, useRouter } from "vue-router";

provide(
  INK_ROUTER_KEY,
  createInkRouterAdapter(useRouter(), useRoute())
);
</script>
```

## Usage in Components

```typescript
import { useOptionalRouter } from "@inkcre/ui-web";

const router = useOptionalRouter();
if (router) {
  console.log(router.currentPath.value);
}
```
