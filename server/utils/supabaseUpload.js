const supabase = require("../config/supabase");

const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET;

/**
 * Upload an image buffer to Supabase Storage and return its public URL.
 * 
 * @param {Buffer} buffer - Image file buffer
 * @param {string} filename - Original filename (will be sanitized)
 * @param {string} mimeType - MIME type (e.g., 'image/png', 'image/jpeg')
 * @returns {Promise<string>} Public URL of the uploaded image
 * @throws {Error} If upload fails or bucket is not configured
 */
async function uploadImageToSupabase(buffer, filename, mimeType) {
  if (!SUPABASE_BUCKET) {
    throw new Error("SUPABASE_BUCKET environment variable is not configured");
  }

  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Invalid buffer provided - must be a Buffer instance");
  }

  if (!buffer.length) {
    throw new Error("Empty buffer provided - cannot upload empty file");
  }

  // Generate unique file path
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = filename.split(".").pop() || "png";
  const sanitizedName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `uploads/${timestamp}-${randomString}-${sanitizedName}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(path, buffer, {
      contentType: mimeType || "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    console.error("❌ Supabase upload error:", uploadError);
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Failed to generate public URL for uploaded file");
  }

  console.log("✅ Supabase upload successful:", publicUrlData.publicUrl);
  return publicUrlData.publicUrl;
}

module.exports = { uploadImageToSupabase };
