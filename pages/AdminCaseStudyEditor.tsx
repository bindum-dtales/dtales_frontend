import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { apiFetch, apiPost, apiPut } from "../src/lib/api";
import { useImageUpload } from "../src/hooks/useImageUpload";

const AdminCaseStudyEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { uploadImage, uploading: uploadingImage, error: uploadError, setError: setUploadError } = useImageUpload();

  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [docxContent, setDocxContent] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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

  const handleCoverImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    const url = await uploadImage(file);
    if (url) {
      setCoverImageUrl(url);
    }
  };

  const handleDocxFileChange = async (file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith(".docx")) {
      setError("Only .docx files are allowed");
      return;
    }
    setError(null);
    setContentFile(file);
    setDocxContent(null);

    const html = await uploadDocxAndGetContent(file);
    if (html) {
      setDocxContent(html);
    } else {
      setContentFile(null);
    }
  };

  const uploadDocxAndGetContent = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("contentFile", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://dtales-backend.onrender.com"}/api/uploads/docx`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload .docx file");
      }

      const data = await response.json();
      return data.html;
    } catch (err: any) {
      setError(err.message || "Failed to process .docx file");
      return null;
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

      const payload: any = {
        title: title.trim(),
        cover_image_url: coverImageUrl,
        published: false,
      };

      // Only include content if we already converted a .docx file
      if (docxContent) {
        payload.content = docxContent; // Plain HTML string, NOT { html: ... }
      } else if (!isEdit) {
        // For new case studies, content is required
        setError("Please upload a .docx file with your content");
        setSaving(false);
        return;
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

      const payload: any = {
        title: title.trim(),
        cover_image_url: coverImageUrl,
        published: true,
      };

      // Only include content if we already converted a .docx file
      if (docxContent) {
        payload.content = docxContent; // Plain HTML string, NOT { html: ... }
      } else if (!isEdit) {
        // For new case studies, content is required
        setError("Please upload a .docx file with your content");
        setSaving(false);
        return;
      }

      if (isEdit && id) {
        await apiPut(`/api/case-studies/${id}`, payload);
      } else {
        await apiPost("/api/case-studies", payload);
      }

      navigate("/admin/dashboard");
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 pt-28 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h1 className="text-3xl font-bold text-white mb-6">
          {isEdit ? "Edit Case Study" : "New Case Study"}
        </motion.h1>

        {loading && (
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-center">
            Loading editor…
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {uploadError && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex justify-between items-center">
            <span>{uploadError}</span>
            <button onClick={() => setUploadError(null)}>
              <X size={18} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white md:col-span-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          {/* Cover Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Cover Image</label>
            <div className="flex gap-3 items-center">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingImage}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-3 rounded-xl font-semibold transition"
              >
                <Upload size={18} />
                {uploadingImage ? "Uploading..." : "Choose Image"}
              </button>
              {coverImageUrl && (
                <div className="flex-1 flex items-center gap-3">
                  <img src={coverImageUrl} alt="Cover preview" className="h-12 w-12 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setCoverImageUrl("")}
                    className="text-red-400 hover:text-red-300"
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
            <label className="block text-sm text-gray-300 mb-2">
              Upload Content (.docx from Google Docs)
            </label>
            <div className="flex gap-3 items-center">
              <button
                type="button"
                onClick={() => docxInputRef.current?.click()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition"
              >
                <Upload size={18} />
                Choose .docx File
              </button>
              {contentFile && (
                <div className="flex-1 flex items-center gap-3">
                  <span className="text-gray-300">{contentFile.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setContentFile(null);
                      setDocxContent(null);
                    }}
                    className="text-red-400 hover:text-red-300"
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
            {isEdit && !contentFile && (
              <p className="text-xs text-gray-400 mt-2">
                Leave empty to keep existing content
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-white/10 border border-white/10 text-white font-semibold hover:bg-white/20 disabled:opacity-60 transition-all"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#0020BF] text-white font-semibold hover:bg-[#0A2CFF] disabled:opacity-60 transition-all"
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCaseStudyEditor;
