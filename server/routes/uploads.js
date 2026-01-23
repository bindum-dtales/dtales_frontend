import express from "express";
import multer from "multer";
import { supabase } from "../config/supabase.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file" });
    }

    const filePath = `images/${Date.now()}-${req.file.originalname}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    res.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

router.post("/docx", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No docx file" });
    }

    const filePath = `docs/${Date.now()}-${req.file.originalname}`;

    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    res.json({ url: data.publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Docx upload failed" });
  }
});

export default router;
