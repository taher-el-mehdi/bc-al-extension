import * as vscode from "vscode";
import { parseExtensionHeaders, ExtensionHeaderInfo } from "./alParser";

export interface ProposedChange {
  uri: vscode.Uri;
  range: vscode.Range;
  oldLine: string;
  newLine: string;
  header: ExtensionHeaderInfo;
}

export async function collectProposedChanges(uris: vscode.Uri[]): Promise<ProposedChange[]> {
  const changes: ProposedChange[] = [];

  for (const uri of uris) {
    const document = await vscode.workspace.openTextDocument(uri);
    const headers = parseExtensionHeaders(document);
    if (headers.length === 0) {
      continue;
    }

    for (const headerInfo of headers) {
      if (headerInfo.rawLine.trim() === headerInfo.desiredLine.trim()) {
        continue;
      }

      const lineRange = document.lineAt(headerInfo.lineIndex).range;

      changes.push({
        uri,
        range: lineRange,
        oldLine: headerInfo.rawLine,
        newLine: headerInfo.desiredLine,
        header: headerInfo,
      });
    }
  }

  return changes;
}
