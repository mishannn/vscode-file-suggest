import { Position, TextLine } from "vscode";

export function parseImportPath(line: TextLine, position: Position) {
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
