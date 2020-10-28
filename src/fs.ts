import { existsSync, readdirSync, statSync } from "fs";
import { isAbsolute, join, normalize, parse, resolve } from "path";
import { workspace } from "vscode";
import { BASE_URL_ALIAS, getPathsAliases } from "./aliases";
import { getModulesDirectoryPaths } from "./modules";

export const PATH_SEPARATOR_CHARACTERS = ["/", "\\"];
export const PATH_SEPARATOR_REGEXP = /(\/|\\)/;

export const EXCLUDED_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".d.ts",
  ".js",
  ".jsx",
  ".json",
  ".tsbuildinfo",
];

export function getMappedPaths(
  documentDirectoryPath: string,
  userPath: string
) {
  const pathsAliases = getPathsAliases(documentDirectoryPath);

  const mappedPaths: string[] = [];
  pathsAliases.forEach((pathAlias) => {
    if (pathAlias.alias === BASE_URL_ALIAS && !isRelativePath(userPath)) {
      mappedPaths.push(resolve(pathAlias.path, userPath));
      return;
    }

    if (userPath.indexOf(pathAlias.alias) === 0) {
      mappedPaths.push(
        normalize(userPath.replace(pathAlias.alias, pathAlias.path))
      );
    }
  });

  return mappedPaths;
}

export function getTargetDirectoryPath(
  documentDirectoryPath: string,
  userPath: string
) {
  let targetDirectoryPath: string;

  if (isAbsolutePath(userPath)) {
    targetDirectoryPath = userPath;
  } else if (isRelativePath(userPath)) {
    targetDirectoryPath = resolve(documentDirectoryPath, userPath);
  } else {
    targetDirectoryPath = "";
  }

  if (!targetDirectoryPath) {
    return targetDirectoryPath;
  }

  if (!isDirectoryPath(targetDirectoryPath, false)) {
    targetDirectoryPath = getDirectoryPath(targetDirectoryPath);
  }

  return targetDirectoryPath;
}

export function getFileNamesByDirectoryPath(
  directoryPath: string,
  excludedExtensions: string[]
) {
  if (!isDirectoryPath(directoryPath)) {
    return [];
  }

  const directoryItems = readdirSync(directoryPath);

  const files = directoryItems.filter((item) => {
    return isFilePath(join(directoryPath, item));
  });

  return files.filter((file) => {
    return !excludedExtensions.includes(parse(file).ext);
  });
}

export function isAbsolutePath(path: string) {
  return isAbsolute(path);
}

export function isRelativePath(path: string) {
  return (
    path === "." ||
    path.indexOf("./") === 0 ||
    path === ".." ||
    path.indexOf("../") === 0
  );
}

export function isFilePath(path: string) {
  return statSync(path).isFile();
}

export function isDirectoryPath(path: string, existsRequired = true) {
  return (
    (existsSync(path) && statSync(path).isDirectory()) ||
    (!existsRequired &&
      path.length &&
      PATH_SEPARATOR_CHARACTERS.includes(path.charAt(path.length - 1)))
  );
}

export function getDirectoryPath(filePath: string) {
  return normalize(parse(filePath).dir);
}

export function getFileName(filePath: string) {
  return normalize(parse(filePath).base);
}

export function getRootDirectoryPath() {
  const path = workspace.workspaceFolders?.[0].uri.path;
  if (!path) {
    return undefined;
  }

  return normalize(path);
}

export function getPossiblePaths(
  importInput: string,
  documentDirectoryPath: string,
  rootDirectoryPath?: string
) {
  const targetDirectoryPath = getTargetDirectoryPath(
    documentDirectoryPath,
    importInput
  );

  const mappedPaths = getMappedPaths(documentDirectoryPath, importInput);

  let modulesDirectoryPaths: string[] = [];
  if (rootDirectoryPath) {
    modulesDirectoryPaths = getModulesDirectoryPaths(
      documentDirectoryPath,
      rootDirectoryPath,
      importInput
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

  return allDirectoryPaths;
}
