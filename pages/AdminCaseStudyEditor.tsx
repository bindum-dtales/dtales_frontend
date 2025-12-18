import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  X,
} from "lucide-react";
import { apiFetch, apiPost, apiPut } from "../src/lib/api";
import { useImageUpload } from "../src/hooks/useImageUpload";

const AdminCaseStudyEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { uploadImage, uploading: uploadingImage, error: uploadError, setError: setUploadError } = useImageUpload();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const editorImageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[420px] outline-none text-white leading-relaxed p-6 rounded-xl",
      },
    },
  });

  useEffect(() => {
    if (!isEdit || !editor) return;

    const loadCaseStudy = async () => {
      try {
        const data = await apiFetch<{ title: string; slug: string; cover_image_url?: string | null; content?: { html?: string } }>(`/api/case-studies/${id}`);
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCoverImageUrl(data.cover_image_url || "");
        editor.commands.setContent(data?.content?.html || "");
      } catch (e: any) {
        setError(e.message || "Failed to load case study");
      } finally {
        setLoading(false);
      }
    };

    loadCaseStudy();
  }, [editor, id, isEdit]);

  const setHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().setHeading({ level }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleCoverImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploadError(null);
    const url = await uploadImage(file);
    if (url) {
      setCoverImageUrl(url);
    }
  };

  const handleEditorImageUpload = async (file: File | null) => {
    if (!file || !editor) return;
    setUploadError(null);
    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addEditorImage = () => {
    editorImageInputRef.current?.click();
  };

  const handleSaveDraft = async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);
    try {
      const editorHTML = editor.getHTML();
      const payload = {
        title,
        slug,
        cover_image_url: coverImageUrl,
        content: { html: editorHTML },
        published: false,
      };

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
    if (!editor) return;
    setSaving(true);
    setError(null);
    try {
      const editorHTML = editor.getHTML();
      const payload = {
        title,
        slug,
        cover_image_url: coverImageUrl,
        content: { html: editorHTML },
        published: true,
      };

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

        {(loading || !editor) && (
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
            className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
        </div>

        <div className="bg-white/10 border border-white/10 backdrop-blur-lg rounded-xl">
          <div className="sticky top-24 bg-black/30 border-b border-white/10 px-4 py-2 flex gap-2 flex-wrap">
            <button
              aria-label="Heading 1"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => setHeading(1)}
            >
              <Heading1 size={16} />
            </button>
            <button
              aria-label="Heading 2"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => setHeading(2)}
            >
              <Heading2 size={16} />
            </button>
            <button
              aria-label="Heading 3"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => setHeading(3)}
            >
              <Heading3 size={16} />
            </button>

            <button
              aria-label="Bold"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold size={16} />
            </button>
            <button
              aria-label="Italic"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic size={16} />
            </button>
            <button
              aria-label="Underline"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon size={16} />
            </button>

            <button
              aria-label="Bullet List"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List size={16} />
            </button>
            <button
              aria-label="Ordered List"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered size={16} />
            </button>

            <button
              aria-label="Add Link"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={addLink}
            >
              <LinkIcon size={16} />
            </button>
            <button
              aria-label="Add Image"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={addImage}
            >
              <ImageIcon size={16} />
            </button>

            <button
              aria-label="Undo"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().undo().run()}
            >
              <Undo size={16} />
            </button>
            <button
              aria-label="Redo"
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
              onClick={() => editor?.chain().focus().redo().run()}
            >
              <Redo size={16} />
            </button>
          </div>

          <EditorContent editor={editor} />
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
