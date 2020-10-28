import { resolve } from "path";
import {
  convertCompilerOptionsFromJson,
  findConfigFile,
  readConfigFile,
  sys,
} from "typescript";
import { getDirectoryPath } from "./fs";

export const BASE_URL_ALIAS = "__BASE_URL__";

export interface PathAlias {
  alias: string;
  path: string;
}

export function getCompilerOptions(config: any, directoryPath: string) {
  if (!config?.compilerOptions) {
    return undefined;
  }

  const convertCompilerOptionsResult = convertCompilerOptionsFromJson(
    config.compilerOptions,
    directoryPath
  );

  if (convertCompilerOptionsResult.errors.length) {
    return undefined;
  }

  return convertCompilerOptionsResult.options;
}

export function getPathsAliases(documentDirectoryPath: string) {
  const pathsAliases: PathAlias[] = [];

  let configFilePath = findConfigFile(
    documentDirectoryPath,
    sys.fileExists,
    "tsconfig.json"
  );

  if (!configFilePath) {
    return pathsAliases;
  }

  const readConfigFileResult = readConfigFile(configFilePath, sys.readFile);
  if (readConfigFileResult.error) {
    return pathsAliases;
  }

  const config = readConfigFileResult.config;
  if (!config) {
    return pathsAliases;
  }

  const configDirectoryPath = getDirectoryPath(configFilePath);

  const compilerOptions = getCompilerOptions(config, configDirectoryPath);
  if (!compilerOptions) {
    return pathsAliases;
  }

  const baseUrl = compilerOptions.baseUrl;
  if (!baseUrl) {
    return pathsAliases;
  }

  pathsAliases.push({
    alias: BASE_URL_ALIAS,
    path: baseUrl,
  });

  const paths = compilerOptions.paths;
  if (!paths) {
    return pathsAliases;
  }

  Object.keys(paths).forEach((alias) => {
    paths[alias].forEach((path) => {
      const aliasDirectoryPath = getDirectoryPath(alias);
      const directoryPath = getDirectoryPath(path);

      pathsAliases.push({
        alias: aliasDirectoryPath,
        path: resolve(baseUrl, directoryPath),
      });
    });
  });

  return pathsAliases;
}
