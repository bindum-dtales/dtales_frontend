import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { apiFetch } from "../src/lib/api";
import { uploadImage } from "../src/lib/uploads";
import { DOCUMENT_ACCEPT, parseDocumentToHtml } from "../src/lib/documentContent";
import { MISSING_SOURCE_MESSAGE, useLinkOrDocument } from "../src/hooks/useLinkOrDocument";
import { getProxiedImageUrl } from "../src/utils/imageProxy";
import SEO from '../components/seo/SEO';

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
  const [companyName, setCompanyName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // A case study carries its body either as an external link or as an uploaded
  // document; the hook owns that mutually exclusive choice.
  const {
    link,
    setLink,
    hasLink,
    hasDocument,
    hasNewDocument,
    setDocumentHtml,
    clearDocument,
    loadRecord,
    toPayloadFields,
  } = useLinkOrDocument();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit) return;

    const loadCaseStudy = async () => {
      try {
        const data = await apiFetch<{
          title: string;
          slug: string;
          cover_image_url?: string | null;
          company_name?: string | null;
          link?: string | null;
          content?: string | null;
        }>(`/api/case-studies/${id}`);
        setTitle(data.title || "");
        setCoverImageUrl(data.cover_image_url || "");
        setCompanyName(data.company_name || "");
        loadRecord(data);
      } catch (e: any) {
        setError(e.message || "Failed to load case study");
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudy();
  }, [id, isEdit, loadRecord]);

  useEffect(() => {
    if (hasDocument || hasLink) {
      setError(null);
    }
  }, [hasDocument, hasLink]);

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

  const handleDocumentFileChange = async (file: File | null) => {
    if (!file) return;
    setError(null);

    try {
      const html = await parseDocumentToHtml(file);
      if (html && html.trim()) {
        setDocumentHtml(html);
      } else {
        setError("No content could be extracted from that document.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to read the document. Please try again.");
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

      if (!companyName.trim()) {
        setError("Company Name is required");
        setSaving(false);
        return;
      }

      if (!hasLink && !hasDocument) {
        setError(MISSING_SOURCE_MESSAGE);
        setSaving(false);
        return;
      }

      // Payload matches Supabase schema: cover_image_url (text), content (text/HTML)
      // `link` and `content` come from the hook, which sends one or the other
      // and never both.
      const payload: any = {
        title: title.trim(),
        company_name: companyName.trim(),
        cover_image_url: coverImageUrl,  // Supabase column name
        published: false,
        ...toPayloadFields(),
      };

      if (isEdit && id) {
        await apiFetch<unknown>(`/api/case-studies/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<unknown>("/api/case-studies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
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

      if (!companyName.trim()) {
        setError("Company Name is required");
        setSaving(false);
        return;
      }

      if (!hasLink && !hasDocument) {
        setError(MISSING_SOURCE_MESSAGE);
        setSaving(false);
        return;
      }

      // Payload matches Supabase schema exactly: cover_image_url (text), content (text/HTML)
      // `link` and `content` come from the hook, which sends one or the other
      // and never both.
      const payload: any = {
        title: title.trim(),
        company_name: companyName.trim(),
        cover_image_url: coverImageUrl,  // Supabase column name
        published: true,
        ...toPayloadFields(),
      };

      console.log("Publishing case study with payload:", JSON.stringify(payload, null, 2));

      if (isEdit && id) {
        await apiFetch<unknown>(`/api/case-studies/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch<unknown>("/api/case-studies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
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
      <SEO
        title={isEdit ? 'Edit Case Study | DTALES Tech' : 'New Case Study | DTALES Tech'}
        description="Create or edit a DTALES Tech case study."
        noindex
      />
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

            <input
              className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-[#0020BF] focus:border-[#0020BF]"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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
                    <img src={getProxiedImageUrl(coverImageUrl) || coverImageUrl} alt="Cover preview" className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
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

            {/* Project Link */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Project Link</label>
              <input
                type="url"
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0020BF] focus:border-[#0020BF] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                placeholder="https://example.com"
                value={link}
                disabled={hasDocument}
                onChange={(e) => setLink(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">
                {hasDocument
                  ? "Remove the document to use an external project link."
                  : "Provide a project link instead of uploading a document."}
              </p>
            </div>

            {/* Content File Upload (DOCX / PDF) */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-2">
                Upload Content
              </label>
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                  disabled={hasLink}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-semibold border border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload size={18} />
                  Choose Document
                </button>
                {hasDocument && (
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-green-600">
                      {hasNewDocument
                        ? "Content parsed successfully"
                        : "Existing document in use"}
                    </span>
                    <button
                      type="button"
                      onClick={clearDocument}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={documentInputRef}
                type="file"
                accept={DOCUMENT_ACCEPT}
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  // Reset so re-picking the same file after switching modes
                  // still fires a change event.
                  e.target.value = "";
                  handleDocumentFileChange(file);
                }}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">
                {hasLink
                  ? "Clear the project link to upload a document."
                  : "Supported formats: DOCX, PDF"}
              </p>
              {isEdit && !hasNewDocument && hasDocument && (
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
