import { API_BASE_URL } from "../config/api";
import { fetchWithRetry, EmptyResponseError } from "./fetchWithRetry";

export interface PortfolioItem {
  id: number;
  title: string;
  link: string;
  category: string;
  cover_image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new portfolio item
 * @param data Portfolio item data
 * @returns Created portfolio item
 */
export async function createPortfolio(data: {
  title: string;
  link: string;
  category: string;
  cover_image_url: string;
  published: boolean;
}): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio?t=${Date.now()}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to create portfolio item (${res.status})`);
  }

  const result = await res.json();
  console.log("Portfolio API create response:", result);
  return result;
}

/**
 * Get all portfolio items with retry logic
 * @returns Array of portfolio items
 */
export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  try {
    const data = await fetchWithRetry<PortfolioItem[]>(
      `${API_BASE_URL}/api/portfolio`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "omit",
      },
      3,
      true
    );

    console.log("Portfolio API response:", data);

    if (!data) {
      throw new Error("Failed to fetch portfolio items after retries");
    }

    return data;
  } catch (error) {
    if (error instanceof EmptyResponseError) {
      console.error("Portfolio API returned empty array");
      throw new Error("No portfolio items available");
    }
    throw error;
  }
}

/**
 * Update a portfolio item
 * @param id Portfolio item ID
 * @param data Updated portfolio item data
 * @returns Updated portfolio item
 */
export async function updatePortfolio(id: number, data: {
  title: string;
  link: string;
  category: string;
  cover_image_url: string;
  published: boolean;
}): Promise<PortfolioItem> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/${id}?t=${Date.now()}`, {
    method: "PUT",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    mode: "cors",
    credentials: "omit",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to update portfolio item (${res.status})`);
  }

  const result = await res.json();
  console.log("Portfolio API update response:", result);
  return result;
}

/**
 * Delete a portfolio item
 * @param id Portfolio item ID
 */
export async function deletePortfolio(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/${id}?t=${Date.now()}`, {
    method: "DELETE",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    mode: "cors",
    credentials: "omit",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to delete portfolio item (${res.status})`);
  }

  console.log("Portfolio API delete success");
}

/**
 * Upload an image file
 * @param file Image file to upload
 * @returns URL of uploaded image
 */
export async function uploadPortfolioImage(file: File): Promise<string> {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE_URL}/api/uploads/image?t=${Date.now()}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    mode: "cors",
    credentials: "omit",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to upload image (${res.status})`);
  }

  const data = await res.json();
  console.log("Portfolio API image upload response:", data);
  return data.url as string;
}
