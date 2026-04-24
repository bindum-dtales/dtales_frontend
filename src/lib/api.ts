const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getApiBase(): string {
  if (!API_BASE) {
    console.error(
      "[API CONFIG ERROR] VITE_API_BASE_URL is undefined. API requests cannot be constructed."
    );
    throw new Error("Missing VITE_API_BASE_URL");
  }

  return API_BASE.replace(/\/+$/, "");
}

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
  safeFetch(`${getApiBase()}/api/blogs`);

// CASE STUDIES
export const getCaseStudies = () =>
  safeFetch(`${getApiBase()}/api/case-studies`);

// PORTFOLIO
export const getPortfolio = () =>
  safeFetch(`${getApiBase()}/api/portfolio`);

function buildApiUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalized = endpoint.startsWith("/api/")
    ? endpoint
    : `/api/${endpoint.replace(/^\//, "")}`;

  return `${getApiBase()}${normalized}`;
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
