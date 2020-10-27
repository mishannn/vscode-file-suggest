"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletetionItems = exports.shouldTrigger = void 0;
const vscode_1 = require("vscode");
const document_1 = require("./document");
const fs_1 = require("./fs");
function shouldTrigger(userPath) {
    return userPath && userPath !== ".";
}
exports.shouldTrigger = shouldTrigger;
function getCompletetionItems(document, position) {
    const line = document.lineAt(position.line);
    const userPath = document_1.parseImportPath(line, position);
    if (!shouldTrigger(userPath)) {
        return undefined;
    }
    const documentPath = document.fileName;
    const documentDirectoryPath = fs_1.getDirectoryPath(documentPath);
    const targetDirectoryPath = fs_1.getTargetDirectoryPath(documentDirectoryPath, userPath);
    const mappedPaths = fs_1.getMappedPaths(documentDirectoryPath, userPath);
    const allDirectoryPaths = [targetDirectoryPath, ...mappedPaths];
    console.log(allDirectoryPaths);
    const allFileNames = [];
    allDirectoryPaths.forEach((directoryPath) => {
        console.log(directoryPath);
        const fileNames = fs_1.getFileNamesByDirectoryPath(directoryPath, fs_1.EXCLUDED_EXTENSIONS);
        console.log(fileNames);
        allFileNames.push(...fileNames);
    });
    return [...new Set(allFileNames)].map((fileName) => {
        return new vscode_1.CompletionItem(fileName, vscode_1.CompletionItemKind.File);
    });
}
exports.getCompletetionItems = getCompletetionItems;
//# sourceMappingURL=completions.js.map