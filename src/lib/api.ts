const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// Temporary debug log to verify production env injection.
console.log("API BASE:", import.meta.env.VITE_API_BASE_URL);

async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ NON-JSON RESPONSE FROM:", url);
    console.error(text);
    throw new Error("Backend returned non-JSON response");
  }
}

// BLOGS
export const getBlogs = () =>
  safeFetch(`${API_BASE}/api/blogs`);

// CASE STUDIES
export const getCaseStudies = () =>
  safeFetch(`${API_BASE}/api/case-studies`);

// PORTFOLIO
export const getPortfolio = () =>
  safeFetch(`${API_BASE}/api/portfolio`);

function buildApiUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalized = endpoint.startsWith("/api/")
    ? endpoint
    : `/api/${endpoint.replace(/^\//, "")}`;

  return `${API_BASE}${normalized}`;
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = buildApiUrl(endpoint);

  const data = await safeFetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  return data as T;
}
