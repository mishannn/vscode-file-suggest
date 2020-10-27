"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPathsAliases = exports.getCompilerOptions = void 0;
const path_1 = require("path");
const typescript_1 = require("typescript");
const fs_1 = require("./fs");
function getCompilerOptions(config, directoryPath) {
    if (!(config === null || config === void 0 ? void 0 : config.compilerOptions)) {
        return undefined;
    }
    const convertCompilerOptionsResult = typescript_1.convertCompilerOptionsFromJson(config.compilerOptions, directoryPath);
    if (convertCompilerOptionsResult.errors.length) {
        return undefined;
    }
    return convertCompilerOptionsResult.options;
}
exports.getCompilerOptions = getCompilerOptions;
function getPathsAliases(documentDirectoryPath) {
    const pathsAliases = [];
    let configFilePath = typescript_1.findConfigFile(documentDirectoryPath, typescript_1.sys.fileExists, "tsconfig.json");
    if (!configFilePath) {
        return pathsAliases;
    }
    const readConfigFileResult = typescript_1.readConfigFile(configFilePath, typescript_1.sys.readFile);
    if (readConfigFileResult.error) {
        return pathsAliases;
    }
    const config = readConfigFileResult.config;
    if (!config) {
        return pathsAliases;
    }
    const configDirectoryPath = fs_1.getDirectoryPath(configFilePath);
    const compilerOptions = getCompilerOptions(config, configDirectoryPath);
    if (!compilerOptions) {
        return pathsAliases;
    }
    const paths = compilerOptions.paths;
    if (!paths) {
        return pathsAliases;
    }
    const baseUrl = compilerOptions.baseUrl;
    if (!baseUrl) {
        return pathsAliases;
    }
    Object.keys(paths).forEach((alias) => {
        paths[alias].forEach((path) => {
            const aliasDirectoryPath = fs_1.getDirectoryPath(alias);
            const directoryPath = fs_1.getDirectoryPath(path);
            pathsAliases.push({
                alias: aliasDirectoryPath,
                path: path_1.resolve(baseUrl, directoryPath),
            });
        });
    });
    return pathsAliases;
}
exports.getPathsAliases = getPathsAliases;
//# sourceMappingURL=aliases.js.map