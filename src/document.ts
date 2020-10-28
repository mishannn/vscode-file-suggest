import { Position, TextLine } from "vscode";

export interface ImportPath {
  path: string;
  position: number;
  length: number;
}

export function parseImportInput(line: TextLine, position: Position) {
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

export function parseImportPath(line: TextLine): ImportPath | undefined {
  const text = line.text;

  const staticImportMatch = text.match(/\b(from|import)\s*["'`]([^'"`]*)/);
  if (staticImportMatch) {
    return {
      path: staticImportMatch[2],
      position: text.indexOf(staticImportMatch[2]),
      length: staticImportMatch[2].length,
    };
  }

  const dynamicImportMatch = text.match(/\b(import|require)\(['"`]([^'"`]*)/);
  if (dynamicImportMatch) {
    return {
      path: dynamicImportMatch[2],
      position: text.indexOf(dynamicImportMatch[2]),
      length: dynamicImportMatch[2].length,
    };
  }

  return undefined;
}
