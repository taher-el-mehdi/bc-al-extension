import * as vscode from "vscode";
import { buildExtensionName } from "../utils/nameUtils";

export interface ExtensionHeaderInfo {
  objectType: string;
  objectId: string;
  currentName: string;
  extendsName: string;
  lineIndex: number;
  rawLine: string;
  desiredName: string;
  desiredLine: string;
}

const extensionHeaderRegex = /^\s*(pageextension|tableextension|reportextension|enumextension|permissionsetextension)\s*(\d+)\s*(?:"([^"]*)"|([A-Za-z0-9_]+))?\s*extends\s+(?:"([^"]*)"|([A-Za-z0-9_\/]+))\s*$/i;

export function parseExtensionHeader(document: vscode.TextDocument): ExtensionHeaderInfo | null {
  const headers = parseExtensionHeaders(document);
  return headers[0] ?? null;
}

export function parseExtensionHeaders(document: vscode.TextDocument): ExtensionHeaderInfo[] {
  const headers: ExtensionHeaderInfo[] = [];
  const lineCount = document.lineCount;
  for (let i = 0; i < lineCount; i += 1) {
    const lineText = document.lineAt(i).text;
    const trimmed = lineText.trim();
    if (!trimmed) {
      continue;
    }

    if (trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
      continue;
    }

    const match = extensionHeaderRegex.exec(lineText);
    if (!match) {
      continue;
    }

    const objectType = match[1];
    const objectId = match[2];
    const currentName = match[3] ?? match[4] ?? "";
    const extendsName = match[5] ?? match[6] ?? "";
    const desiredName = buildExtensionName(extendsName);
    const desiredLine = `${objectType} ${objectId} "${desiredName}" extends "${extendsName}"`;

    headers.push({
      objectType,
      objectId,
      currentName,
      extendsName,
      lineIndex: i,
      rawLine: lineText,
      desiredName,
      desiredLine,
    });
  }

  return headers;
}
