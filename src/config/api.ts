/**
 * API Configuration
 *
 * Always resolves to HTTPS API host for production-safe deployments.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.dtales.tech";
