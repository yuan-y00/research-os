/**
 * Generates a manual research report from command line arguments.
 * Usage: node scripts/generate-manual-report.mjs --subject="DJI" --type="brand" --notes="Focus on drone market"
 *
 * Reads subject, type, notes from command line args.
 * Calls generateReport, validates result, prepends to reports.json, writes back.
 * Updates daily-state. Calls gitCommit and gitPush.
 * If validation fails, prints errors but still saves (with warning).
 */

import { generateReport } from './lib/ai-client.mjs';
import { validateReport } from './lib/report-schema.mjs';
import {
  readReports,
  writeReports,
  readDailyState,
  writeDailyState,
} from './lib/file-utils.mjs';
import { gitCommit, gitPush } from './lib/github-utils.mjs';

function parseArgs() {
  const args = {};
  const positional = [];

  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];

    // Support --key=value and --key "value"
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx >= 0) {
        const key = arg.slice(2, eqIdx);
        const value = arg.slice(eqIdx + 1);
        args[key] = value;
      } else if (i + 1 < process.argv.length && !process.argv[i + 1].startsWith('--')) {
        args[arg.slice(2)] = process.argv[i + 1];
        i++;
      } else {
        args[arg.slice(2)] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return { args, positional };
}

async function main() {
  const { args, positional } = parseArgs();

  // Support both named and positional arguments
  const subject = args.subject || positional[0];
  const reportType = args.type || args['report-type'] || args.report_type || positional[1] || 'brand';
  const notes = args.notes || positional[2] || '';

  if (!subject) {
    console.error('Error: --subject is required.');
    console.error('Usage: node scripts/generate-manual-report.mjs --subject="DJI" --type="brand" --notes="optional notes"');
    console.error('   or: node scripts/generate-manual-report.mjs DJI brand "optional notes"');
    process.exit(1);
  }

  const validTypes = ['brand', 'founder', 'product', 'company', 'crowdfunding', 'industry_event'];
  if (!validTypes.includes(reportType)) {
    console.error(`Error: --type must be one of: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  console.log(`[generate-manual] Generating report for "${subject}" (type=${reportType})`);
  if (notes) {
    console.log(`[generate-manual] Notes: ${notes}`);
  }

  // Generate the report
  const report = await generateReport({ subject, reportType, notes });

  // Validate
  const { valid, errors } = validateReport(report);
  if (!valid) {
    console.warn('[generate-manual] WARNING: Report validation failed with the following errors:');
    for (const err of errors) {
      console.warn(`  - ${err}`);
    }
    console.warn('[generate-manual] Saving anyway (with validation warnings)...');
  } else {
    console.log('[generate-manual] Report validation passed.');
  }

  // Save to reports.json (prepend)
  const reports = await readReports();
  reports.unshift(report);
  await writeReports(reports);
  console.log(`[generate-manual] Report saved. Total reports: ${reports.length}`);

  // Update daily state
  const dailyState = await readDailyState();
  dailyState.lastRunAt = new Date().toISOString();
  dailyState.lastTargetId = report.id;
  dailyState.history = dailyState.history || [];
  dailyState.history.push({
    date: new Date().toISOString(),
    targetId: report.id,
    reportId: report.id,
  });
  await writeDailyState(dailyState);
  console.log('[generate-manual] Daily state updated.');

  // Git operations
  const commitMsg = `Research: ${subject} (${reportType})${notes ? ' - ' + notes : ''}`;
  const commitResult = gitCommit(commitMsg);
  if (commitResult.success) {
    gitPush();
  }

  console.log(`[generate-manual] Done. Report ID: ${report.id}`);
  if (!valid) {
    console.warn('[generate-manual] REMINDER: Report has validation warnings - review manually.');
  }
}

main().catch((err) => {
  console.error('[generate-manual] Fatal error:', err);
  process.exit(1);
});
