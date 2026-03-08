/**
 * Image Proxy Helper - Converts Supabase URLs to backend proxy URLs
 * 
 * Extracts filename from Supabase URL and routes through backend proxy
 * Backend route: https://dtales-backend-gzlj.onrender.com/media/:filename
 */

import { API_BASE_URL } from '../src/config/api';

const SUPABASE_STORAGE_BASE = "supabase.co/storage";
const BACKEND_MEDIA_PROXY = `${API_BASE_URL}/media`;

/**
 * Converts a Supabase image URL to a backend proxied URL
 * @param fullUrl - Full Supabase URL (e.g., https://upkfbtqljrnlufflknkv.supabase.co/storage/v1/object/public/dtales-media/images/filename.png)
 * @returns Backend proxy URL (e.g., https://dtales-backend-gzlj.onrender.com/media/filename.png) or original URL if not a Supabase URL
 */
export function getProxiedImageUrl(fullUrl: string | null | undefined): string | null {
  if (!fullUrl) {
    return null;
  }

  // Check if it's a Supabase URL
  if (fullUrl.includes(SUPABASE_STORAGE_BASE)) {
    try {
      // Extract filename from path
      // Pattern: .../dtales-media/images/filename.png or .../dtales-media/filename.png
      const pathMatch = fullUrl.match(/dtales-media\/(?:images\/)?(.+)$/);
      if (pathMatch && pathMatch[1]) {
        const filename = pathMatch[1];
        return `${BACKEND_MEDIA_PROXY}/${filename}`;
      }
    } catch (error) {
      console.warn("Failed to parse Supabase URL:", fullUrl, error);
    }
  }

  // Return original URL if not a Supabase URL or parsing failed
  return fullUrl;
}
