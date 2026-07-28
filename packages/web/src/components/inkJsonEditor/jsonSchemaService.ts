import { getLanguageService } from "vscode-json-languageservice";

export const jsonService = getLanguageService({
  schemaRequestService: async (uri) => {
    const res = await fetch(uri);
    return res.text();
  },
});
