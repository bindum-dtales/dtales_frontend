import { Router } from "express";
import pool from "../db";

const router = Router();

/**
 * GET /api/blogs
 * Get all blogs (admin)
 */
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

/**
 * GET /api/blogs/public
 * Get published blogs (public)
 */
router.get("/public", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM blogs WHERE published = true ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching public blogs:", error);
    res.status(500).json({ error: "Failed to fetch public blogs" });
  }
});

/**
 * POST /api/blogs
 * Create blog
 */
router.post("/", async (req, res) => {
  try {
    const { title, slug, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO blogs (title, slug, content, cover_image_url, published)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, slug, content, cover_image_url ?? null, !!published]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

/**
 * GET /api/blogs/:id
 * Get single blog by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM blogs WHERE id = $1", [id]);
    if (!rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

/**
 * PUT /api/blogs/:id
 * Update blog by ID
 */
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
       WHERE id = $6 RETURNING *`,
      [title, slug, content, cover_image_url, published, id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: "Failed to update blog" });
  }
});

/**
 * DELETE /api/blogs/:id
 * Delete blog by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM blogs WHERE id = $1", [
      id,
    ]);
    if (!rowCount) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export = router;

