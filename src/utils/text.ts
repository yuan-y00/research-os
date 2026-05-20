const SENTENCE_BREAKS = /[。！？]/g;

/**
 * Truncate text to maxLength characters, trying to break at Chinese sentence boundaries (。！？).
 * Always adds "…" at truncation point.
 * Never returns empty string - at minimum returns first 20 chars.
 */
export function clampText(text: string, maxLength: number): string {
  if (!text) return '';

  // If text is already short enough, return as-is
  if (text.length <= maxLength) return text;

  // Collect all sentence break positions
  const breaks: number[] = [];
  let match: RegExpExecArray | null;
  const regex = new RegExp(SENTENCE_BREAKS.source, 'g');
  while ((match = regex.exec(text)) !== null) {
    breaks.push(match.index + 1); // include the punctuation
  }

  // Find the last break that fits within maxLength - 1 (leaving room for "…")
  let cutPoint = -1;
  for (let i = breaks.length - 1; i >= 0; i--) {
    if (breaks[i] <= maxLength - 1) {
      cutPoint = breaks[i];
      break;
    }
  }

  if (cutPoint > 0) {
    return text.slice(0, cutPoint) + '…';
  }

  // No suitable break found - hard break at maxLength - 3, minimum 20
  const hardCut = Math.max(20, maxLength - 3);
  if (hardCut >= text.length) return text;
  return text.slice(0, hardCut) + '…';
}

/**
 * Get first sentence (ends at 。！？) or fallback to first maxLength chars.
 * If first sentence is shorter than 20 chars, include the next sentence too.
 * Never returns empty string - at minimum returns first 20 chars.
 */
export function firstSentence(text: string, fallbackLength: number = 120): string {
  if (!text) return '';

  // Find first sentence break
  const firstBreak = text.search(SENTENCE_BREAKS);
  if (firstBreak === -1) {
    // No sentence break found, use fallback
    return clampText(text, fallbackLength);
  }

  const firstEnd = firstBreak + 1; // include the punctuation

  // If first sentence is too short, look for the next one
  if (firstEnd < 20) {
    const remaining = text.slice(firstEnd);
    const secondBreak = remaining.search(SENTENCE_BREAKS);
    if (secondBreak !== -1) {
      const secondEnd = firstEnd + secondBreak + 1;
      if (secondEnd <= fallbackLength) return text.slice(0, secondEnd);
      return text.slice(0, firstEnd) + '…';
    }
    // No second break - return first sentence or clamp
    if (firstEnd <= fallbackLength) return text.slice(0, firstEnd);
    return clampText(text, fallbackLength);
  }

  if (firstEnd <= fallbackLength) return text.slice(0, firstEnd);
  return clampText(text, fallbackLength);
}

/**
 * Get a short insight summary - first sentence, max 120 chars default.
 */
export function getShortInsight(text: string, maxLength: number = 120): string {
  return firstSentence(text, maxLength);
}

/**
 * Return the first maxItems from an array (default 3).
 */
export function summarizeList<T>(items: T[], maxItems: number = 3): T[] {
  return items.slice(0, maxItems);
}

/**
 * Returns true if text length exceeds threshold (default 160).
 */
export function hasLongText(text: string, threshold: number = 160): boolean {
  return Boolean(text) && text.length > threshold;
}
