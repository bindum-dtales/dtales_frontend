/**
 * API Configuration
 * 
 * Uses VITE_API_URL environment variable for API base URL.
 * Fallback for localhost development only.
 * 
 * Environment Variables:
 * - VITE_API_URL: Full API base URL (e.g., https://api.dtales.tech)
 * 
 * Development (localhost): http://localhost:10000
 * Production: https://api.dtales.tech (set via .env)
 */

function getApiBaseUrl(): string {
  // Use environment variable if set (production builds)
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Fallback for development
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:10000';
  }

  // Final fallback to HTTPS production URL
  return 'https://api.dtales.tech';
}

export const API_BASE_URL = getApiBaseUrl();
