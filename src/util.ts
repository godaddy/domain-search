import type { SearchResponse } from './types';

const TIMEOUT_MS = 15000;

export async function searchDomains(
  baseUrl: string,
  plid: string,
  query: string,
  pageSize: number
): Promise<SearchResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const params = new URLSearchParams({ q: query, pageSize: String(pageSize) });
    const url = `https://www.${baseUrl}/api/v1/domains/${plid}/?${params}`;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<SearchResponse>;
  } finally {
    clearTimeout(timer);
  }
}
