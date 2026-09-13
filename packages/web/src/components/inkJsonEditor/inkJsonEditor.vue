<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, useAttrs } from "vue";
import { inkJsonEditorProps, inkJsonEditorEmits } from "./inkJsonEditor";
import InkField from "../inkField/inkField.vue";
import { useFieldControl } from "../../composables/use-field-control";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap, autocompletion } from "@codemirror/autocomplete";
import {
  createJsonService,
  SCHEMA_RESOLVE_ERROR,
  type JsonEditorValidation,
} from "./jsonSchemaService";
import { setDiagnostics, type Diagnostic } from "@codemirror/lint";
import { TextDocument } from "vscode-languageserver-textdocument";

defineOptions({ inheritAttrs: false });
const props = defineProps(inkJsonEditorProps);
const emit = defineEmits(inkJsonEditorEmits);
const attrs = useAttrs();
const { controlId, errorId, describedBy, fieldLayout } = useFieldControl(props);
const editorRef = ref<HTMLDivElement>();
const validation = ref<JsonEditorValidation>({
  text: props.modelValue,
  status: "pending",
  valid: false,
  messages: [],
});
const message = computed(() =>
  [props.error, ...validation.value.messages].filter(Boolean).join("\n"),
);
const rootStyles = computed(() => ({
  height: `calc(${Math.max(1, props.rows) * 1.2}em + var(--sys-space-sm) * 2)`,
}));
let editorView: EditorView | undefined;
let service = createJsonService();
let request = 0;
let externalUpdate = false;
const settings = new Compartment();
function editorSettings() {
  return [
    EditorView.editable.of(props.editable && !props.disabled),
    EditorState.readOnly.of(!props.editable || props.disabled),
    placeholder(props.placeholder),
    EditorView.contentAttributes.of({
      id: controlId.value,
      role: "textbox",
      "aria-multiline": "true",
      "aria-label": String(attrs["aria-label"] || props.label || "JSON"),
      "aria-required": String(props.required),
      "aria-invalid": String(!!message.value),
      "aria-describedby": [describedBy.value, message.value && errorId.value]
        .filter(Boolean)
        .join(" "),
      ...(attrs["aria-labelledby"] ? { "aria-labelledby": String(attrs["aria-labelledby"]) } : {}),
    }),
  ];
}
function report(result: JsonEditorValidation) {
  validation.value = result;
  emit("validation", result);
}
async function validate(text: string) {
  const identity = ++request;
  report({ text, status: "pending", valid: false, messages: [] });
  const doc = TextDocument.create(
    `inkcre://document/${controlId.value}.json`,
    "json",
    identity,
    text,
  );
  const jsonDoc = service.parseJSONDocument(doc);
  try {
    const results = await service.doValidation(doc, jsonDoc);
    if (identity !== request || !editorView) return;
    const diagnostics: Diagnostic[] = results.map((result) => ({
      from: doc.offsetAt(result.range.start),
      to: doc.offsetAt(result.range.end),
      severity: result.severity === 1 ? "error" : "warning",
      message: result.message,
    }));
    // Keep valid=true safe to JSON.parse, even if a schema opts into JSON-with-comments.
    try {
      JSON.parse(text);
    } catch (error) {
      if (!diagnostics.length)
        diagnostics.push({
          from: 0,
          to: text.length,
          severity: "error",
          message: error instanceof Error ? error.message : String(error),
        });
    }
    const schemaFailure = results.find((result) => result.code === SCHEMA_RESOLVE_ERROR);

    editorView.dispatch(setDiagnostics(editorView.state, diagnostics));
    report({
      text,
      status: schemaFailure ? "error" : diagnostics.length ? "invalid" : "valid",
      valid: diagnostics.length === 0,
      messages: diagnostics.map((item) => item.message),
    });
    if (schemaFailure) emit("error", new Error(schemaFailure.message));
  } catch (error) {
    if (identity !== request || !editorView) return;
    report({
      text,
      status: "error",
      valid: false,
      messages: [error instanceof Error ? error.message : String(error)],
    });
    emit("error", error);
  }
}
function configureSchema() {
  service = createJsonService(props.schema, props.schemaUri);
}
const completion = autocompletion({
  override: [
    async (context) => {
      if (!props.schema) return null;
      const currentService = service;
      const doc = TextDocument.create(
        `inkcre://document/${controlId.value}.json`,
        "json",
        0,
        context.state.doc.toString(),
      );
      try {
        const result = await currentService.doComplete(
          doc,
          doc.positionAt(context.pos),
          currentService.parseJSONDocument(doc),
        );
        if (currentService !== service || context.aborted) return null;
        return {
          from: context.pos,
          options:
            result?.items.map((item) => ({
              label: item.label,
              detail: item.detail,
              type: item.kind === 10 ? "property" : "value",
            })) ?? [],
        };
      } catch (error) {
        emit("error", error);
        return null;
      }
    },
  ],
});
onMounted(() => {
  configureSchema();
  editorView = new EditorView({
    parent: editorRef.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: [
        json(),
        completion,
        closeBrackets(),
        keymap.of([...closeBracketsKeymap, ...defaultKeymap, indentWithTab]),
        settings.of(editorSettings()),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          const text = update.state.doc.toString();
          if (!externalUpdate) emit("update:modelValue", text);
          void validate(text);
        }),
      ],
    }),
  });
  void validate(props.modelValue);
});
onBeforeUnmount(() => {
  request++;
  editorView?.destroy();
  editorView = undefined;
});
watch(
  () => props.modelValue,
  (text) => {
    if (!editorView || editorView.state.doc.toString() === text) return;
    externalUpdate = true;
    try {
      editorView.dispatch({ changes: { from: 0, to: editorView.state.doc.length, insert: text } });
    } finally {
      externalUpdate = false;
    }
  },
);
watch(
  [() => props.schema, () => props.schemaUri],
  () => {
    configureSchema();
    if (editorView) void validate(editorView.state.doc.toString());
  },
  { deep: true },
);
watch(
  [
    () => props.editable,
    () => props.disabled,
    () => props.placeholder,
    () => props.label,
    () => props.required,
    controlId,
    describedBy,
    message,
  ],
  () => {
    editorView?.dispatch({ effects: settings.reconfigure(editorSettings()) });
  },
);
</script>
<template>
  <InkField
    :for="controlId"
    :label="label || ''"
    :layout="fieldLayout"
    :required="required"
    :error="message"
    :error-id="errorId"
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <div
      class="ink-json-editor"
      :style="rootStyles"
      :aria-busy="validation.status === 'pending' || undefined"
    >
      <div
        ref="editorRef"
        :class="[
          'ink-json-editor__editor',
          { 'ink-json-editor__editor--readonly': !editable || disabled },
        ]"
      />
    </div>
  </InkField>
</template>
<style lang="scss" scoped src="./inkJsonEditor.scss" />
