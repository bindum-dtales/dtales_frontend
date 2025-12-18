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
 * 🚨 Slug is FORCED here
 */
router.post("/", async (req, res) => {
  try {
    const { title, content, cover_image_url } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const { rows } = await pool.query(
      `
      INSERT INTO case_studies (title, slug, content, cover_image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [title.trim(), slug, content ?? "", cover_image_url ?? null]
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
    const { title, content, cover_image_url, published } = req.body;

    const { rows } = await pool.query(
      `
      UPDATE case_studies
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          cover_image_url = $3,
          published = COALESCE($4, published),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
      `,
      [title, content, cover_image_url ?? null, published, id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Case study not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("UPDATE CASE STUDY ERROR:", err);
    return res.status(500).json({ error: "Failed to update case study" });
  }
});

module.exports = router;
