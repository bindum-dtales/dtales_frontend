const { Router } = require("express");
const pool = require("../db");

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(rows);
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
    res.json(rows);
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
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, slug, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO blogs (title, slug, content, cover_image_url, published)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [title, slug, content, cover_image_url, published]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `UPDATE blogs SET
       title = $1,
       slug = $2,
       content = $3,
       cover_image_url = $4,
       published = $5,
       updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [title, slug, content, cover_image_url, published, id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(rows[0]);
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

