export const BASE_URL = "https://api.dtales.tech";

export function buildApiUrl(endpoint: string): string {
	const cleanEndpoint = endpoint.startsWith("/api/")
		? endpoint
		: `/api/${endpoint.replace(/^\//, "")}`;
	return `${BASE_URL}${cleanEndpoint}`;
}

// Media proxy uses the API host root
export const API_BASE_URL = BASE_URL;
