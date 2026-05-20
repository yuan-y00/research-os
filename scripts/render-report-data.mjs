/**
 * Converts reports.json to a simple HTML summary for debugging.
 * Usage: node scripts/render-report-data.mjs > debug.html
 *    or: node scripts/render-report-data.mjs --output=debug.html
 *
 * If --output is not specified, prints HTML to stdout.
 */

import { readReports } from './lib/file-utils.mjs';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..');

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderReportCards(reports) {
  if (!reports || reports.length === 0) {
    return '<p>No reports found.</p>';
  }

  let html = '';
  for (const report of reports) {
    const typeBadge = escapeHtml(report.type || 'unknown');
    const dateStr = report.createdAt
      ? new Date(report.createdAt).toLocaleDateString('zh-CN')
      : 'No date';

    html += `
      <article class="report-card">
        <header>
          <h2>${escapeHtml(report.title || report.subject || 'Untitled')}</h2>
          <div class="meta">
            <span class="badge type-badge">${typeBadge}</span>
            <span class="date">${dateStr}</span>
            ${report.id ? `<span class="id">ID: ${escapeHtml(report.id)}</span>` : ''}
          </div>
        </header>
        ${report.summary ? `<p class="summary">${escapeHtml(report.summary)}</p>` : ''}
        ${report.verdict ? `<p class="verdict"><strong>判断:</strong> ${escapeHtml(report.verdict)}</p>` : ''}
        ${report.tags && report.tags.length > 0 ? `
          <div class="tags">
            ${report.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join(' ')}
          </div>` : ''}
        <details>
          <summary>Full JSON</summary>
          <pre>${escapeHtml(JSON.stringify(report, null, 2))}</pre>
        </details>
      </article>`;
  }

  return html;
}

function renderHtml(reports) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Research OS - Debug View</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    .stats { color: #94a3b8; margin-bottom: 2rem; }
    .report-card {
      background: #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;
      border: 1px solid #334155;
    }
    .report-card h2 { font-size: 1.25rem; margin-bottom: 0.5rem; color: #f8fafc; }
    .meta { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; font-size: 0.85rem; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 500; }
    .type-badge { background: #1e40af; color: #93c5fd; }
    .date { color: #94a3b8; }
    .id { color: #64748b; font-family: monospace; font-size: 0.8rem; }
    .summary { color: #cbd5e1; margin-bottom: 0.75rem; line-height: 1.6; }
    .verdict { color: #fbbf24; margin-bottom: 0.5rem; }
    .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .tag { background: #334155; color: #94a3b8; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
    details { margin-top: 0.5rem; }
    details summary { cursor: pointer; color: #60a5fa; font-size: 0.9rem; }
    details pre { background: #0f172a; padding: 1rem; border-radius: 4px; margin-top: 0.5rem;
      font-size: 0.8rem; overflow-x: auto; max-height: 400px; overflow-y: auto; }
  </style>
</head>
<body>
  <h1>Research OS - Debug View</h1>
  <p class="stats">Total reports: <strong>${reports.length}</strong></p>
  ${renderReportCards(reports)}
</body>
</html>`;
}

async function main() {
  // Parse --output=path
  let outputPath = null;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--output=')) {
      outputPath = resolve(arg.slice('--output='.length));
    } else if (arg.startsWith('-o=')) {
      outputPath = resolve(arg.slice('-o='.length));
    }
  }

  console.error('[render-report] Reading reports.json...');
  const reports = await readReports();
  console.error(`[render-report] Found ${reports.length} report(s).`);

  const html = renderHtml(reports);

  if (outputPath) {
    const outPath = resolve(PROJECT_ROOT, outputPath);
    await writeFile(outPath, html, 'utf-8');
    console.error(`[render-report] HTML written to ${outPath}`);
  } else {
    process.stdout.write(html);
  }
}

main().catch((err) => {
  console.error('[render-report] Fatal error:', err);
  process.exit(1);
});
