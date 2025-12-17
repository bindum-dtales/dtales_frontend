const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://dtales-backend.onrender.com";

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
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
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
}
