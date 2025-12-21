const { Router } = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { getSupabase } = require("../config/supabase");
const { uploadImageToSupabase } = require("../utils/supabaseUpload");

const router = Router();

// Multer in-memory storage (no local disk)
const memoryStorage = multer.memoryStorage();

// ============================================================================
// FILE FILTERS
// ============================================================================

const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

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

// Unified multer with fields for image and docx (supports legacy 'contentFile')
const uploadFields = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max (covers images and docx)
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "image") return imageFileFilter(req, file, cb);
    if (file.fieldname === "docx" || file.fieldname === "contentFile") return docxFileFilter(req, file, cb);
    cb(new Error("Unsupported field name"), false);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "docx", maxCount: 1 },
  { name: "contentFile", maxCount: 1 },
]);

/**
 * POST /api/uploads/image
 *
 * Upload a single image file to Supabase Storage.
 * 
 * Request:
 *   - multipart/form-data with field "image"
 *
 * Response (201):
 *   { url: "https://<supabase-public-url>/..." }
 *
 * Error Response (200 with warning):
 *   { warning: "Image upload skipped", reason: "error message" }
 *
 * NOTE: Returns 200 on Supabase failures (graceful degradation)
 * to ensure blog/case study creation is not blocked by upload issues.
 */
router.post("/image", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error("❌ IMAGE UPLOAD ERROR:", err.message);
      return res.status(400).json({
        message: err.message || "Failed to upload image",
        source: "image_upload",
      });
    }

    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      console.error("❌ IMAGE UPLOAD ERROR: No file provided");
      return res.status(400).json({
        message: "No image file provided",
        source: "image_upload",
      });
    }

    try {
      // Initialize Supabase at request-time (lazy initialization)
      let supabase;
      try {
        supabase = getSupabase();
      } catch (initErr) {
        console.warn("⚠️ Supabase initialization failed:", initErr.message);
        return res.status(200).json({
          warning: "Image upload skipped",
          reason: "Supabase configuration error"
        });
      }

      const url = await uploadImageToSupabase(
        supabase,
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      return res.status(201).json({ url });
    } catch (uploadErr) {
      // Check if error is DNS/network related (ENOTFOUND, ECONNREFUSED, ETIMEDOUT)
      const isDnsError = 
        uploadErr.code === "ENOTFOUND" || 
        uploadErr.code === "ECONNREFUSED" || 
        uploadErr.code === "ETIMEDOUT" ||
        uploadErr.message?.includes("ENOTFOUND") ||
        uploadErr.message?.includes("getaddrinfo");

      if (isDnsError) {
        console.warn("⚠️ Supabase DNS/network error, gracefully degrading:", uploadErr.message);
        return res.status(200).json({
          warning: "Image upload skipped",
          reason: "Supabase service unreachable"
        });
      }

      console.error("❌ Image upload failed:", uploadErr.message);
      // Still return 200 to allow blog/case study creation to succeed
      return res.status(200).json({
        warning: "Image upload skipped",
        reason: uploadErr.message || "Upload failed"
      });
    }
  });
});

// ============================================================================
// DOCX UPLOAD HANDLER
// ============================================================================

/**
 * POST /api/uploads/docx
 *
 * Upload and parse a .docx file.
 * 
 * Flow:
 *   1. Accept DOCX via multer memory storage
 *   2. Parse DOCX → HTML using Mammoth
 *   3. Upload images embedded in DOCX to Supabase (graceful degradation on failure)
 *   4. Return clean HTML with Supabase image URLs
 *
 * Request:
 *   - multipart/form-data with field "contentFile"
 *
 * Response (200):
 *   { html: "<html content with Supabase image URLs>", images: ["url1", "url2"] }
 *
 * Error Response (200 with partial success):
 *   { html: "<html content>", images: [] }
 *   (If image uploads fail, HTML is still returned)
 *
 * Error Response (400 or 500):
 *   { message: "error description", source: "docx_parse" }
 */
router.post("/docx", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error("❌ DOCX UPLOAD ERROR:", err.message);
      return res.status(400).json({
        message: err.message || "Failed to upload .docx file",
        source: "docx_parse",
      });
    }

    const docxFile = req.files?.docx?.[0] || req.files?.contentFile?.[0];
    if (!docxFile) {
      console.error("❌ DOCX UPLOAD ERROR: DOCX file missing");
      return res.status(400).json({
        message: "DOCX file missing",
        source: "docx_parse",
      });
    }

    try {
      // Initialize Supabase at request-time (lazy initialization)
      let supabase;
      try {
        supabase = getSupabase();
      } catch (initErr) {
        console.warn("⚠️ Supabase initialization failed, continuing without image upload:", initErr.message);
        supabase = null; // Continue parsing DOCX without Supabase
      }

      const uploadedImages = [];

      // Parse .docx buffer to HTML with image handling
      const result = await mammoth.convertToHtml(
        { buffer: docxFile.buffer },
        {
          convertImage: supabase ? mammoth.images.imgElement(async (image) => {
            try {
              const buffer = await image.read();
              const url = await uploadImageToSupabase(
                supabase,
                buffer,
                `docx-embedded-${Date.now()}.png`,
                image.contentType || "image/png"
              );
              uploadedImages.push(url);
              return { src: url };
            } catch (imgErr) {
              console.warn("⚠️ Skipping embedded image upload:", imgErr.message);
              // Continue parsing without this image
              return { src: "" };
            }
          }) : undefined
        }
      );

      console.log(`✅ DOCX parsed. Uploaded ${uploadedImages.length} embedded images to Supabase`);
      return res.status(200).json({ html: result.value, images: uploadedImages });
    } catch (parseErr) {
      console.error("❌ DOCX parse error:", parseErr.message);
      return res.status(500).json({
        message: `Failed to parse .docx file: ${parseErr.message}`,
        source: "docx_parse",
      });
    }
  });
});

module.exports = router;
