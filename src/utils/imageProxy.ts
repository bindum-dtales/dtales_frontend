/**
 * Image Proxy Utility
 * Converts Supabase image URLs to backend proxy URLs
 * 
 * Backend proxy route: https://dtales-backend-gzlj.onrender.com/media/:filename
 */

const BACKEND_MEDIA_PROXY = "https://dtales-backend-gzlj.onrender.com/media";

/**
 * Extract filename from Supabase URL and convert to backend proxy URL
 * @param fullUrl - Full Supabase image URL
 * @returns Proxied image URL or original URL if not a Supabase URL
 */
export const getProxiedImageUrl = (fullUrl: string): string => {
  if (!fullUrl) return "";
  
  // Check if it's a Supabase URL
  if (fullUrl.includes("supabase.co/storage")) {
    try {
      // Extract filename from Supabase URL path
      // Handles: .../dtales-media/images/filename.png or .../dtales-media/filename.png
      const filename = fullUrl.split("/").pop();
      if (filename) {
        return `${BACKEND_MEDIA_PROXY}/${filename}`;
      }
    } catch (error) {
      console.warn("Failed to parse Supabase URL:", fullUrl);
    }
  }
  
  // Return original URL if not Supabase or parsing failed
  return fullUrl;
};
