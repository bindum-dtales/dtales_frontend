import { useCallback, useEffect, useState } from "react";
import { getBlogs } from "../../../src/lib/api";
import type { ContentCardItem } from "../types";

type Blog = {
  id: string;
  title: string;
  cover_image_url?: string | null;
  excerpt?: string;
  content?: string;
  published: boolean;
};

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
const getExcerpt = (html?: string) => {
  const text = stripHtml(html || "");
  return text.length > 150 ? `${text.slice(0, 150)}…` : text;
};

function mapBlogToContentItem(blog: Blog): ContentCardItem {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.excerpt || getExcerpt(blog.content),
    subcategory: "Blogs",
    cover_image_url: blog.cover_image_url || "",
    link: `/#/blogs/${blog.id}`,
  };
}

export function useCapabilityBlogs(enabled: boolean) {
  const [items, setItems] = useState<ContentCardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getBlogs();
      const blogs: Blog[] = Array.isArray(data) ? data : [];
      setItems(blogs.filter((blog) => blog.published).map(mapBlogToContentItem));
    } catch (err) {
      console.error("Capability blogs fetch failed:", err);
      setError("Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (enabled) fetchItems();
  }, [enabled, fetchItems]);

  return { items, loading, error, retry: fetchItems };
}
