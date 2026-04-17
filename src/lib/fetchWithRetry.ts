/**
 * Fetch with retry logic and no-cache headers
 * Prevents caching issues and ensures reliable API calls across all devices
 * 
 * @param url - The API endpoint URL
 * @param options - Optional fetch options (will be merged with no-cache defaults)
 * @param retries - Number of retry attempts (default: 3)
 * @returns The parsed JSON data, or null if all retries fail
 */
export async function fetchWithRetry<T = any>(
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<T | null> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        cache: "no-store",
        headers: {
          ...options.headers,
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data: T = await response.json();

      // Validate that data is not empty
      if (data === null || data === undefined) {
        throw new Error("Empty response from server");
      }

      // For arrays, check that they're not empty; for objects, consider them valid
      if (Array.isArray(data) && data.length === 0) {
        throw new Error("Empty array response from server");
      }

      return data;
    } catch (err: any) {
      console.warn(
        `[FETCH_RETRY] Attempt ${i + 1}/${retries} failed for ${url}:`,
        err.message
      );

      // Wait before retrying (except on last attempt)
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  console.error(`[FETCH_RETRY] All ${retries} attempts failed for ${url}`);
  return null;
}
