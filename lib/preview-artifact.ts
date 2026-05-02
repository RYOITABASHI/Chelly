const PREVIEW_RE = /CHELLY_PREVIEW:([^\s]+)/;

export function extractPreviewPath(output: string): string | null {
  const match = output.match(PREVIEW_RE);
  return match?.[1]?.trim() ?? null;
}

export function extractFirstPreviewPath(outputs: string[]): string | null {
  for (const output of outputs) {
    const path = extractPreviewPath(output);
    if (path) return path;
  }
  return null;
}
