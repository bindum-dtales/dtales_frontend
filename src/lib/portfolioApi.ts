import { API_BASE_URL } from "../../constants";

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
  const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to create portfolio item (${res.status})`);
  }

  return res.json();
}

/**
 * Get all portfolio items
 * @returns Array of portfolio items
 */
export async function getAllPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio`);

  if (!res.ok) {
    throw new Error(`Failed to fetch portfolio items (${res.status})`);
  }

  return res.json();
}

/**
 * Delete a portfolio item
 * @param id Portfolio item ID
 */
export async function deletePortfolio(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to delete portfolio item (${res.status})`);
  }
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

  const res = await fetch(`${API_BASE_URL}/api/uploads/image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to upload image (${res.status})`);
  }

  const data = await res.json();
  return data.url as string;
}
