import { ref, watch } from "vue";

export function useAsyncBoolean(
  source: () => boolean | Promise<boolean>,
  onError: (error: unknown) => void,
) {
  const value = ref(false);
  const pending = ref(false);
  // Vue handles rejected Promise-returning getters globally; keep rejection ownership here.
  watch(
    () => [source()] as const,
    async ([next], _previous, onCleanup) => {
      let active = true;
      onCleanup(() => {
        active = false;
      });
      pending.value = next instanceof Promise;
      if (!(next instanceof Promise)) {
        value.value = next;
        return;
      }
      try {
        const resolved = await next;
        if (active) value.value = resolved;
      } catch (error) {
        if (active) onError(error);
      } finally {
        if (active) pending.value = false;
      }
    },
    { immediate: true, flush: "sync" },
  );
  return { value, pending };
}
