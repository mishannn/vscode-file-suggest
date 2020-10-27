import { existsSync, readdirSync, statSync } from "fs";
import { isAbsolute, join, parse } from "path";
import { getPathsAliases } from "./aliases";

export const PATH_SEPARATOR_CHARACTERS = ["/", "\\"];

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
    if (userPath.indexOf(pathAlias.alias) === 0) {
      mappedPaths.push(userPath.replace(pathAlias.alias, pathAlias.path));
    }
  });

  return mappedPaths;
}

export function getTargetDirectoryPath(
  documentDirectoryPath: string,
  userPath: string
) {
  let targetDirectoryPath: string;

  if (!isAbsolutePath(userPath)) {
    targetDirectoryPath = join(documentDirectoryPath, userPath);
  } else {
    targetDirectoryPath = userPath;
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
  return parse(filePath).dir;
}
