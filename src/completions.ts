import {
  CompletionItem,
  CompletionItemKind,
  Position,
  TextDocument,
  workspace,
} from "vscode";
import { parseImportPath } from "./document";
import {
  EXCLUDED_EXTENSIONS,
  getDirectoryPath,
  getFileNamesByDirectoryPath,
  getMappedPaths,
  getTargetDirectoryPath,
} from "./fs";

export function shouldTrigger(userPath: string) {
  return userPath && userPath !== ".";
}

export function getCompletetionItems(
  document: TextDocument,
  position: Position
) {
  const line = document.lineAt(position.line);

  const userPath = parseImportPath(line, position);
  if (!shouldTrigger(userPath)) {
    return undefined;
  }

  const documentPath = document.fileName;
  const documentDirectoryPath = getDirectoryPath(documentPath);
  const targetDirectoryPath = getTargetDirectoryPath(
    documentDirectoryPath,
    userPath
  );
  const mappedPaths = getMappedPaths(documentDirectoryPath, userPath);
  const allDirectoryPaths = [targetDirectoryPath, ...mappedPaths];

  console.log(allDirectoryPaths);

  const allFileNames: string[] = [];
  allDirectoryPaths.forEach((directoryPath) => {
    console.log(directoryPath);
    const fileNames = getFileNamesByDirectoryPath(
      directoryPath,
      EXCLUDED_EXTENSIONS
    );
    console.log(fileNames);
    allFileNames.push(...fileNames);
  });

  return [...new Set(allFileNames)].map((fileName) => {
    return new CompletionItem(fileName, CompletionItemKind.File);
  });
}
