"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseImportPath = void 0;
function parseImportPath(line, position) {
    const pre = line.text.slice(0, position.character);
    const staticImportMatch = pre.match(/\b(from|import)\s*["'`]([^'"`]*)/);
    const dynamicImportMatch = pre.match(/\b(import|require)\(['"`]([^'"`]*)/);
    if (staticImportMatch) {
        return staticImportMatch[2];
    }
    if (dynamicImportMatch) {
        return dynamicImportMatch[2];
    }
    return "";
}
exports.parseImportPath = parseImportPath;
//# sourceMappingURL=document.js.map