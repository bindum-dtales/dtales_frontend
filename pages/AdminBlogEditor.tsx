import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { apiPost, apiPut } from "../src/lib/api";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(isEdit);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Image,
      Link.configure({ autolink: true, openOnClick: false }),
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

    const loadBlog = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/blogs/${id}`);
        if (!res.ok) throw new Error("Failed to load blog");
        const data = await res.json();

        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCoverUrl(data.cover_image_url || "");
        setPublished(!!data.published);

        editor.commands.setContent(data?.content?.html || "");
      } catch (err: any) {
        setError(err.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [editor, id, isEdit]);

  const setHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().setHeading({ level }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL");
    if (!url) return;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
  };

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);
    try {
      const editorHTML = editor.getHTML();
      const payload = {
        title,
        slug,
        cover_image_url: coverUrl,
        content: { html: editorHTML },
        published,
      };
      
      if (isEdit && id) {
        await apiPut(`/api/blogs/${id}`, payload);
      } else {
        await apiPost("/api/blogs", payload);
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
          {isEdit ? "Edit Blog" : "New Blog"}
        </motion.h1>

        {(loading || !editor) && (
          <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10 text-gray-200 text-center">
            Loading blog…
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300">
            {error}
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
          <input
            className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
            placeholder="Cover Image URL"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
          />
          <label className="flex items-center gap-2 text-white">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish
          </label>
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

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-6 py-3 rounded-xl bg-[#0020BF] text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Blog"}
        </button>
      </div>
    </div>
  );
};

export default AdminBlogEditor;

