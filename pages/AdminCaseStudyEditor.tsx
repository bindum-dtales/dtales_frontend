import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { apiFetch, apiPost, apiPut } from "../src/lib/api";
import { uploadImage } from "../src/lib/uploads";
import { parseDocxToHtml } from "../src/lib/docxParser";

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    img.onload = () => {
      const maxWidth = 1200;
      const scale = Math.min(maxWidth / img.width, 1);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.7
      );
    };

    img.src = URL.createObjectURL(file);
  });
}

const AdminCaseStudyEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;

    const loadCaseStudy = async () => {
      try {
        const data = await apiFetch<{
          title: string;
          slug: string;
          cover_image_url?: string | null;
        }>(`/api/case-studies/${id}`);
        setTitle(data.title || "");
        setCoverImageUrl(data.cover_image_url || "");
      } catch (e: any) {
        setError(e.message || "Failed to load case study");
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudy();
  }, [id, isEdit]);

  useEffect(() => {
    if (htmlContent) {
      setError(null);
    }
  }, [htmlContent]);

  useEffect(() => {
    if (coverImageUrl) {
      setError(null);
    }
  }, [coverImageUrl]);

  const handleCoverImageUpload = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImage(compressed);
      if (url) {
        setCoverImageUrl(url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocxFileChange = async (file: File | null) => {
    if (!file) return;
    setError(null);

    try {
      const html = await parseDocxToHtml(file);
      if (html && html.trim()) {
        setHtmlContent(html);
      } else {
        setError("Failed to parse .docx file: no content extracted");
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse .docx file");
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!title.trim()) {
        setError("Title is required");
        setSaving(false);
        return;
      }

      if (!isEdit && !htmlContent) {
        setError("Please upload a .docx file with your content");
        setSaving(false);
        return;
      }

      // Payload matches Supabase schema: cover_image_url (text), content (text/HTML)
      const payload: any = {
        title: title.trim(),
        cover_image_url: coverImageUrl,  // Supabase column name
        published: false,
      };

      // Only include content if it's being updated
      if (htmlContent) {
        payload.content = htmlContent;  // Plain HTML string
      }

      if (isEdit && id) {
        await apiPut(`/api/case-studies/${id}`, payload);
      } else {
        await apiPost("/api/case-studies", payload);
      }
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setError(null);
    try {
      if (!title.trim()) {
        setError("Title is required");
        setSaving(false);
        return;
      }

      if (!isEdit && !htmlContent) {
        setError("Please upload a .docx file with your content");
        setSaving(false);
        return;
      }

      // Payload matches Supabase schema exactly: cover_image_url (text), content (text/HTML)
      const payload: any = {
        title: title.trim(),
        cover_image_url: coverImageUrl,  // Supabase column name
        published: true,
      };

      // Only include content if it's being updated
      if (htmlContent) {
        payload.content = htmlContent;  // Plain HTML string
      }

      console.log("Publishing case study with payload:", JSON.stringify(payload, null, 2));

      if (isEdit && id) {
        await apiPut(`/api/case-studies/${id}`, payload);
      } else {
        await apiPost("/api/case-studies", payload);
      }

      navigate("/admin/dashboard");
    } catch (e: any) {
      console.error("Publish error:", e);
      setError(e.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEdit ? "Edit Case Study" : "New Case Study"}
        </motion.h1>

        {loading && (
          <div className="mb-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 text-center">
            Loading editor…
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#0020BF] focus:border-[#0020BF]"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            {/* Cover Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Cover Image</label>
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2 bg-[#0020BF] hover:bg-[#0b2be0] disabled:opacity-60 text-white px-4 py-3 rounded-lg font-semibold shadow-sm"
                >
                  <Upload size={18} />
                  {uploadingImage ? "Uploading..." : "Choose Image"}
                </button>
                {coverImageUrl && (
                  <div className="flex-1 flex items-center gap-3">
                    <img src={coverImageUrl} alt="Cover preview" className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl("")}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleCoverImageUpload(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            {/* Content File Upload (.docx) */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Upload Content (.docx from Google Docs)
              </label>
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => docxInputRef.current?.click()}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-semibold border border-gray-200"
                >
                  <Upload size={18} />
                  Choose .docx File
                </button>
                {htmlContent && (
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-green-600">Content parsed successfully</span>
                    <button
                      type="button"
                      onClick={() => setHtmlContent(null)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={docxInputRef}
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => handleDocxFileChange(e.target.files?.[0] || null)}
                className="hidden"
              />
              {isEdit && !htmlContent && (
                <p className="text-xs text-gray-500 mt-2">
                  Leave empty to keep existing content
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-4 justify-end">
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 disabled:opacity-60 transition-all border border-gray-200"
            >
              {saving ? "Saving…" : "Save Draft"}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-[#0020BF] text-white font-semibold hover:bg-[#0b2be0] disabled:opacity-60 transition-all shadow-sm"
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCaseStudyEditor;
