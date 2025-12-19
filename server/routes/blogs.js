const { Router } = require("express");
const pool = require("../db");

const router = Router();

/**
 * Generate a URL-safe slug from a title
 */
function generateSlug(title) {
  if (!title) return "untitled";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Ensure slug is unique by appending a counter if needed
 */
async function ensureUniqueSlug(baseSlug, excludeId = null) {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = excludeId
      ? "SELECT id FROM blogs WHERE slug = $1 AND id != $2"
      : "SELECT id FROM blogs WHERE slug = $1";
    const params = excludeId ? [slug, excludeId] : [slug];
    
    const { rows } = await pool.query(query, params);
    
    if (rows.length === 0) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
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

function toBooleanStrict(value) {
  return value === true; // only literal true is treated as true
}

function pickContentHtml(bodyContent) {
  if (typeof bodyContent === "string") return bodyContent;
  if (bodyContent && typeof bodyContent.html === "string") return bodyContent.html;
  return "";
}

function pickCoverImage(body) {
  return body.cover_image_url ?? body.cover_image ?? null;
}

function mapBlogRow(row) {
  if (!row) return row;
  return {
    ...row,
    cover_image_url: row.cover_image ?? null,
    content: { html: row.content || "" },
  };
}

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(rows.map(mapBlogRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/public", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC"
    );
    res.json(rows.map(mapBlogRow));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch public blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM blogs WHERE id = $1",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(mapBlogRow(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const title = (req.body.title || "").toString().trim();
    const contentHtml = pickContentHtml(req.body.content);
    const coverImage = pickCoverImage(req.body);
    const published = toBooleanStrict(req.body.published);

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!contentHtml) {
      return res.status(400).json({ error: "Content HTML is required" });
    }

    const baseSlug = generateSlug(title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);
    const excerpt = buildExcerpt(contentHtml, 200);

    const { rows } = await pool.query(
      `INSERT INTO blogs (title, slug, excerpt, content, cover_image, published)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, uniqueSlug, excerpt, contentHtml, coverImage, published]
    );
    res.status(201).json(mapBlogRow(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Load existing to preserve slug and fill defaults defensively
    const existing = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);
    if (!existing.rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const current = existing.rows[0];

    const title = ((req.body.title ?? current.title) || "").toString().trim();
    const contentHtmlRaw = pickContentHtml(req.body.content);
    // Only use new content if explicitly provided; otherwise keep existing
    const contentHtml = contentHtmlRaw !== "" ? contentHtmlRaw : current.content || "";
    const coverImage = pickCoverImage(req.body);
    const published = toBooleanStrict(req.body.published);

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!contentHtml) {
      return res.status(400).json({ error: "Content HTML is required" });
    }

    const excerpt = buildExcerpt(contentHtml, 200);
    // Preserve existing slug; only generate if it's unexpectedly missing
    const slugToUse = current.slug || (await ensureUniqueSlug(generateSlug(title), id));

    const { rows } = await pool.query(
      `UPDATE blogs SET
       title = $1,
       slug = $2,
       excerpt = $3,
       content = $4,
       cover_image = $5,
       published = $6,
       updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, slugToUse, excerpt, contentHtml, coverImage ?? current.cover_image ?? null, published, id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(mapBlogRow(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM blogs WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;

