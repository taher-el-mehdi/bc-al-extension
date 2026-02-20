export const DEFAULT_MAX_NAME_LENGTH = 30;

export function buildExtensionName(baseName: string, maxLength: number = DEFAULT_MAX_NAME_LENGTH): string {
  const cleaned = baseName.trim();
  if (!cleaned) {
    return "Ext";
  }

  const parts = cleaned.split(/\s+/);
  let result = "";

  for (const part of parts) {
    const next = result ? `${result} ${part}` : part;
    if (next.length <= maxLength) {
      result = next;
    } else {
      break;
    }
  }

  let candidate = `${result} Ext`;
  if (candidate.length > maxLength) {
    candidate = candidate.replace(/\s+/g, "");
  }
  if (candidate.length > maxLength) {
    candidate = candidate.slice(0, maxLength);
  }

  return candidate;
}
