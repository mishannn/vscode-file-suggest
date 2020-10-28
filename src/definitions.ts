import { existsSync } from "fs";
import { resolve } from "path";
import { LocationLink, Position, Range, TextDocument, Uri } from "vscode";
import { parseImportPath } from "./document";
import {
  getPossiblePaths as getPossibleDirectoryPaths,
  getDirectoryPath,
  getRootDirectoryPath,
  getFileName,
} from "./fs";

export function getDefinitionLocation(
  document: TextDocument,
  position: Position
): LocationLink[] | undefined {
  console.log("Find definition triggered");

  const line = document.lineAt(position.line);
  const importPath = parseImportPath(line);
  if (!importPath) {
    console.log("Skip find definition process");
    return undefined;
  }

  if (
    position.character < importPath.position ||
    position.character > importPath.position + importPath.length
  ) {
    console.log("Position not match with path");
    return undefined;
  }

  const documentPath = document.fileName;
  const documentDirectoryPath = getDirectoryPath(documentPath);
  const rootDirectoryPath = getRootDirectoryPath();

  const importDirectoryPath = getDirectoryPath(importPath.path);
  const importFileName = getFileName(importPath.path);

  const possibleDirectoryPaths = getPossibleDirectoryPaths(
    importDirectoryPath,
    documentDirectoryPath,
    rootDirectoryPath
  );

  const possibleFilePaths = possibleDirectoryPaths.map((directoryPath) => {
    return resolve(directoryPath, importFileName);
  });

  const locationLinks: LocationLink[] = [];

  possibleFilePaths.forEach((filePath) => {
    if (!existsSync(filePath)) {
      return;
    }

    locationLinks.push({
      targetRange: new Range(new Position(0, 0), new Position(0, 0)),
      targetUri: Uri.file(filePath),
      originSelectionRange: new Range(
        new Position(position.line, importPath.position),
        new Position(position.line, importPath.position + importPath.length)
      ),
    });
  });

  return locationLinks;
}
