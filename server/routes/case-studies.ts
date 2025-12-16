import { Router } from "express";
import pool from "../db";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM case_studies ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

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
  } catch (error) {
    console.error("Error fetching case study:", error);
    res.status(500).json({ error: "Failed to fetch case study" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, client, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO case_studies (title, client, content, cover_image_url, published)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, client ?? null, content, cover_image_url ?? null, !!published]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating case study:", error);
    res.status(500).json({ error: "Failed to create case study" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, client, content, cover_image_url, published } = req.body;
    const { rows } = await pool.query(
      `UPDATE case_studies SET
       title = $1,
       client = $2,
       content = $3,
       cover_image_url = $4,
       published = $5,
       updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [title, client, content, cover_image_url, published, id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: "Case study not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating case study:", error);
    res.status(500).json({ error: "Failed to update case study" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query(
      "DELETE FROM case_studies WHERE id = $1",
      [id]
    );
    if (!rowCount) {
      return res.status(404).json({ error: "Case study not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting case study:", error);
    res.status(500).json({ error: "Failed to delete case study" });
  }
});

export = router;

