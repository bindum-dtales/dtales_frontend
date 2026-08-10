import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, X, CheckCircle, FileText, FileSpreadsheet, FileType } from "lucide-react";
import {
  createPortfolio,
  updatePortfolio,
  uploadPortfolioImage,
  PortfolioItem,
} from "../src/lib/portfolioApi";
import {
  buildAttachmentPreview,
  AttachmentPreview,
} from "../src/lib/attachmentParser";
import SEO from '../components/seo/SEO';

// Image upload constraints
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Temporary static data for the Capability / Subcategory fields.
const CAPABILITIES = [
  "Product Marketing",
  "Sales Enablement",
  "Technical Documentation",
  "Product Experience",
  "Digital Experience",
  "GTM Strategy",
] as const;

const SUBCATEGORIES_BY_CAPABILITY: Record<string, string[]> = {
  "Product Marketing": ["LinkedIn Posts", "IG Posts", "Campaigns", "LinkedIn Ads"],
  "Sales Enablement": ["Slide Decks", "Brochures", "Flyers", "Service Profiles"],
  "Technical Documentation": ["Integration Docs", "User Guides", "API Guides", "Docs Portal"],
  "Product Experience": ["Ad Videos", "Product Demos", "Feature Demos"],
  "Digital Experience": ["Product Webpages", "Prototypes", "Brand Systems", "Campaign"],
  "GTM Strategy": ["Messaging", "Positioning", "Content Strategy", "Campaign Planning"],
};

interface PortfolioFormData {
  title: string;
  companyName: string;
  description: string;
  projectLink: string;
  coverImage: File | null;
  previewUrl: string | null;
}

