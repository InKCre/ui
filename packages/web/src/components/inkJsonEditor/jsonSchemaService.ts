import { getLanguageService, type JSONSchema, type ErrorCode } from "vscode-json-languageservice";

// Configuration and resolved-schema caches belong to one form/editor instance.
export function createJsonService(schema?: JSONSchema, uri = "inkcre://schema.json") {
  const service = getLanguageService({
    schemaRequestService: async (uri) => {
      const response = await fetch(uri);
      if (!response.ok) throw new Error(`Unable to load schema ${uri}: HTTP ${response.status}`);
      return response.text();
    },
  });
  // The language service resolves $ref in place. Keep caller-owned reactive schema objects intact.
  service.configure({
    validate: true,
    schemas: schema
      ? [
          {
            uri,
            fileMatch: ["*"],
            schema: JSON.parse(JSON.stringify(schema)),
          },
        ]
      : [],
  });
  return service;
}

export interface JsonEditorValidation {
  text: string;
  status: "pending" | "valid" | "invalid" | "error";
  valid: boolean;
  messages: string[];
}

// This enum is re-exported by the CJS dependency in a way Node ESM cannot statically import.
// The member type checks the protocol value without depending on that runtime re-export.
export const SCHEMA_RESOLVE_ERROR: ErrorCode.SchemaResolveError = 0x300;
