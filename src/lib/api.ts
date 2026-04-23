import { buildApiUrl } from "../config/api";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = buildApiUrl(endpoint);

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("API returned HTML instead of JSON:", text);
    throw new Error(`Invalid JSON from ${url}`);
  }
}
