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
  console.log("Extension activated");

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
  console.log("Completion provider registered");

  context.subscriptions.push(provider);
}

// export function deactivate() {}
