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
 * POST create case study
 * 🚨 Slug is FORCED here
 */
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Title is required" });
    }

    const baseSlug = generateSlug(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const { rows } = await pool.query(
      `
      INSERT INTO case_studies (title, slug, content)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [title.trim(), slug, content ?? ""]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("CREATE CASE STUDY ERROR:", err);
    return res.status(500).json({ error: "Failed to create case study" });
  }
});

module.exports = router;
