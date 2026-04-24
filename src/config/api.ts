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
