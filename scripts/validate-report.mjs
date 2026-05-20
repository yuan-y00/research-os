/**
 * Validates all reports in reports.json and prints any issues.
 * Usage: node scripts/validate-report.mjs
 */

import { readReports } from './lib/file-utils.mjs';
import { validateReport } from './lib/report-schema.mjs';

async function main() {
  console.log('[validate-report] Reading reports.json...');
  const reports = await readReports();

  if (reports.length === 0) {
    console.log('[validate-report] No reports found. Nothing to validate.');
    return;
  }

  console.log(`[validate-report] Found ${reports.length} report(s). Validating...\n`);

  let totalErrors = 0;
  let validReports = 0;

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const { valid, errors } = validateReport(report);

    if (valid) {
      validReports++;
      console.log(`  [OK] Report ${i + 1}: "${report.subject}" (${report.type}) - id=${report.id}`);
    } else {
      totalErrors += errors.length;
      console.log(`  [FAIL] Report ${i + 1}: "${report.subject || '(unknown)'}" (${report.type || 'unknown'}) - id=${report.id || 'missing'}`);
      for (const err of errors) {
        console.log(`    -> ${err}`);
      }
      console.log('');
    }
  }

  console.log(`\n[validate-report] Summary: ${validReports}/${reports.length} valid, ${totalErrors} error(s).`);

  if (totalErrors > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error('[validate-report] Fatal error:', err);
  process.exit(1);
});
