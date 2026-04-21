export const BASE_URL =
	import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
	"https://dtales.tech/api";

export function buildApiUrl(endpoint: string): string {
	const cleanEndpoint = endpoint.replace(/^\//, "");
	return `${BASE_URL}/${cleanEndpoint}`;
}

// Keep host-only export for non-API assets like /media.
export const API_BASE_URL = BASE_URL.replace(/\/api$/, "");
