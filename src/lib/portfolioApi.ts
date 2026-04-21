import { apiDelete, apiPost, apiPut } from "./api";
import { uploadImage } from "./uploads";

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
  const result = await apiPost<PortfolioItem>("portfolio", data);
  console.log("Portfolio API create response:", result);
  return result;
}

/**
 * Get all portfolio items with retry logic
 * @returns Array of portfolio items
 */
export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  const data = await getPortfolio();
  return Array.isArray(data) ? data : [];
}

export async function getPortfolio() {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/portfolio`);

    if (!res.ok) {
      console.error("API ERROR:", res.status);
      return [];
    }

    const text = await res.text();

    if (!text) {
      console.warn("Empty response");
      return [];
    }

    const data = JSON.parse(text);

    // Handle all possible backend formats
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.items)) return data.items;

    console.warn("Unknown format:", data);
    return [];
  } catch (err) {
    console.error("Portfolio fetch failed:", err);
    return [];
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
  const result = await apiPut<PortfolioItem>(`portfolio/${id}`, data);
  console.log("Portfolio API update response:", result);
  return result;
}

/**
 * Delete a portfolio item
 * @param id Portfolio item ID
 */
export async function deletePortfolio(id: number): Promise<void> {
  await apiDelete(`portfolio/${id}`);

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

  const imageUrl = await uploadImage(file);
  console.log("Portfolio API image upload response:", imageUrl);
  return imageUrl;
}
