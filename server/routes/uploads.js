const { Router } = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { v2: cloudinary } = require("cloudinary");

const router = Router();

// Configure Cloudinary from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer in-memory storage (no local disk)
const memoryStorage = multer.memoryStorage();

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
  storage: memoryStorage,
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
router.post("/image", (req, res) => {
  const uploadHandler = upload.single("image");

  uploadHandler(req, res, async (err) => {
    if (err) {
      console.error("IMAGE UPLOAD ERROR:", err);
      return res.status(400).json({ error: err.message || "Failed to upload image" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "dtales/images", resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY IMAGE ERROR:", error);
            return res.status(500).json({ error: "Failed to upload image" });
          }
          return res.status(201).json({ url: result.secure_url });
        }
      );
      stream.end(req.file.buffer);
    } catch (e) {
      console.error("CLOUDINARY IMAGE EXCEPTION:", e);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  });
});

/**
 * POST /api/uploads/docx
 * Upload a .docx file and convert to HTML
 * Returns { content: "<html>...</html>" }
 */
// DOCX uses in-memory storage; also stored to Cloudinary as raw

const docxFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];
  if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith(".docx")) {
    cb(null, true);
  } else {
    cb(new Error("Only .docx files are allowed"), false);
  }
};

const uploadDocx = multer({
  storage: memoryStorage,
  fileFilter: docxFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

router.post("/docx", (req, res) => {
  const uploadHandler = uploadDocx.single("contentFile");

  uploadHandler(req, res, async (err) => {
    if (err) {
      console.error("DOCX UPLOAD ERROR:", err);
      return res.status(400).json({ error: err.message || "Failed to upload .docx file" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No .docx file provided" });
    }

    try {
      // Store DOCX on Cloudinary (raw)
      await new Promise((resolve, reject) => {
        const docxStream = cloudinary.uploader.upload_stream(
          { folder: "dtales/docs", resource_type: "raw" },
          (error, _result) => {
            if (error) return reject(error);
            resolve(null);
          }
        );
        docxStream.end(req.file.buffer);
      });

      const uploadedImages = [];
      // Convert .docx buffer to HTML with image handling and upload images to Cloudinary
      const result = await mammoth.convertToHtml(
        { arrayBuffer: req.file.buffer },
        {
          convertImage: mammoth.images.imgElement(async (image) => {
            const buffer = await image.read();
            const url = await new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { folder: "dtales/docs/images", resource_type: "image" },
                (error, res) => {
                  if (error) return reject(error);
                  resolve(res.secure_url);
                }
              );
              stream.end(buffer);
            });
            uploadedImages.push(url);
            return { src: url };
          }),
        }
      );

      // Return HTML content and uploaded image URLs
      return res.status(200).json({ html: result.value, images: uploadedImages });
    } catch (parseErr) {
      console.error("DOCX PARSE ERROR:", parseErr);
      return res.status(500).json({ error: "Failed to parse .docx file" });
    }
  });
});

module.exports = router;