export default function PortfolioCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editingItem = location.state?.item as PortfolioItem | undefined;
  const isEditing = !!editingItem;

  const [formData, setFormData] = useState<PortfolioFormData>({
    title: editingItem?.title || "",
    companyName: editingItem?.company_name || "",
    description: editingItem?.description || "",
    projectLink: editingItem?.link || "",
    coverImage: null,
    previewUrl: editingItem?.cover_image_url || null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const [capability, setCapability] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [featured, setFeatured] = useState(editingItem?.featured ?? false);

  const [attachment, setAttachment] = useState<AttachmentPreview | null>(
    editingItem?.content
      ? {
          attachmentType: "document",
          previewType: "html",
          previewContent: editingItem.content,
          fileName: "Document",
        }
      : null
  );
  const [attachmentProcessing, setAttachmentProcessing] = useState(false);

  const hasProjectLink = formData.projectLink.trim().length > 0;
  const hasDocument = !!attachment;
  const documentHtml =
    attachment?.previewType === "html" ? attachment.previewContent : null;

  const handleCapabilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCapability(e.target.value);
    setSubcategory("");
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubcategory(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleAttachmentUpload = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setAttachmentProcessing(true);

    try {
      const preview = await buildAttachmentPreview(file);
      if (preview.previewType === "html" && !preview.previewContent?.trim()) {
        setError("Failed to parse file: no content extracted");
      } else {
        setAttachment(preview);
      }
    } catch (err: any) {
      setError(err.message || "Failed to parse file");
    } finally {
      setAttachmentProcessing(false);
      if (attachmentInputRef.current) {
        attachmentInputRef.current.value = "";
      }
    }
  };

  const removeDocument = () => {
    if (attachment?.previewType === "image" && attachment.previewContent) {
      URL.revokeObjectURL(attachment.previewContent);
    }
    setAttachment(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.projectLink.trim() && !hasDocument) {
      setError("Provide a Project Link or upload a document");
      return;
    }

    if (!capability) {
      setError("Capability is required");
      return;
    }

    if (!subcategory) {
      setError("Subcategory is required");
      return;
    }

    // For new items, image is required; for editing, image is optional (can keep existing)
    if (!isEditing && !formData.coverImage) {
      setError("Cover image is required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.previewUrl;

      // Upload image only if a new file was selected
      if (formData.coverImage) {
        imageUrl = await uploadPortfolioImage(formData.coverImage);
      }

      const portfolioData = {
        title: formData.title,
        company_name: formData.companyName,
        description: formData.description,
        capability,
        subcategory,
        featured,
        cover_image_url: imageUrl!,
        link: formData.projectLink.trim() ? formData.projectLink.trim() : null,
        content: documentHtml || null,
        published: true,
      };

      if (isEditing && editingItem) {
        // Update existing portfolio
        await updatePortfolio(editingItem.id, portfolioData);
      } else {
        // Create new portfolio
        await createPortfolio(portfolioData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/portfolio/manage");
      }, 1500);
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? "update" : "create"} portfolio item`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <SEO
        title={isEditing ? 'Edit Portfolio Item | DTALES Tech' : 'Create Portfolio Item | DTALES Tech'}
        description="Create or edit a DTALES Tech portfolio item."
        noindex
      />
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isEditing ? "Edit Portfolio Item" : "Create Portfolio Item"}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEditing ? "Update your project details" : "Add a new project to your portfolio"}
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
                Portfolio item {isEditing ? "updated" : "created"} successfully!
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

            {/* Company Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
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
                disabled={hasDocument}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0020BF] transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
              {hasDocument && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Remove the document to use an external project link.
                </p>
              )}
            </div>

            {/* Attachment Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Attachment
              </label>

              {attachment ? (
                attachment.previewType === "image" ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={attachment.previewContent || ""}
                      alt={attachment.fileName}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeDocument}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : attachment.previewType === "html" ? (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                    <FileText className="text-[#0020BF] flex-shrink-0" size={20} />
                    <span className="flex-1 text-sm font-medium text-gray-900">
                      Document Uploaded
                    </span>
                    <button
                      type="button"
                      onClick={removeDocument}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50">
                    {attachment.attachmentType === "spreadsheet" ? (
                      <FileSpreadsheet className="text-[#0020BF] flex-shrink-0" size={20} />
                    ) : (
                      <FileType className="text-[#0020BF] flex-shrink-0" size={20} />
                    )}
                    <span className="flex-1 min-w-0 text-sm font-medium text-gray-900">
                      <span className="block">
                        {attachment.attachmentType === "pdf"
                          ? "PDF selected:"
                          : attachment.attachmentType === "spreadsheet"
                          ? "Spreadsheet selected:"
                          : "Document selected:"}
                      </span>
                      <span className="block truncate text-gray-600 font-normal">
                        {attachment.fileName}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={removeDocument}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )
              ) : (
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  disabled={hasProjectLink || attachmentProcessing}
                  className="w-full py-3 px-4 border border-gray-200 rounded-xl text-gray-900 font-medium hover:bg-gray-50 transition-colors disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload size={18} />
                  {attachmentProcessing ? "Parsing..." : "Choose Attachment"}
                </button>
              )}

              {hasProjectLink && !attachment && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Clear the Project Link to upload a document.
                </p>
              )}

              <p className="text-xs text-gray-500 mt-1.5">
                Supports DOCX, PDF, TXT, Markdown, Excel, CSV, RTF, ODT, and image files.
              </p>

              <input
                ref={attachmentInputRef}
                type="file"
                accept=".docx,.txt,.md,.pdf,.csv,.xls,.xlsx,.rtf,.odt,.jpg,.jpeg,.png,.webp,.svg,.bmp,.gif,.tif,.tiff"
                onChange={(e) => handleAttachmentUpload(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleTextAreaChange}
                placeholder="Enter project description"
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#0020BF] transition-colors resize-none"
              />
            </div>

            {/* Capability Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Capability
              </label>
              <select
                name="capability"
                value={capability}
                onChange={handleCapabilityChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-[#0020BF] transition-colors cursor-pointer"
              >
                <option value="">Select a capability</option>
                {CAPABILITIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={subcategory}
                onChange={handleSubcategoryChange}
                required
                disabled={!capability}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:outline-none focus:border-[#0020BF] transition-colors cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                <option value="">
                  {capability ? "Select a subcategory" : "Select a capability first"}
                </option>
                {capability &&
                  SUBCATEGORIES_BY_CAPABILITY[capability].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Featured
                </label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Show this project in the featured section
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={featured}
                onClick={() => setFeatured((prev) => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  featured ? "bg-[#0020BF]" : "bg-gray-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    featured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
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
                    PNG, JPG, or WEBP
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
                {loading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update Portfolio" : "Add Portfolio")}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
