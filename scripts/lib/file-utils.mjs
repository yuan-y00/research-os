/**
 * File utilities for reading/writing JSON data files.
 * All paths are resolved relative to the project root.
 */

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Project root is two levels up from scripts/lib/
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..', '..');

const DATA_DIR = resolve(PROJECT_ROOT, 'public', 'data');
const REPORTS_PATH = resolve(DATA_DIR, 'reports.json');
const WATCHLIST_PATH = resolve(DATA_DIR, 'watchlist.json');
const DAILY_STATE_PATH = resolve(DATA_DIR, 'daily-state.json');

/**
 * Ensures the data directory exists.
 */
async function ensureDataDir() {
  try {
    await stat(DATA_DIR);
  } catch {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * Reads and parses a JSON file. Returns defaultVal if file doesn't exist.
 */
export async function readJSON(filePath, defaultVal = null) {
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return defaultVal;
    }
    throw err;
  }
}

/**
 * Writes a JSON object to a file with pretty formatting.
 */
export async function writeJSON(filePath, data) {
  await ensureDataDir();
  const json = JSON.stringify(data, null, 2) + '\n';
  await writeFile(filePath, json, 'utf-8');
}

/** @returns {Promise<Array>} All research reports */
export async function readReports() {
  return readJSON(REPORTS_PATH, []);
}

/** @param {Array} reports */
export async function writeReports(reports) {
  return writeJSON(REPORTS_PATH, reports);
}

/** @returns {Promise<Array>} Watchlist items */
export async function readWatchlist() {
  return readJSON(WATCHLIST_PATH, []);
}

/** @param {Array} watchlist */
export async function writeWatchlist(watchlist) {
  return writeJSON(WATCHLIST_PATH, watchlist);
}

/** @returns {Promise<object>} Daily state */
export async function readDailyState() {
  return readJSON(DAILY_STATE_PATH, {
    lastRunAt: null,
    lastTargetId: null,
    history: [],
  });
}

/** @param {object} state */
export async function writeDailyState(state) {
  return writeJSON(DAILY_STATE_PATH, state);
}
