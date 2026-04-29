const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.dtales.tech";

if (!import.meta.env.VITE_API_BASE_URL) {
	console.warn("VITE_API_BASE_URL not found, using fallback API");
}

function getApiBase(): string {
	return API_BASE.replace(/\/+$/, "");
}

export const BASE_URL = getApiBase();

export function buildApiUrl(endpoint: string): string {
	const baseUrl = getApiBase();
	const cleanEndpoint = endpoint.startsWith("/api/")
		? endpoint
		: `/api/${endpoint.replace(/^\//, "")}`;
	return `${baseUrl}${cleanEndpoint}`;
}

// Media proxy uses the API host root
export const API_BASE_URL = BASE_URL;
