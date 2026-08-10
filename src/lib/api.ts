const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.dtales.tech";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn("VITE_API_BASE_URL not found, using fallback API");
}

function getApiBase(): string {
  return API_BASE.replace(/\/+$/, "");
}

const ADMIN_TOKEN_KEY = "adminToken";
const ADMIN_LOGGED_IN_KEY = "isAdminLoggedIn";
const LOGIN_ROUTE = "/admin";

function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_LOGGED_IN_KEY);
}

function redirectToLogin(): void {
  window.location.hash = LOGIN_ROUTE;
}

interface ApiSuccessEnvelope<T> {
  success: true;
  message?: string;
  data: T;
}

interface ApiErrorEnvelope {
  success: false;
  code?: string;
  message: string;
  requestId?: string;
  details?: unknown;
}

type ApiEnvelope<T> = ApiSuccessEnvelope<T> | ApiErrorEnvelope;

export class ApiError extends Error {
  code?: string;
  requestId?: string;
  details?: unknown;

  constructor(envelope: ApiErrorEnvelope) {
    super(envelope.message || "Request failed");
    this.name = "ApiError";
    this.code = envelope.code;
    this.requestId = envelope.requestId;
    this.details = envelope.details;
  }
}

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as { success: unknown }).success === "boolean"
  );
}

async function safeFetch(url: string, options?: RequestInit) {
  const headers: Record<string, string> = options?.headers
    ? { ...(options.headers as Record<string, string>) }
    : { "Content-Type": "application/json" };

  const token = getAdminToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
    ...options,
    headers,
  });

  const isLoginRequest = url.includes("/api/auth/login");
  if (res.status === 401 && !isLoginRequest) {
    clearAdminSession();
    redirectToLogin();
  }

  const text = await res.text();

  if (!text.trim()) {
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("❌ NON-JSON RESPONSE FROM:", url);
    console.error(text);
    throw new Error("Backend returned invalid JSON response");
  }

  if (isEnvelope(parsed)) {
    if (parsed.success) {
      return parsed.data;
    }
    throw new ApiError(parsed);
  }

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return parsed;
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

// AUTH
export async function loginAdmin(username: string, password: string): Promise<string> {
  const data = (await safeFetch(`${getApiBase()}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })) as { token?: string } | null;

  if (!data?.token) {
    throw new Error("Login response did not include a token");
  }

  return data.token;
}

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
