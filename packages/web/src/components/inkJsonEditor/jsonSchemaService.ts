import { getLanguageService } from "vscode-json-languageservice";
import { TextDocument } from "vscode-languageserver-textdocument";

export const jsonService = getLanguageService({
  schemaRequestService: async (uri) => {
    const res = await fetch(uri);
    return res.text();
  },
});
