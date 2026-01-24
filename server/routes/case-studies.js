import { Router } from "express";
import { supabase } from "../config/supabase.js";
import mammoth from "mammoth";
import https from "https";
import http from "http";

const router = Router();

// Convert DOCX URL to HTML
async function convertDocxUrlToHtml(url) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    return url; // Return as-is if not a URL
  }

  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download DOCX: ${response.statusCode}`));
      }

      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const result = await mammoth.convertToHtml({ buffer });
          resolve(result.value); // HTML string
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
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

function mapCaseStudy(row) {
  return {
    ...row,
    cover_image_url: row?.cover_image_url ?? row?.cover_image ?? null,
  };
}

function normalizeCaseStudy(row) {
  // Normalize cover image field
  const cover_image_url = row?.cover_image_url ?? row?.cover_image ?? null;
  
  // Return content as-is (HTML from database)
  const content = row?.content ?? "";
  
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    cover_image_url,
    content,
    published: row.published,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json((data || []).map(normalizeCaseStudy));
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

router.get("/public", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/case-studies/public error:", error);
      throw error;
    }

    res.json((data || []).map(normalizeCaseStudy));
  } catch (err) {
    console.error("GET /api/case-studies/public caught error:", err);
    return res.status(500).json({ error: "Failed to fetch published case studies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Case study not found" });
    }

    res.json(normalizeCaseStudy(data));
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch case study" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = (req.body.title || "").toString().trim();
    let content = extractContent(req.body.content);
    const cover_image = req.body.cover_image ?? null;
    const published = req.body.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Convert DOCX URL to HTML if needed
    if (typeof content === "string" && content.startsWith("http") && content.includes(".docx")) {
      try {
        content = await convertDocxUrlToHtml(content);
      } catch (err) {
        console.error("DOCX conversion error:", err);
        return res.status(500).json({ error: "Failed to convert DOCX to HTML" });
      }
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("case_studies")
      .insert([
        {
          title,
          excerpt,
          content,
          cover_image,
          published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(normalizeCaseStudy(data));
  } catch (err) {
    return res.status(500).json({ error: "Failed to create case study" });
  }
});

router.put("/:id", async (req, res) => {
  try {

    const { data: current, error: fetchError } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (!current) {
      return res.status(404).json({ error: "Case study not found" });
    }

    const title = ((req.body.title ?? current.title) || "").toString().trim();
    const contentRaw = extractContent(req.body.content);
    let content = contentRaw !== "" ? contentRaw : current.content || "";
    const cover_image = req.body.cover_image !== undefined ? req.body.cover_image : current.cover_image ?? null;
    const published = typeof req.body.published === "boolean" ? req.body.published : current.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    // Convert DOCX URL to HTML if needed
    if (typeof content === "string" && content.startsWith("http") && content.includes(".docx")) {
      try {
        content = await convertDocxUrlToHtml(content);
      } catch (err) {
        console.error("DOCX conversion error:", err);
        return res.status(500).json({ error: "Failed to convert DOCX to HTML" });
      }
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("case_studies")
      .update({
        title,
        excerpt,
        content,
        cover_image,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(normalizeCaseStudy(data));
  } catch (err) {
    return res.status(500).json({ error: "Failed to update case study" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("case_studies")
      .delete()
      .eq("id", req.params.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Case study not found" });
    }

    res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete case study" });
  }
});

export default router;
