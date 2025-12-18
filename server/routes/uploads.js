const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp + original extension
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}${ext}`;
    cb(null, filename);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

/**
 * POST /api/uploads/image
 * Upload a single image file
 * Returns { url: "/uploads/filename.ext" }
 */
router.post("/image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: imageUrl });
  } catch (err) {
    console.error("IMAGE UPLOAD ERROR:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
