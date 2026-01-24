import { Router } from "express";
import { supabase } from "../config/supabase.js";
import mammoth from "mammoth";

const router = Router();

// Extract file path from Supabase public URL
function extractFilePathFromUrl(url) {
  if (!url) return null;
  // URL format: https://BUCKET.supabase.co/storage/v1/object/public/BUCKET/path/to/file
  const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
  return match ? match[1] : null;
}

// Download DOCX from Supabase and convert to HTML
async function convertDocxUrlToHtml(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const filePath = extractFilePathFromUrl(url);
  if (!filePath) {
    return url; // Not a Supabase URL, return as-is
  }

  try {
    // Download file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .download(filePath);

    if (error) {
      throw new Error(`Failed to download DOCX: ${error.message}`);
    }

    // Convert to HTML using mammoth
    const buffer = Buffer.from(await data.arrayBuffer());
    const result = await mammoth.convertToHtml({ buffer });
    return result.value; // Return HTML string
  } catch (err) {
    throw new Error(`DOCX conversion error: ${err.message}`);
  }
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerpt(html, maxLen = 200) {
  const text = stripHtml(html);
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

function extractContent(bodyContent) {
  if (typeof bodyContent === "string") return bodyContent;
  if (bodyContent && typeof bodyContent.html === "string") return bodyContent.html;
  return "";
}

function normalizeBlog(row) {
  // Normalize cover image field
  const cover_image_url = row?.cover_image_url ?? row?.cover_image ?? null;
  
  // Return content as-is (HTML from database)
  const content = row?.content ?? "";
  
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

    // Convert DOCX URLs to HTML for public responses (runtime-only, not saved)
    const processedData = await Promise.all(
      (data || []).map(async (row) => {
        const contentCopy = { ...row };
        // Detect if content is a Supabase DOCX URL
        if (
          typeof contentCopy.content === "string" &&
          contentCopy.content.includes("supabase") &&
          contentCopy.content.includes(".docx")
        ) {
          try {
            console.log("Converting DOCX to HTML for public response:", contentCopy.content);
            contentCopy.content = await convertDocxUrlToHtml(contentCopy.content);
            console.log("Conversion successful, content length:", contentCopy.content.length);
          } catch (err) {
            console.error("DOCX conversion error in public route:", err);
            // Fallback: return empty content if conversion fails
            contentCopy.content = "";
          }
        }
        return contentCopy;
      })
    );

    res.json(processedData.map(normalizeBlog));
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

    // Convert DOCX URL to HTML for public response (runtime-only, not saved)
    const contentCopy = { ...data };
    if (
      typeof contentCopy.content === "string" &&
      contentCopy.content.includes("supabase") &&
      contentCopy.content.includes(".docx")
    ) {
      try {
        console.log("Converting DOCX to HTML for public response:", contentCopy.content);
        contentCopy.content = await convertDocxUrlToHtml(contentCopy.content);
        console.log("Conversion successful, content length:", contentCopy.content.length);
      } catch (err) {
        console.error("DOCX conversion error in public route:", err);
        // Fallback: return empty content if conversion fails
        contentCopy.content = "";
      }
    }

    res.json(normalizeBlog(contentCopy));
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = (req.body.title || "").toString().trim();
    let content = extractContent(req.body.content);
    if (req.file && req.file.buffer) {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      content = result.value;
    }
    const cover_image_url = req.body.cover_image_url ?? null;
    const published = req.body.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
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
    let content = contentRaw !== "" ? contentRaw : current.content || "";
    if (req.file && req.file.buffer) {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      content = result.value;
    }
    const cover_image_url = req.body.cover_image_url !== undefined ? req.body.cover_image_url : current.cover_image_url ?? null;
    const published = typeof req.body.published === "boolean" ? req.body.published : current.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
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

