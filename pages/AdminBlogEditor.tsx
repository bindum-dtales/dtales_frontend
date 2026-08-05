import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";
import { uploadImage } from "../src/lib/uploads";
import { apiFetch } from "../src/lib/api";
import { parseDocxToHtml } from "../src/lib/docxParser";
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

export default function AdminBlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (coverImageUrl || htmlContent) {
      setError(null);
    }
  }, [coverImageUrl, htmlContent]);

  useEffect(() => {
    if (!isEdit) return;

    const loadBlog = async () => {
      try {
        const data = await apiFetch<{
          title: string;
          cover_image_url?: string | null;
          company_name?: string | null;
        }>(`/api/blogs/${id}`);
        setTitle(data.title || "");
        setCoverImageUrl(data.cover_image_url || null);
        setCompanyName(data.company_name || "");
      } catch (err: any) {
        setError(err.message || "Failed to load blog");
      } finally {
        setPageLoading(false);
      }
    };

    loadBlog();
  }, [id, isEdit]);

  // ---------------- IMAGE UPLOAD ----------------
  async function handleImageUpload(file: File) {
    setError(null);
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      const url = await uploadImage(compressed);
      setCoverImageUrl(url);
      setError(null);
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
      const html = await parseDocxToHtml(file);
      setHtmlContent(html);
    } catch (err) {
      setError("Failed to parse DOCX file. Please ensure it's a valid .docx file.");
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

    if (!companyName.trim()) {
      setError("Company Name is required");
      return;
    }

    if (!isEdit && (!htmlContent || !htmlContent.trim())) {
      setError("Please upload a .docx file with your content");
      return;
    }

    if (!isEdit && !coverImageUrl) {
      setError("Please upload a cover image");
      return;
    }

    try {
      setLoading(true);

      // Payload matches Supabase schema exactly: cover_image_url (text), content (text/HTML)
      const payload: any = {
        title: title.trim(),
        company_name: companyName.trim(),
        cover_image_url: coverImageUrl,  // Supabase column name
        published: true,
      };

      // Only include content if it's being updated
      if (htmlContent) {
        payload.content = htmlContent;   // Plain HTML string
      }

      console.log("Publishing blog with payload:", JSON.stringify(payload, null, 2));

      const responseData = isEdit
        ? await apiFetch<any>(`/api/blogs/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload),
          })
        : await apiFetch<any>("/api/blogs", {
            method: "POST",
            body: JSON.stringify(payload),
          });
      console.log("Publish response:", responseData);

      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Publish error:", err);
      setError(err.message || "Failed to publish blog");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16 px-4">
      <SEO title="New Blog | DTALES Tech" description="Create a new DTALES Tech blog post." noindex />
      <div className="max-w-5xl mx-auto">
        <motion.h1 className="text-3xl font-bold text-white mb-6">
          New Blog
        </motion.h1>

        {pageLoading && (
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
              placeholder="Blog Title"
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
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#0020BF] hover:bg-[#0b2be0] disabled:opacity-60 text-white px-4 py-3 rounded-lg font-semibold shadow-sm"
                >
                  <Upload size={18} />
                  {loading ? "Uploading..." : "Choose Image"}
                </button>
                {coverImageUrl && (
                  <div className="flex-1 flex items-center gap-3">
                    <img src={getProxiedImageUrl(coverImageUrl) || coverImageUrl} alt="Cover preview" className="h-12 w-12 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setCoverImageUrl(null)}
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
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
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
                onChange={(e) => e.target.files && handleDocxUpload(e.target.files[0])}
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
              onClick={handlePublish}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[#0020BF] text-white font-semibold hover:bg-[#0b2be0] disabled:opacity-60 transition-all shadow-sm"
            >
              {loading ? "Publishing…" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


