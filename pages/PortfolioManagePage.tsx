import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, ExternalLink } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: "Video" | "Web" | "Branding";
  projectLink: string;
  coverImageUrl: string;
}

const PortfolioManagePage: React.FC = () => {
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "E-commerce Platform Redesign",
      category: "Web",
      projectLink: "https://example.com/1",
      coverImageUrl:
        "https://images.unsplash.com/photo-1460925895917-aeb19be489a6?w=500&h=300&fit=crop",
    },
    {
      id: "2",
      title: "Brand Identity System",
      category: "Branding",
      projectLink: "https://example.com/2",
      coverImageUrl:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
    },
    {
      id: "3",
      title: "Product Launch Video",
      category: "Video",
      projectLink: "https://example.com/3",
      coverImageUrl:
        "https://images.unsplash.com/photo-1533228100845-08145b01de14?w=500&h=300&fit=crop",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const getCategoryColor = (
    category: "Video" | "Web" | "Branding"
  ): string => {
    switch (category) {
      case "Web":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Video":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Branding":
        return "bg-pink-50 text-pink-700 border-pink-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Manage Portfolio
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                View, edit, and manage your portfolio projects
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/portfolio/create")}
              className="flex items-center gap-2 bg-[#0020BF] hover:bg-[#0b2be0] text-white px-5 py-2.5 rounded-xl transition-all shadow-sm whitespace-nowrap"
            >
              <Plus size={18} />
              Add New Portfolio
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <p className="text-gray-600">Loading portfolio items...</p>
          ) : portfolioItems.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-white border border-gray-200 shadow-sm text-center">
              <p className="text-gray-600 mb-4">
                No portfolio items yet. Create your first one!
              </p>
              <button
                onClick={() => navigate("/admin/portfolio/create")}
                className="inline-flex items-center gap-2 bg-[#0020BF] hover:bg-[#0b2be0] text-white px-6 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Plus size={18} />
                Create Portfolio Item
              </button>
            </div>
          ) : (
            /* Portfolio Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img
                      src={item.coverImageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-gray-900 font-semibold line-clamp-2 mb-2">
                      {item.title}
                    </h3>

                    {/* Category Badge */}
                    <div className="mb-3">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getCategoryColor(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Project Link */}
                    <a
                      href={item.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0020BF] hover:text-[#0b2be0] flex items-center gap-1 mb-4 break-all"
                    >
                      <ExternalLink size={12} />
                      View Project
                    </a>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                        deleteConfirm === item.id
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      <Trash2 size={16} />
                      {deleteConfirm === item.id
                        ? "Confirm Delete"
                        : "Delete"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioManagePage;
