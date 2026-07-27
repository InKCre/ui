import { computed, ref, watch } from "vue";

/**
 * @name useOptionalModel
 * @description
 * Creates a writable computed that mirrors a v-model prop if provided by parent,
 * otherwise falls back to an internal state. It always emits `update:<propName>`
 * so parents can start controlling later without breaking the internal state.
 *
 * Behavior:
 * - Will read the prop when available, avoiding stale state.
 * - Watcher only updates inner when prop is defined.
 *
 */
export function useOptionalModel<T>(options: {
  props: Record<string, unknown>;
  emit: (...args: any[]) => void;
  modelName: string;
  defaultValue?: T;
}) {
  const { props, emit, modelName, defaultValue } = options;

  const inner = ref<T>((props[modelName] ?? defaultValue) as T);

  const isControlled = computed(() => props[modelName] !== undefined);

  watch(
    () => props[modelName],
    (val) => {
      if (val !== undefined) {
        inner.value = val as T;
      }
    }
  );

  return computed<T>({
    get() {
      return isControlled.value ? (props[modelName] as T) : inner.value;
    },
    set(val: T) {
      inner.value = val;
      emit(`update:${modelName}`, val);
    },
  });
}
