import * as vscode from "vscode";
import { collectProposedChanges, ProposedChange } from "../services/renameService";

interface ChangePickItem extends vscode.QuickPickItem {
  change: ProposedChange;
}

export async function runFixExtendedNamesCommand(): Promise<void> {
  const proposedChanges = await vscode.window.withProgress<ProposedChange[]>(
    {
      location: vscode.ProgressLocation.Notification,
      title: "EMT: Fix AL Names Extended Objects",
      cancellable: true,
    },
    async (progress, token) => {
      progress.report({ message: "Scanning .al files..." });
      const files = await vscode.workspace.findFiles("**/*.al", "**/node_modules/**");

      if (token.isCancellationRequested) {
        return [];
      }

      if (files.length === 0) {
        await vscode.window.showInformationMessage("No .al files found in the workspace.");
        return [];
      }

      progress.report({ message: "Analyzing files for extended object name..." });
      const proposed = await collectProposedChanges(files);

      if (token.isCancellationRequested) {
        return [];
      }

      if (proposed.length === 0) {
        await vscode.window.showInformationMessage("No extended object names need fixing.");
        return [];
      }

      return proposed;
    }
  );

  if (proposedChanges.length === 0) {
    return;
  }

  const items: ChangePickItem[] = proposedChanges.map((change) => {
    const relativePath = vscode.workspace.asRelativePath(change.uri);
    return {
      label: relativePath,
      description: "Preview update",
      detail: `"${change.header.currentName || "(missing)"}" → "${change.header.desiredName}"`,
      picked: true,
      change,
    };
  });

  const selected = await vscode.window.showQuickPick(items, {
    canPickMany: true,
    matchOnDescription: true,
    matchOnDetail: true,
    placeHolder: "Select the fixes to apply",
  });

  if (!selected || selected.length === 0) {
    return;
  }

  const applied = await vscode.window.withProgress<boolean>(
    {
      location: vscode.ProgressLocation.Notification,
      title: "EMT: Fix AL Names Extended Objects",
      cancellable: false,
    },
    async (progress) => {
      progress.report({ message: "Applying changes..." });
      const edit = new vscode.WorkspaceEdit();
      for (const item of selected) {
        edit.replace(item.change.uri, item.change.range, item.change.newLine);
      }

      return vscode.workspace.applyEdit(edit);
    }
  );

  if (!applied) {
    await vscode.window.showErrorMessage("Failed to apply fixes.");
    return;
  }

  await vscode.window.showInformationMessage(`Applied ${selected.length} fixes.`);
}
