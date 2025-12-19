const { Router } = require("express");
const pool = require("../db");
const slugify = require("slugify");

const router = Router();

/**
 * Always generate a valid slug (NEVER null)
 */
function generateSlug(title) {
  return slugify(String(title || "case-study"), {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Ensure slug is unique in DB
 */
async function ensureUniqueSlug(baseSlug) {
  const { rows } = await pool.query(
    "SELECT id FROM case_studies WHERE slug = $1",
    [baseSlug]
  );

  if (rows.length === 0) return baseSlug;
  return `${baseSlug}-${Date.now()}`;
}

async function ensureUniqueSlugForUpdate(baseSlug, recordId) {
  const { rows } = await pool.query(
    "SELECT id FROM case_studies WHERE slug = $1 AND id <> $2",
    [baseSlug, recordId]
  );
  if (rows.length === 0) return baseSlug;
  return `${baseSlug}-${Date.now()}`;
}

/**
 * GET all case studies
 */
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM case_studies ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("FETCH CASE STUDIES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

/**
 * GET published case studies only
 */
router.get("/public", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM case_studies WHERE published = true ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("FETCH PUBLIC CASE STUDIES ERROR:", err);
    res.status(500).json({ error: "Failed to fetch public case studies" });
  }
});

/**
 * GET single case study by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM case_studies WHERE id = $1",
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Case study not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("FETCH CASE STUDY ERROR:", err);
    res.status(500).json({ error: "Failed to fetch case study" });
  }
});

/**
 * POST create case study
 */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      cover_image_url,
      published,
    } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    // Extract HTML from content (handles both string and { html: "..." })
    let contentHtml = "";
    if (typeof req.body.content === "string") {
      contentHtml = req.body.content;
    } else if (req.body.content && typeof req.body.content.html === "string") {
      contentHtml = req.body.content.html;
    }

    if (!contentHtml) {
      return res.status(400).json({ error: "Content is required" });
    }

    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const { rows } = await pool.query(
      `
      INSERT INTO case_studies (
        title,
        slug,
        content,
        cover_image_url,
        published
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        title.trim(),
        slug,
        contentHtml,
        cover_image_url ?? null,
        published === true,
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("CREATE CASE STUDY ERROR:", err);
    return res.status(500).json({ error: "Failed to create case study" });
  }
});

/**
 * PUT update case study by ID
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Load existing to preserve fields not provided
    const existingRes = await pool.query(
      "SELECT * FROM case_studies WHERE id = $1",
      [id]
    );
    if (!existingRes.rows.length) {
      return res.status(404).json({ error: "Case study not found" });
    }
    const current = existingRes.rows[0];

    const newTitle = (req.body.title ?? current.title) || "";
    const title = String(newTitle).trim();
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Always regenerate slug from the (final) title
    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlugForUpdate(baseSlug, id);

    // Extract HTML from content (handles both string and { html: "..." })
    let content = current.content ?? null;
    if (req.body.content !== undefined) {
      if (typeof req.body.content === "string") {
        content = req.body.content;
      } else if (req.body.content && typeof req.body.content.html === "string") {
        content = req.body.content.html;
      }
    }
    
    const cover_image_url =
      req.body.cover_image_url !== undefined
        ? req.body.cover_image_url
        : current.cover_image_url ?? null;
    const published =
      typeof req.body.published === "boolean"
        ? req.body.published
        : current.published;

    const { rows } = await pool.query(
      `
      UPDATE case_studies
      SET
        title = $1,
        slug = $2,
        content = $3,
        cover_image_url = $4,
        published = $5
      WHERE id = $6
      RETURNING *
      `,
      [title, slug, content, cover_image_url, published, id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("UPDATE CASE STUDY ERROR:", err);
    return res.status(500).json({ error: "Failed to update case study" });
  }
});

/**
 * DELETE case study by ID
 * Mirrors blog deletion behavior with JSON response
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid case study id" });
    }

    const result = await pool.query("DELETE FROM case_studies WHERE id = $1", [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "Case study not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("DELETE CASE STUDY ERROR:", err);
    return res.status(500).json({ error: "Failed to delete case study" });
  }
});

module.exports = router;
