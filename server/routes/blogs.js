const { Router } = require("express");
const pool = require("../db");

const router = Router();

// List all blogs (admin)
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Public list (published only)
router.get("/public", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching public blogs:", err);
    res.status(500).json({ error: "Failed to fetch public blogs" });
  }
});

// Get by id
router.get("/:id", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM blogs WHERE id = $1", [
      req.params.id,
    ]);
    if (!rows.length) return res.status(404).json({ error: "Blog not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching blog:", err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// Create
router.post("/", async (req, res) => {
  try {
    const { title, slug, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO blogs (title, slug, content, cover_image_url, published)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, slug, content, cover_image_url || null, !!published]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { title, slug, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `UPDATE blogs SET
       title = $1,
       slug = $2,
       content = $3,
       cover_image_url = $4,
       published = $5,
       updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [title, slug, content, cover_image_url, published, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Blog not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM blogs WHERE id = $1", [
      req.params.id,
    ]);
    if (!result.rowCount)
      return res.status(404).json({ error: "Blog not found" });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;

