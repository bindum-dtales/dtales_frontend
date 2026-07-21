const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.dtales.tech";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("VITE_API_BASE_URL not found, using fallback API");
}

function getApiBase(): string {
  return API_BASE.replace(/\/+$/, "");
}

async function safeFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    const details = errorText.trim() ? `: ${errorText.trim()}` : "";
    throw new Error(`Request failed with status ${res.status}${details}`);
  }

  const text = await res.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ NON-JSON RESPONSE FROM:", url);
    console.error(text);
    throw new Error("Backend returned invalid JSON response");
  }
}

// BLOGS
export const getBlogs = () =>
  safeFetch(`${getApiBase()}/api/blogs`).catch((err) => {
    console.error("Blog fetch failed:", err);
    throw err;
  });

// CASE STUDIES
export const getCaseStudies = () =>
  safeFetch(`${getApiBase()}/api/case-studies`).catch((err) => {
    console.error("Case studies fetch failed:", err);
    throw err;
  });

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
