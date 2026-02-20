import * as vscode from "vscode";
import { runFixExtendedNamesCommand } from "./commands/fixExtendedNames";

export function activate(context: vscode.ExtensionContext): void {
  const fixExtendedNamesCommand = vscode.commands.registerCommand(
    "emt.fixAlNamesExtendedObjects",
    runFixExtendedNamesCommand
  );

  context.subscriptions.push(fixExtendedNamesCommand);
}

export function deactivate(): void {
  // no-op
}
