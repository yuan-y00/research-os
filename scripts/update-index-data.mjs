/**
 * Re-indexes reports.json:
 * - Sorts by createdAt descending
 * - Assigns slugs if missing (based on subject)
 * - Deduplicates by id
 * Usage: node scripts/update-index-data.mjs
 */

import { readReports, writeReports } from './lib/file-utils.mjs';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w一-鿿]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('[update-index] Reading reports.json...');
  const reports = await readReports();

  if (reports.length === 0) {
    console.log('[update-index] No reports found. Nothing to index.');
    return;
  }

  console.log(`[update-index] Found ${reports.length} report(s).`);

  // Remove duplicates by id
  const seenIds = new Set();
  const deduplicated = reports.filter((r) => {
    if (seenIds.has(r.id)) {
      console.log(`[update-index] Removing duplicate: id=${r.id}`);
      return false;
    }
    seenIds.add(r.id);
    return true;
  });

  if (deduplicated.length < reports.length) {
    console.log(`[update-index] Removed ${reports.length - deduplicated.length} duplicate(s).`);
  }

  // Assign slugs if missing
  let slugsAdded = 0;
  for (const report of deduplicated) {
    if (!report.slug && report.subject) {
      report.slug = slugify(report.subject);
      slugsAdded++;
    }
  }

  if (slugsAdded > 0) {
    console.log(`[update-index] Generated ${slugsAdded} missing slug(s).`);
  }

  // Sort by createdAt descending
  deduplicated.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  console.log(`[update-index] Sorted by createdAt descending.`);

  // Write back
  await writeReports(deduplicated);
  console.log(`[update-index] Done. ${deduplicated.length} report(s) saved.`);
}

main().catch((err) => {
  console.error('[update-index] Fatal error:', err);
  process.exit(1);
});
