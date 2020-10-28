import { resolve } from "path";
import { getDirectoryPath, isDirectoryPath } from "./fs";

const MODULE_PATH_REGEXP = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*(\/.*)?$/;

export function getModulesDirectoryPaths(
  documentDirectoryPath: string,
  rootDirectoryPath: string,
  userPath: string
) {
  let modulesDirectoryPaths: string[] = [];

  if (!userPath.match(MODULE_PATH_REGEXP)) {
    return modulesDirectoryPaths;
  }

  let currentDirectoryPath = documentDirectoryPath;

  while (currentDirectoryPath) {
    const maybeModulesDirectoryPath = resolve(
      currentDirectoryPath,
      "node_modules"
    );

    if (isDirectoryPath(maybeModulesDirectoryPath)) {
      modulesDirectoryPaths.push(resolve(maybeModulesDirectoryPath, userPath));
    }

    if (currentDirectoryPath === rootDirectoryPath) {
      currentDirectoryPath = "";
    } else {
      currentDirectoryPath = getDirectoryPath(currentDirectoryPath);
    }
  }

  return modulesDirectoryPaths;
}
