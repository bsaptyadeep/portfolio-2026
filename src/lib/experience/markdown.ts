const LIST_ITEM_RE = /^(?:[-*+]|\d+\.)\s+/;

const MAX_PROSE_CHARS = 320;

export function countMarkdownListItems(content: string): number {
  return content
    .trim()
    .split("\n")
    .filter((line) => LIST_ITEM_RE.test(line)).length;
}

/**
 * Returns a preview of experience markdown with at most `maxPoints` bullet items.
 * Falls back to character truncation when there are no list items.
 */
export function truncateExperienceMarkdown(
  content: string,
  maxPoints = 3
): { preview: string; hasMore: boolean } {
  const trimmed = content.trim();
  if (!trimmed) return { preview: "", hasMore: false };

  const lines = trimmed.split("\n");
  const output: string[] = [];
  let bulletIndex = 0;
  let skipping = false;

  for (const line of lines) {
    const isBullet = LIST_ITEM_RE.test(line);

    if (isBullet) {
      if (bulletIndex >= maxPoints) {
        skipping = true;
        continue;
      }
      bulletIndex++;
      skipping = false;
      output.push(line);
      continue;
    }

    if (skipping) continue;

    if (output.length > 0 && bulletIndex > 0 && /^\s+/.test(line)) {
      output.push(line);
      continue;
    }

    output.push(line);
  }

  const totalBullets = countMarkdownListItems(trimmed);
  if (totalBullets > maxPoints) {
    return { preview: output.join("\n").trimEnd(), hasMore: true };
  }

  if (totalBullets === 0 && trimmed.length > MAX_PROSE_CHARS) {
    const cut = trimmed.slice(0, MAX_PROSE_CHARS).replace(/\s+\S*$/, "");
    return { preview: `${cut}…`, hasMore: true };
  }

  return { preview: trimmed, hasMore: false };
}
