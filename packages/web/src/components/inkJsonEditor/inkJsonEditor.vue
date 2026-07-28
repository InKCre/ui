<script setup lang="ts">
import { ref, inject, computed, onMounted, onUnmounted, watch } from "vue";
import { createReusableTemplate } from "@vueuse/core";
import { inkJsonEditorProps, inkJsonEditorEmits } from "./inkJsonEditor";
import InkField from "../inkField/inkField.vue";
import { INK_FORM_CONTEXT_KEY } from "../inkForm/inkForm";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { jsonService } from "./jsonSchemaService";
import { linter } from "@codemirror/lint";
import { autocompletion } from "@codemirror/autocomplete";
import { TextDocument } from "vscode-languageserver-textdocument";
import { isJsonValid } from "../../utils/json";

const props = defineProps(inkJsonEditorProps);
const emit = defineEmits(inkJsonEditorEmits);

const formContext = inject(INK_FORM_CONTEXT_KEY, null);

const useField = computed(() => formContext !== null && props.label);
const fieldLayout = computed(() => props.layout || formContext?.layout);

// --- data ---
const editorRef = ref<HTMLDivElement>();
let editorView: EditorView | null = null;
const editableCompartment = new Compartment();

function diagnosticMessage(message: unknown): string {
  if (typeof message === "string") return message;
  if (
    message &&
    typeof message === "object" &&
    "value" in message &&
    typeof message.value === "string"
  ) {
    return message.value;
  }
  return String(message);
}

const jsonSchemaLinter = linter(async (view) => {
  if (!props.schema) return [];

  const text = view.state.doc.toString();

  const doc = TextDocument.create(props.schemaUri, "json", 0, text);
  const jsonDocument = jsonService.parseJSONDocument(doc);

  const diagnostics = await jsonService.doValidation(doc, jsonDocument);

  return diagnostics.map((d) => {
    const from = view.state.doc.line(d.range.start.line + 1).from;
    const to = view.state.doc.line(d.range.end.line + 1).to;

    return {
      from,
      to,
      severity: d.severity === 1 ? "error" : "warning",
      message: diagnosticMessage(d.message),
    };
  });
});

const jsonSchemaCompletion = autocompletion({
  override: [
    // @ts-ignore
    async (ctx) => {
      if (!props.schema) return null;

      try {
        const text = ctx.state.doc.toString();

        const textDocument = TextDocument.create(props.schemaUri, "json", 0, text);

        const jsonDocument = jsonService.parseJSONDocument(textDocument);

        const position = textDocument.positionAt(ctx.pos);

        const completion = await jsonService.doComplete(textDocument, position, jsonDocument);

        return {
          from: ctx.pos,
          options: completion
            ? completion.items.map((item) => ({
                label: item.label,
                type: item.kind === 10 ? "property" : item.kind === 12 ? "enum" : "value",
                detail: item.detail,
                info: item.documentation,
              }))
            : [],
        };
      } catch (err) {
        console.warn("[InkJsonEditor] JSON Schema completion error", err);
        return null;
      }
    },
  ],
});

// computed

const rootStyles = computed(() => {
  return {
    height: `calc(${props.rows * 1.2}em + var(--sys-space-sm) * 2)`,
  };
});

// --- methods ---
const forceLintRefresh = () => {
  if (editorView) {
    // Trigger lint refresh by dispatching an empty change
    editorView.dispatch({
      changes: { from: 0, insert: "" },
    });
  }
};

const configureSchema = () => {
  if (!props.schema) {
    jsonService.configure({
      schemas: [],
    });
    return;
  }

  jsonService.configure({
    schemas: [
      {
        uri: props.schemaUri,
        fileMatch: ["*"],
        schema: props.schema,
      },
    ],
  });
};

const createEditor = () => {
  if (!editorRef.value) return;

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      json(),
      // JSON Schema support
      jsonSchemaLinter,
      jsonSchemaCompletion,
      // JSON Schema support end
      closeBrackets(),
      keymap.of(closeBracketsKeymap),
      keymap.of([...defaultKeymap, indentWithTab]),
      editableCompartment.of(EditorView.editable.of(props.editable)),
      placeholder(props.placeholder),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newValue = update.state.doc.toString();
          const isValid = isJsonValid(newValue);
          if (isValid) {
            emit("update:modelValue", newValue);
          }
        }
      }),
    ],
  });

  editorView = new EditorView({
    state,
    parent: editorRef.value,
  });
};

const updateEditorValue = (newValue: string) => {
  if (editorView) {
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: newValue,
      },
    });
  }
};

onMounted(() => {
  configureSchema();
  createEditor();
});

onUnmounted(() => {
  editorView?.destroy();
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editorView && editorView.state.doc.toString() !== newValue) {
      updateEditorValue(newValue);
    }
  },
);

watch(
  () => props.editable,
  (newEditable) => {
    if (editorView) {
      editorView.dispatch({
        effects: editableCompartment.reconfigure(EditorView.editable.of(newEditable)),
      });
    }
  },
);

watch(
  () => props.schema,
  () => {
    configureSchema();
    forceLintRefresh();
  },
  { deep: true },
);

const [DefineJsonEditor, ReuseJsonEditor] = createReusableTemplate();
</script>

<template>
  <DefineJsonEditor>
    <div class="ink-json-editor" :style="rootStyles">
      <div
        ref="editorRef"
        :class="['ink-json-editor__editor', { 'ink-json-editor__editor--readonly': !editable }]"
      />
    </div>
  </DefineJsonEditor>

  <InkField v-if="useField" :label="label" :layout="fieldLayout" :required="required">
    <ReuseJsonEditor />
  </InkField>

  <template v-else>
    <ReuseJsonEditor />
  </template>
</template>

<style lang="scss" scoped src="./inkJsonEditor.scss" />
