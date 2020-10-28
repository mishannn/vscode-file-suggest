import { relative } from "path";
import {
  CompletionItem,
  CompletionItemKind,
  MarkdownString,
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
  getRootDirectoryPath,
  getTargetDirectoryPath,
} from "./fs";
import { getModulesDirectoryPaths } from "./modules";

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
  const line = document.lineAt(position.line);

  const userPath = parseImportPath(line, position);
  if (!shouldTrigger(userPath)) {
    return undefined;
  }

  const documentPath = document.fileName;
  const documentDirectoryPath = getDirectoryPath(documentPath);
  const rootDirectoryPath = getRootDirectoryPath();

  const targetDirectoryPath = getTargetDirectoryPath(
    documentDirectoryPath,
    userPath
  );

  const mappedPaths = getMappedPaths(documentDirectoryPath, userPath);

  let modulesDirectoryPaths: string[] = [];
  if (rootDirectoryPath) {
    modulesDirectoryPaths = getModulesDirectoryPaths(
      documentDirectoryPath,
      rootDirectoryPath,
      userPath
    );
  }

  const allDirectoryPaths = [];
  if (targetDirectoryPath) {
    allDirectoryPaths.push(targetDirectoryPath);
  }

  if (mappedPaths.length) {
    allDirectoryPaths.push(...mappedPaths);
  }

  if (modulesDirectoryPaths.length) {
    allDirectoryPaths.push(...modulesDirectoryPaths);
  }

  // console.log(allDirectoryPaths);

  const allFileItems: FileItem[] = [];
  allDirectoryPaths.forEach((directoryPath) => {
    const fileNames = getFileNamesByDirectoryPath(
      directoryPath,
      EXCLUDED_EXTENSIONS
    );
    allFileItems.push(
      ...fileNames.map((fileName) => {
        return {
          directoryPath,
          fileName,
        };
      })
    );
  });

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
