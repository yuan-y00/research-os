/**
 * GitHub utilities for committing and pushing changes.
 * Catches errors gracefully - never crashes.
 */

import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '..', '..');

/**
 * Runs git add -A and git commit with the given message.
 * Does not throw on failure.
 * @param {string} message - Commit message
 * @returns {{ success: boolean, error?: string }}
 */
export function gitCommit(message) {
  try {
    console.log('[git] Staging changes...');
    execSync('git add -A', { cwd: PROJECT_ROOT, stdio: 'pipe', encoding: 'utf-8' });

    console.log(`[git] Committing: ${message}`);
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
      encoding: 'utf-8',
    });

    console.log('[git] Commit successful.');
    return { success: true };
  } catch (err) {
    const stderr = err.stderr || err.message || 'Unknown error';

    // "nothing to commit" is not really an error
    if (stderr.includes('nothing to commit') || stderr.includes('nothing added to commit')) {
      console.log('[git] Nothing to commit (no changes).');
      return { success: true };
    }

    console.error('[git] Commit failed:', stderr);
    return { success: false, error: stderr };
  }
}

/**
 * Pushes to origin. Does not throw on failure.
 * @returns {{ success: boolean, error?: string }}
 */
export function gitPush() {
  try {
    console.log('[git] Pushing to origin...');
    const result = execSync('git push origin', {
      cwd: PROJECT_ROOT,
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    console.log('[git] Push successful.');
    if (result.trim()) console.log('[git]', result.trim());
    return { success: true };
  } catch (err) {
    const stderr = err.stderr || err.message || 'Unknown error';
    console.error('[git] Push failed:', stderr);
    return { success: false, error: stderr };
  }
}
