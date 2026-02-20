# AL Extension

AL Extension toolkit for AL Microsoft Dynamics 365 Business Central developers. It bundles small, focused productivity tools in one extension. All processing is local; there is no backend.

## Commands

### EMT: Fix AL Names Extended Objects

Standardizes the name of AL *extension objects* based on the base object name.

Supported object types:
- `PageExtension`
- `TableExtension`
- `ReportExtension`
- `EnumExtension`
- `PermissionSetExtension`

#### What it does
When you run **EMT: Fix AL Names Extended Objects**, the command:

1. Scans all `.al` files in the workspace
2. Builds the correct extension object name from the `extends` target
3. Shows a preview list (QuickPick) with all proposed changes
4. Lets you select/deselect changes
5. Applies all selected fixes in a single `WorkspaceEdit`

#### Example

**Before**
- `PageExtension 50100 "Wrong Name" extends "Customer"`

**After**
- `PageExtension 50100 "Customer Ext" extends "Customer"`

#### Naming rules
- Starts from the base object name (the `extends` target)
- Keeps as many words as possible within 30 characters
- Appends `Ext`
- If it still exceeds 30 chars, spaces are removed
- If it still exceeds 30 chars, it is truncated

## Usage

1. Open the Command Palette
2. Run **EMT: Fix AL Names Extended Objects**
3. Review the proposed changes and confirm.