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

  if (!text.trim()) {
    return undefined as T;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Invalid JSON:", text);
    throw new Error("Backend returned non-JSON response");
  }
}
