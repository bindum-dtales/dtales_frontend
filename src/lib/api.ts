import { API_BASE_URL } from '../config/api';
import { fetchWithRetry, EmptyResponseError } from './fetchWithRetry';

async function parseJsonOrThrow<T>(res: Response, endpoint: string): Promise<T> {
  const raw = await res.text();

  if (!raw || !raw.trim()) {
    throw new Error(`API error: Empty response for ${endpoint}`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new Error(`API error: Invalid JSON response for ${endpoint}`);
  }
}

export async function apiFetch<T>(endpoint: string): Promise<T> {
  try {
    const data = await fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {}, 3, true);
    console.log(`API response for ${endpoint}:`, data);
    if (!data) {
      throw new Error(`API error: No data received for ${endpoint}`);
    }
    return data;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      console.error(`API returned empty for ${endpoint}`);
      throw new Error(`No data available for ${endpoint}`);
    }
    throw error;
  }
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}?t=${Date.now()}`, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `API error: ${res.status}`);
  }
  const result = await parseJsonOrThrow<T>(res, endpoint);
  console.log(`API POST response for ${endpoint}:`, result);
  return result;
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}?t=${Date.now()}`, {
    method: "PUT",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `API error: ${res.status}`);
  }
  const result = await parseJsonOrThrow<T>(res, endpoint);
  console.log(`API PUT response for ${endpoint}:`, result);
  return result;
}

export async function apiDelete(endpoint: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${endpoint}?t=${Date.now()}`, {
    method: "DELETE",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  console.log(`API DELETE success for ${endpoint}`);
}

export async function apiUpload<T>(endpoint: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}?t=${Date.now()}`, {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || `API error: ${res.status}`);
  }

  return parseJsonOrThrow<T>(res, endpoint);
}
