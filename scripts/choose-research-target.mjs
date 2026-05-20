/**
 * Picks the next research target from the watchlist.
 * Standalone logic: selects the highest-priority item not recently researched.
 * Used by both generate-daily-report.mjs and can be used programmatically.
 */

/**
 * @param {Array} watchlist - Watchlist items
 * @param {object} dailyState - Daily state with history
 * @param {number} [daysThreshold=14] - Days before an item can be researched again
 * @returns {{ target: object|null, reason: string }}
 */
export function chooseResearchTarget(watchlist, dailyState, daysThreshold = 14) {
  if (!watchlist || watchlist.length === 0) {
    return { target: null, reason: 'Watchlist is empty.' };
  }

  const now = Date.now();
  const thresholdMs = daysThreshold * 24 * 60 * 60 * 1000;

  // Research history - IDs that were recently researched
  const recentlyResearchedIds = new Set();
  for (const entry of (dailyState.history || [])) {
    const entryDate = new Date(entry.date).getTime();
    if (now - entryDate < thresholdMs) {
      recentlyResearchedIds.add(entry.targetId);
    }
  }

  // Filter out recently researched items
  const eligible = watchlist.filter((item) => {
    if (recentlyResearchedIds.has(item.id)) return false;
    if (item.lastResearchedAt) {
      const lastDate = new Date(item.lastResearchedAt).getTime();
      if (now - lastDate < thresholdMs) return false;
    }
    return true;
  });

  if (eligible.length === 0) {
    return { target: null, reason: 'All items have been recently researched. Try again later.' };
  }

  // Sort by priority descending, then by name for stability
  eligible.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return (a.name || '').localeCompare(b.name || '');
  });

  const target = eligible[0];
  return {
    target,
    reason: `Selected "${target.name}" (priority=${target.priority}, id=${target.id}) as next research target.`,
  };
}

// If run directly from command line, print the selected target
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const { readWatchlist, readDailyState } = await import('./lib/file-utils.mjs');
  const watchlist = await readWatchlist();
  const dailyState = await readDailyState();
  const { target, reason } = chooseResearchTarget(watchlist, dailyState);
  console.log(reason);
  if (target) {
    console.log(JSON.stringify(target, null, 2));
  }
}
