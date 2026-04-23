export const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export function buildApiUrl(endpoint: string): string {
	const cleanEndpoint = endpoint.replace(/^\//, "");
	return `${BASE_URL}/${cleanEndpoint}`;
}

// Media proxy uses the host without /api suffix
export const API_BASE_URL = BASE_URL.replace(/\/api$/, "");
