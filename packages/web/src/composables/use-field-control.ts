import { computed, inject, useAttrs, useId } from "vue";
import { INK_FORM_CONTEXT_KEY } from "../components/inkForm/inkForm";
import type { FieldLayout } from "../components/inkField/inkField";

// A stable ID also connects standalone controls to their label and validation message.
export function useFieldControl(props: {
  id?: string;
  label?: string;
  layout?: FieldLayout;
  error: string;
}) {
  const context = inject(INK_FORM_CONTEXT_KEY, null);
  const generatedId = useId();
  const attrs = useAttrs();
  const controlId = computed(() => props.id || generatedId);
  const errorId = computed(() => `${controlId.value}-error`);
  const describedBy = computed(
    () =>
      [attrs["aria-describedby"], props.error && errorId.value].filter(Boolean).join(" ") ||
      undefined,
  );
  const fieldLayout = computed(() => props.layout || context?.layout || "col");
  const useField = computed(() => Boolean(props.label || props.error));
  return { controlId, errorId, describedBy, fieldLayout, useField };
}
