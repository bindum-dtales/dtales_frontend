const { Router } = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { getSupabase } = require("../config/supabase");

const router = Router();
const memoryStorage = multer.memoryStorage();

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

const uploadFields = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024,
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

async function uploadImage(supabase, buffer, filename, mimeType) {
  const bucket = process.env.SUPABASE_BUCKET;
  if (!bucket) {
    throw new Error("SUPABASE_BUCKET not configured");
  }

  const filePath = `${Date.now()}-${filename}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, { contentType: mimeType, upsert: false });

  if (error) {
    throw new Error("Upload failed");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

router.post("/image", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Failed to upload image" });
    }

    const imageFile = req.files?.image?.[0];
    if (!imageFile) {
      return res.status(400).json({ error: "No image file provided" });
    }

    try {
      const supabase = getSupabase();
      const url = await uploadImage(
        supabase,
        imageFile.buffer,
        imageFile.originalname,
        imageFile.mimetype
      );
      return res.status(201).json({ url });
    } catch (uploadErr) {
      return res.status(500).json({ error: "Failed to upload image" });
    }
  });
});

router.post("/docx", (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Failed to upload .docx file" });
    }

    const docxFile = req.files?.docx?.[0] || req.files?.contentFile?.[0];
    if (!docxFile) {
      return res.status(400).json({ error: "DOCX file missing" });
    }

    try {
      const supabase = getSupabase();
      const uploadedImages = [];

      const result = await mammoth.convertToHtml(
        { buffer: docxFile.buffer },
        {
          convertImage: mammoth.images.imgElement(async (image) => {
            const buffer = await image.read();
            const url = await uploadImage(
              supabase,
              buffer,
              `docx-embedded-${Date.now()}.png`,
              image.contentType || "image/png"
            );
            uploadedImages.push(url);
            return { src: url };
          }),
        }
      );

      return res.status(200).json({ html: result.value, images: uploadedImages });
    } catch (parseErr) {
      return res.status(500).json({ error: "Failed to parse .docx file" });
    }
  });
});

module.exports = router;
