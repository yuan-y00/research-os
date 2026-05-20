/**
 * Estimate reading time for mixed Chinese/English text.
 *
 * Chinese characters: ~500 chars per minute
 * English words:     ~225 words per minute
 *
 * Returns a formatted string, minimum "2 min read".
 */
export function estimateReadingTime(text: string): string {
  if (!text) return '2 min read';

  // Count Chinese characters (CJK Unified Ideographs range)
  const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;

  // Remove Chinese chars to count English words
  const withoutChinese = text.replace(/[一-鿿㐀-䶿]/g, ' ');
  const englishWords = withoutChinese
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w)).length;

  const chineseMinutes = chineseChars / 500;
  const englishMinutes = englishWords / 225;
  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes);

  const minutes = Math.max(2, totalMinutes);
  return `${minutes} min read`;
}

/**
 * Chinese locale variant of estimateReadingTime.
 */
export function estimateReadingTimeCN(text: string): string {
  if (!text) return '阅读约 2 分钟';

  const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length;
  const withoutChinese = text.replace(/[一-鿿㐀-䶿]/g, ' ');
  const englishWords = withoutChinese
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w)).length;

  const chineseMinutes = chineseChars / 500;
  const englishMinutes = englishWords / 225;
  const totalMinutes = Math.ceil(chineseMinutes + englishMinutes);

  const minutes = Math.max(2, totalMinutes);
  return `阅读约 ${minutes} 分钟`;
}
