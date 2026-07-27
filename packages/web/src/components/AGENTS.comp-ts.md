# `compName.ts` guide

`compName.ts` holds component props, emits, models, constants, types and utils. Read this file will enable the user to use this component.

## Scaffold

```typescript
import type { PropType } from "vue";
import { makeStringProp } from "@/utils/props";  // use utils/vue-props.ts

// --- Types ---

// --- Constants ---

// --- Props ---
export const compNameProps = {
  /** Key notes */
  propName: makeStringProp<"option1" | "option2">("option1"),
  /** Key notes */
  requiredProp: {
    type: Object as PropType<SomeInterface>,
    required: true,
  }
};

// --- Emits ---
export const compNameEmits = {
  /** Key notes */
  eventName: (param: ParamType) => true;
};

// --- Utilities ---
/** Key notes */
export function helperFunction() {
  // ...
}
```

## Best Practices

- If model is mutable (eg. object, array), AND the component tends to be state-less, use prop rather than a model.
- It's suggested to use `defineModel` is `compName.vue`.
