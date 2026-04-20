const DEFAULT_RETRIES = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRY_DELAY_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class EmptyResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmptyResponseError";
  }
}

export async function fetchWithRetry<T = unknown>(
  url: string,
  options: RequestInit = {},
  retries: number = DEFAULT_RETRIES,
  retryOnEmpty: boolean = true
): Promise<T> {
  let lastError: unknown;
  let isEmptyError = false;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      // Add cache-busting timestamp
      const separator = url.includes("?") ? "&" : "?";
      const bustedUrl = `${url}${separator}t=${Date.now()}`;

      const response = await fetch(bustedUrl, {
        ...options,
        cache: "no-store",
        signal: controller.signal,
        headers: {
          ...options.headers,
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        throw new Error(`API failed: Server responded with status ${response.status}`);
      }

      const data = (await response.json()) as T;

      // Check for empty array
      if (retryOnEmpty && Array.isArray(data) && data.length === 0) {
        isEmptyError = true;
        console.warn(
          `[FETCH_RETRY] Attempt ${attempt}/${retries} returned empty array for ${url}`
        );

        if (attempt < retries) {
          await sleep(DEFAULT_RETRY_DELAY_MS);
          continue;
        } else {
          throw new EmptyResponseError("API returned empty array after all retries");
        }
      }

      console.log(`[FETCH_RETRY] Success (attempt ${attempt}): ${url}`, {
        dataLength: Array.isArray(data) ? data.length : "N/A",
        dataType: typeof data,
      });
      return data;
    } catch (error) {
      lastError = error;
      const isEmptyErr = error instanceof EmptyResponseError;

      if (isEmptyErr) {
        isEmptyError = true;
      }

      console.warn(`[FETCH_RETRY] Attempt ${attempt}/${retries} failed for ${url}:`, {
        error: error instanceof Error ? error.message : String(error),
        isEmptyError: isEmptyErr,
      });

      if (attempt < retries) {
        await sleep(DEFAULT_RETRY_DELAY_MS);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  const errorType = isEmptyError ? "empty response" : "request failed";
  console.error(
    `[FETCH_RETRY] All ${retries} attempts failed (${errorType}) for ${url}`,
    lastError
  );

  if (isEmptyError) {
    throw new EmptyResponseError(
      "API returned empty array after all retries - no data available"
    );
  }

  throw lastError instanceof Error ? lastError : new Error("Request failed after retries");
}
