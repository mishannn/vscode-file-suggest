"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCode = exports.isImportDeclaration = void 0;
const parser_1 = require("@typescript-eslint/parser");
function isImportDeclaration(program) {
}
exports.isImportDeclaration = isImportDeclaration;
function parseCode(line) {
    try {
        const program = parser_1.parse(line, {});
        console.log(program);
    }
    catch (e) {
        console.log(e.message);
    }
}
exports.parseCode = parseCode;
//# sourceMappingURL=parsing.js.map