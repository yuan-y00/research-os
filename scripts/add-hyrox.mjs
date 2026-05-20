import { readJSON, writeJSON } from './lib/file-utils.mjs';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const reportsPath = join(__dirname, '..', 'public', 'data', 'reports.json');
const hyroxPath = join(__dirname, '..', 'public', 'data', 'hyrox-mock.json');

// Read existing reports
const reports = JSON.parse(readFileSync(reportsPath, 'utf8'));

// Read hyrox mock data
const hyrox = JSON.parse(readFileSync(hyroxPath, 'utf8'));

// Prepend hyrox
reports.unshift(hyrox);

// Write back
writeFileSync(reportsPath, JSON.stringify(reports, null, 2));
console.log(`Added HYROX. Total reports: ${reports.length}`);
