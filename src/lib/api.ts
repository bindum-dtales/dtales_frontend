const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  safeFetch(`${BASE_URL}/api/blogs`);

// CASE STUDIES
export const getCaseStudies = () =>
  safeFetch(`${BASE_URL}/api/case-studies`);

// PORTFOLIO
export const getPortfolio = () =>
  safeFetch(`${BASE_URL}/api/portfolio`);

function buildApiUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalized = endpoint.startsWith("/api/")
    ? endpoint
    : `/api/${endpoint.replace(/^\//, "")}`;

  return `${BASE_URL}${normalized}`;
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
