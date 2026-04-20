const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry<T = unknown>(
  url: string,
  options: RequestInit = {},
  retries: number = DEFAULT_RETRIES
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        cache: "no-store",
        signal: controller.signal,
        headers: {
          ...options.headers,
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      console.warn(`[FETCH_RETRY] Attempt ${attempt}/${retries} failed for ${url}:`, error);

      if (attempt < retries) {
        await sleep(DEFAULT_RETRY_DELAY_MS);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  console.error(`[FETCH_RETRY] All ${retries} attempts failed for ${url}`, lastError);
  throw lastError instanceof Error ? lastError : new Error("Request failed after retries");
}
