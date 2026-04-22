const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dtales.tech/api";

export function buildApiUrl(endpoint: string): string {
  const clean = endpoint.replace(/^\/+/, "");
  return `${BASE_URL}/${clean}`;
}

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
