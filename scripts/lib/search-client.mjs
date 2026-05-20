/**
 * Search client for web research.
 * Returns empty array when no SEARCH_API_KEY is configured.
 * Mock-compatible - never throws.
 */

/**
 * Searches the web for the given query.
 * If SEARCH_API_KEY is not set, returns an empty array.
 * If the search API call fails, returns an empty array (never throws).
 *
 * @param {string} query - The search query
 * @returns {Promise<Array<{title: string, url: string, snippet: string}>>}
 */
export async function searchWeb(query) {
  const apiKey = process.env.SEARCH_API_KEY;

  if (!apiKey) {
    console.log('[search-client] No SEARCH_API_KEY set, returning empty results.');
    return [];
  }

  try {
    // Support configurable search engine via env
    const engine = process.env.SEARCH_ENGINE || 'brave';
    const baseUrl = process.env.SEARCH_BASE_URL || 'https://api.search.brave.com/res/v1/web/search';

    const url = new URL(baseUrl);
    url.searchParams.set('q', query);
    url.searchParams.set('count', '10');

    console.log(`[search-client] Searching via ${engine}: "${query}"`);
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Normalize results to common format
    const results = (data.web?.results || data.results || data.items || []).map((r) => ({
      title: r.title || r.name || '',
      url: r.url || r.link || '',
      snippet: r.description || r.snippet || r.summary || '',
    }));

    console.log(`[search-client] Found ${results.length} results.`);
    return results;
  } catch (err) {
    console.error('[search-client] Search failed:', err.message);
    return [];
  }
}
