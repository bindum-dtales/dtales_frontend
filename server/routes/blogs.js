import { Router } from "express";
import { supabase } from "../config/supabase.js";

const router = Router();

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerpt(html, maxLen = 200) {
  const text = stripHtml(html);
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

function extractContent(bodyContent) {
  // Handle { html: "..." } format from frontend
  if (bodyContent && typeof bodyContent === "object" && typeof bodyContent.html === "string") {
    return bodyContent.html;
  }
  // Handle plain string
  if (typeof bodyContent === "string") {
    return bodyContent;
  }
  return "";
}

function normalizeBlog(row) {
  // Normalize cover image field
  const cover_image_url = row?.cover_image_url ?? row?.cover_image ?? null;
  
  // Return content as-is (HTML from database)
  let content = row?.content ?? "";
  
  // BACKWARD COMPATIBILITY: If content looks like a DOCX URL, show fallback
  if (typeof content === "string" && content.startsWith("http") && content.endsWith(".docx")) {
    content = "<p><em>Content is stored as a legacy DOCX file. Please re-upload to convert to HTML.</em></p>";
  }
  
  // Generate excerpt from HTML content
  const excerpt = buildExcerpt(content, 200);
  
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    cover_image_url,
    excerpt,
    content,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json((data || []).map(normalizeBlog));
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/public", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/blogs/public error:", error);
      throw error;
    }

    res.json((data || []).map(normalizeBlog));
  } catch (err) {
    console.error("GET /api/blogs/public caught error:", err);
    return res.status(500).json({ error: "Failed to fetch published blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(normalizeBlog(data));
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = (req.body.title || "").toString().trim();
    const content = extractContent(req.body.content);
    const cover_image_url = req.body.cover_image_url ?? null;
    const published = req.body.published === true;

    // Validation
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Content is required (must be HTML string)" });
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          excerpt,
          content,
          cover_image_url,
          published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(normalizeBlog(data));
  } catch (err) {
    console.error("POST /blogs error:", err);
    return res.status(500).json({ error: "Failed to create blog" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { data: current, error: fetchError } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (!current) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const title = ((req.body.title ?? current.title) || "").toString().trim();
    const contentRaw = extractContent(req.body.content);
    const content = contentRaw !== "" ? contentRaw : current.content || "";
    const cover_image_url = req.body.cover_image_url !== undefined ? req.body.cover_image_url : current.cover_image_url ?? null;
    const published = typeof req.body.published === "boolean" ? req.body.published : current.published === true;

    // Validation
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ error: "Content is required (must be HTML string)" });
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title,
        excerpt,
        content,
        cover_image_url,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(normalizeBlog(data));
  } catch (err) {
    console.error("PUT /blogs/:id error:", err);
    return res.status(500).json({ error: "Failed to update blog" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", req.params.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;

