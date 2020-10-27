"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectoryPath = exports.isDirectoryPath = exports.isFilePath = exports.isAbsolutePath = exports.getFileNamesByDirectoryPath = exports.getTargetDirectoryPath = exports.getMappedPaths = exports.EXCLUDED_EXTENSIONS = exports.PATH_SEPARATOR_CHARACTERS = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const aliases_1 = require("./aliases");
exports.PATH_SEPARATOR_CHARACTERS = ["/", "\\"];
exports.EXCLUDED_EXTENSIONS = [
    ".ts",
    ".tsx",
    ".d.ts",
    ".js",
    ".jsx",
    ".json",
    ".tsbuildinfo",
];
function getMappedPaths(documentDirectoryPath, userPath) {
    const pathsAliases = aliases_1.getPathsAliases(documentDirectoryPath);
    const mappedPaths = [];
    pathsAliases.forEach((pathAlias) => {
        if (userPath.indexOf(pathAlias.alias) === 0) {
            mappedPaths.push(userPath.replace(pathAlias.alias, pathAlias.path));
        }
    });
    return mappedPaths;
}
exports.getMappedPaths = getMappedPaths;
function getTargetDirectoryPath(documentDirectoryPath, userPath) {
    let targetDirectoryPath;
    if (!isAbsolutePath(userPath)) {
        targetDirectoryPath = path_1.join(documentDirectoryPath, userPath);
    }
    else {
        targetDirectoryPath = userPath;
    }
    if (!isDirectoryPath(targetDirectoryPath, false)) {
        targetDirectoryPath = getDirectoryPath(targetDirectoryPath);
    }
    return targetDirectoryPath;
}
exports.getTargetDirectoryPath = getTargetDirectoryPath;
function getFileNamesByDirectoryPath(directoryPath, excludedExtensions) {
    if (!isDirectoryPath(directoryPath)) {
        return [];
    }
    const directoryItems = fs_1.readdirSync(directoryPath);
    const files = directoryItems.filter((item) => {
        return isFilePath(path_1.join(directoryPath, item));
    });
    return files.filter((file) => {
        return !excludedExtensions.includes(path_1.parse(file).ext);
    });
}
exports.getFileNamesByDirectoryPath = getFileNamesByDirectoryPath;
function isAbsolutePath(path) {
    return path_1.isAbsolute(path);
}
exports.isAbsolutePath = isAbsolutePath;
function isFilePath(path) {
    return fs_1.statSync(path).isFile();
}
exports.isFilePath = isFilePath;
function isDirectoryPath(path, existsRequired = true) {
    return ((fs_1.existsSync(path) && fs_1.statSync(path).isDirectory()) ||
        (!existsRequired &&
            path.length &&
            exports.PATH_SEPARATOR_CHARACTERS.includes(path.charAt(path.length - 1))));
}
exports.isDirectoryPath = isDirectoryPath;
function getDirectoryPath(filePath) {
    return path_1.parse(filePath).dir;
}
exports.getDirectoryPath = getDirectoryPath;
//# sourceMappingURL=fs.js.map