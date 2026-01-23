import { useState } from "react";
import { uploadImage, uploadDocx } from "../src/lib/uploads";
import { API_BASE_URL } from "../constants";

export default function AdminBlogEditor() {
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [docxUrl, setDocxUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ---------------- IMAGE UPLOAD ----------------
  async function handleImageUpload(file: File) {
    setError(null);
    setLoading(true);
    try {
      const url = await uploadImage(file);
      setCoverImageUrl(url);
    } catch (err) {
      setError("Image upload failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- DOCX UPLOAD ----------------
  async function handleDocxUpload(file: File) {
    setError(null);
    setLoading(true);
    try {
      const url = await uploadDocx(file); // backend returns { url }
      setDocxUrl(url); // ✅ THIS WAS MISSING BEFORE
    } catch (err) {
      setError("DOCX upload failed");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- PUBLISH ----------------
  async function handlePublish() {
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!docxUrl) {
      setError("Please upload a .docx file with your content");
      return;
    }

    if (!coverImageUrl) {
      setError("Please upload a cover image");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          coverImage: coverImageUrl,
          docxUrl,
          status: "published",
        }),
      });

      if (!res.ok) throw new Error("Failed to publish blog");

      window.location.href = "/#/admin/blogs";
    } catch (err) {
      setError("Failed to publish blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">New Blog</h1>

      {error && (
        <div className="bg-red-900/40 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <input
        className="w-full mb-4 p-3 rounded bg-gray-800"
        placeholder="Blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* IMAGE */}
      <div className="mb-4">
        <label className="block mb-2">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
        />
        {coverImageUrl && (
          <img src={coverImageUrl} className="mt-2 w-32 rounded" />
        )}
      </div>

      {/* DOCX */}
      <div className="mb-6">
        <label className="block mb-2">Upload Content (.docx)</label>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => e.target.files && handleDocxUpload(e.target.files[0])}
        />
        {docxUrl && (
          <p className="text-green-400 mt-1">DOCX uploaded successfully</p>
        )}
      </div>

      <button
        onClick={handlePublish}
        disabled={loading}
        className="bg-blue-600 px-6 py-2 rounded"
      >
        {loading ? "Publishing..." : "Publish"}
      </button>
    </div>
  );
}


