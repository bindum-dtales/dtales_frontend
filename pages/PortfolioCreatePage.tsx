import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, X, CheckCircle } from "lucide-react";
import {
  createPortfolio,
  uploadPortfolioImage,
} from "../src/lib/portfolioApi";

// Image upload constraints
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface PortfolioFormData {
  title: string;
  projectLink: string;
  category: "Video" | "Web" | "Branding" | "";
  coverImage: File | null;
  previewUrl: string | null;
}

export default function PortfolioCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PortfolioFormData>({
    title: "",
    projectLink: "",
    category: "",
    coverImage: null,
    previewUrl: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value as "Video" | "Web" | "Branding" | "",
    }));
    setError(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file type - only allow specific MIME types
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Read and preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const previewUrl = event.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
        previewUrl: previewUrl,
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      previewUrl: null,
    }));
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.projectLink.trim()) {
      setError("Project Link is required");
      return;
    }

    if (!formData.category) {
      setError("Category is required");
      return;
    }

    if (!formData.coverImage) {
      setError("Cover image is required");
      return;
    }

    setLoading(true);

    try {
      // Upload image first
      const imageUrl = await uploadPortfolioImage(formData.coverImage);

      // Create portfolio with uploaded image URL
      await createPortfolio({
        title: formData.title,
        link: formData.projectLink,
        category: formData.category,
        cover_image_url: imageUrl,
        published: true,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/portfolio/manage");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to create portfolio item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Create Portfolio Item
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Add a new project to your portfolio
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-700 font-medium">
                Portfolio item created successfully!
              </span>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-5"
          >
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0020BF] transition-colors"
              />
            </div>

            {/* Project Link Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Project Link
              </label>
              <input
                type="url"
                name="projectLink"
                value={formData.projectLink}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0020BF] transition-colors"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-[#0020BF] transition-colors cursor-pointer"
              >
                <option value="">Select a category</option>
                <option value="Video">Video</option>
                <option value="Web">Web</option>
                <option value="Branding">Branding</option>
              </select>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Cover Image
              </label>

              {formData.previewUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={formData.previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-xl text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="text-gray-600" size={24} />
                  <span className="text-gray-900 font-medium">
                    Click to upload image
                  </span>
                  <span className="text-gray-500 text-xs">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </button>
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/portfolio/manage")}
                className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-900 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-[#0020BF] hover:bg-[#0b2be0] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
              >
                {loading ? "Saving..." : "Save Portfolio"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
