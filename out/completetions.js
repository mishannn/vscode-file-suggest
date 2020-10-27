"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompletetionItems = void 0;
const vscode_1 = require("vscode");
function shouldTrigger(context, line, position) {
    if (context.triggerCharacter) {
        if (context.triggerCharacter === "/") {
            const pre = line.text.slice(0, position.character);
            if (!pre.match(/\b(from|import)\s*["'][^'"]*$/) &&
                !pre.match(/\b(import|require)\(['"][^'"]*$/)) {
                return false;
            }
        }
    }
    return true;
}
function getCompletetionItems(document, position, context) {
    const line = document.lineAt(position.line);
    if (!shouldTrigger(context, line, position)) {
        console.log('SKIP');
        return undefined;
    }
    console.log('TRIGGER');
    return [
        new vscode_1.CompletionItem("LOL", vscode_1.CompletionItemKind.Property),
        new vscode_1.CompletionItem("KEK", vscode_1.CompletionItemKind.Property),
    ];
}
exports.getCompletetionItems = getCompletetionItems;
//# sourceMappingURL=completetions.js.map