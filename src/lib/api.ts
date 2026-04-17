import { API_BASE_URL } from '../config/api';
import { fetchWithRetry } from './fetchWithRetry';

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const data = await fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`);
  if (!data) {
    throw new Error(`API error: Failed to fetch ${endpoint} after retries`);
  }
  return data;
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function apiPut<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function apiDelete(endpoint: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache",
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
}
