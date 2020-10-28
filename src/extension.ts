import { DocumentSelector, ExtensionContext, languages } from "vscode";
import { getCompletetionItems } from "./completions";
import { getDefinitionLocation } from "./definitions";

function getDocumentSelector(languages: string[]): DocumentSelector {
  return languages.map((language) => {
    return {
      scheme: "file",
      language,
    };
  });
}

export function activate(context: ExtensionContext) {
  console.log("Extension activated");

  const triggerCharacters = ["/"];
  const documentSelector = getDocumentSelector([
    "typescript",
    "typescriptreact",
  ]);

  const completionProvider = languages.registerCompletionItemProvider(
    documentSelector,
    {
      provideCompletionItems(document, position) {
        return getCompletetionItems(document, position);
      },
    },
    ...triggerCharacters
  );

  context.subscriptions.push(completionProvider);
  console.log("Completion provider registered");

  const definitionProvider = languages.registerDefinitionProvider(
    documentSelector,
    {
      provideDefinition(document, position) {
        return getDefinitionLocation(document, position);
      },
    }
  );

  context.subscriptions.push(definitionProvider);
  console.log("Definition provider registered");
}

// export function deactivate() {}
