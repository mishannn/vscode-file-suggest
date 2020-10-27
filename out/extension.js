"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
const completions_1 = require("./completions");
function activate(context) {
    const triggerCharacters = ["/"];
    const documentSelector = [
        { language: "typescript" },
        { language: "typescriptreact" },
    ];
    const provider = vscode_1.languages.registerCompletionItemProvider(documentSelector, {
        provideCompletionItems(document, position) {
            return completions_1.getCompletetionItems(document, position);
        },
    }, ...triggerCharacters);
    context.subscriptions.push(provider);
}
exports.activate = activate;
// export function deactivate() {}
//# sourceMappingURL=extension.js.map