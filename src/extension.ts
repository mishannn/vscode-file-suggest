import {
  CompletionItem,
  CompletionList,
  ExtensionContext,
  languages,
  Position,
  ProviderResult,
  TextDocument,
} from "vscode";
import { getCompletetionItems } from "./completions";

export function activate(context: ExtensionContext) {
  const triggerCharacters = ["/"];
  const documentSelector = [
    { language: "typescript" },
    { language: "typescriptreact" },
  ];

  const provider = languages.registerCompletionItemProvider(
    documentSelector,
    {
      provideCompletionItems(
        document: TextDocument,
        position: Position
      ): ProviderResult<CompletionItem[] | CompletionList> {
        return getCompletetionItems(document, position);
      },
    },
    ...triggerCharacters
  );

  context.subscriptions.push(provider);
}

// export function deactivate() {}
