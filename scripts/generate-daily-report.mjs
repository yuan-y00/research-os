/**
 * Generates a daily research report automatically.
 * Reads watchlist.json and daily-state.json.
 * Picks the highest priority item not recently researched.
 * Calls generateReport. Same save/commit flow as manual.
 */

import { generateReport } from './lib/ai-client.mjs';
import { validateReport } from './lib/report-schema.mjs';
import {
  readReports,
  writeReports,
  readWatchlist,
  readDailyState,
  writeDailyState,
} from './lib/file-utils.mjs';
import { gitCommit, gitPush } from './lib/github-utils.mjs';
import { chooseResearchTarget } from './choose-research-target.mjs';

async function main() {
  console.log('[generate-daily] Starting daily research...');

  // Read data
  const watchlist = await readWatchlist();
  const dailyState = await readDailyState();

  console.log(`[generate-daily] Watchlist has ${watchlist.length} items.`);
  console.log(`[generate-daily] Daily state has ${dailyState.history?.length || 0} history entries.`);

  // Pick target
  const { target, reason } = chooseResearchTarget(watchlist, dailyState);
  console.log(`[generate-daily] ${reason}`);

  if (!target) {
    console.log('[generate-daily] No target to research today. Exiting.');
    return;
  }

  const subject = target.name;
  const reportType = target.type || 'brand';
  const notes = target.researchAngles ? target.researchAngles.join(', ') : '';

  console.log(`[generate-daily] Researching: "${subject}" (type=${reportType})`);

  // Generate report
  const report = await generateReport({ subject, reportType, notes });

  // Validate
  const { valid, errors } = validateReport(report);
  if (!valid) {
    console.warn('[generate-daily] WARNING: Report validation failed:');
    for (const err of errors) {
      console.warn(`  - ${err}`);
    }
    console.warn('[generate-daily] Saving anyway with validation warnings...');
  } else {
    console.log('[generate-daily] Report validation passed.');
  }

  // Prepend to reports
  const reports = await readReports();
  reports.unshift(report);
  await writeReports(reports);
  console.log(`[generate-daily] Report saved. Total reports: ${reports.length}`);

  // Update daily state
  dailyState.lastRunAt = new Date().toISOString();
  dailyState.lastTargetId = target.id;
  dailyState.history = dailyState.history || [];
  dailyState.history.push({
    date: new Date().toISOString(),
    targetId: target.id,
    reportId: report.id,
  });
  await writeDailyState(dailyState);

  // Update watchlist item's lastResearchedAt
  const watchlistItem = watchlist.find((w) => w.id === target.id);
  if (watchlistItem) {
    watchlistItem.lastResearchedAt = new Date().toISOString();
    const { writeWatchlist } = await import('./lib/file-utils.mjs');
    await writeWatchlist(watchlist);
  }

  console.log('[generate-daily] Daily state and watchlist updated.');

  // Commit and push
  const commitMsg = `Daily research: ${subject} (${reportType})`;
  const commitResult = gitCommit(commitMsg);
  if (commitResult.success) {
    gitPush();
  }

  console.log(`[generate-daily] Done. Report ID: ${report.id}`);
}

main().catch((err) => {
  console.error('[generate-daily] Fatal error:', err);
  process.exit(1);
});
