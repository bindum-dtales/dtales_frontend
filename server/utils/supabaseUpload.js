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

  const filePath = `${Date.now()}-${filename}`;

  const { error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    console.error("❌ Supabase upload error:", error);
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  console.log("✅ Supabase upload successful:", data.publicUrl);
  return data.publicUrl;
}

module.exports = { uploadImageToSupabase };
