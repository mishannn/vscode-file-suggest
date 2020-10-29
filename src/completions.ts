import { relative } from "path";
import {
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
  Position,
  TextDocument,
} from "vscode";
import { parseImportInput } from "./document";
import {
  EXCLUDED_EXTENSIONS,
  getPossiblePaths,
  getDirectoryPath,
  getFileNamesByDirectoryPath,
  getRootDirectoryPath,
} from "./fs";

interface FileItem {
  directoryPath: string;
  fileName: string;
}

export function shouldTrigger(userPath: string) {
  return userPath !== ".";
}

export function getCompletetionItems(
  document: TextDocument,
  position: Position
) {
  console.log("Completions triggered");

  const line = document.lineAt(position.line);

  const importInput = parseImportInput(line, position);
  if (importInput === undefined || !shouldTrigger(importInput)) {
    console.log("Skip completion process");
    return undefined;
  }

  const documentPath = document.fileName;
  const documentDirectoryPath = getDirectoryPath(documentPath);
  const rootDirectoryPath = getRootDirectoryPath();

  const possiblePaths = getPossiblePaths(
    importInput,
    documentDirectoryPath,
    rootDirectoryPath
  );

  const allFileItems: FileItem[] = [];
  possiblePaths.forEach((possiblePath) => {
    const fileNames = getFileNamesByDirectoryPath(
      possiblePath,
      EXCLUDED_EXTENSIONS
    );
    allFileItems.push(
      ...fileNames.map((fileName) => {
        return {
          directoryPath: possiblePath,
          fileName,
        };
      })
    );
  });

  console.log(`Found ${allFileItems.length} files in path ${importInput}`);

  return [...new Set(allFileItems)].map((item) => {
    const completionItem = new CompletionItem(
      item.fileName,
      CompletionItemKind.File
    );

    const directoryPath = rootDirectoryPath
      ? relative(rootDirectoryPath, item.directoryPath)
      : item.directoryPath;
    const documentation = new MarkdownString(
      `**From:** \`${directoryPath}\`  \n*Found within \`File Suggest\` extension*`
    );

    completionItem.documentation = documentation;

    return completionItem;
  });
}
