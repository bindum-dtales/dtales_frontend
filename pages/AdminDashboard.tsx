import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, LogOut, FileText, Layers, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../src/lib/api";

type Blog = {
  id: string;
  published: boolean;
};

type CaseStudy = {
  id: string;
  published: boolean;
};

type Portfolio = {
  id: string;
  published: boolean;
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [caseLoading, setCaseLoading] = useState(true);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [caseError, setCaseError] = useState<string | null>(null);
  const [portfolioError, setPortfolioError] = useState<string | null>(null);

  useEffect(() => {
    setBlogLoading(true);
    apiFetch<Blog[]>("/api/blogs")
      .then(setBlogs)
      .catch((err) => setBlogError(err.message || "Failed to load blogs"))
      .finally(() => setBlogLoading(false));
  }, []);

  useEffect(() => {
    setCaseLoading(true);
    apiFetch<CaseStudy[]>("/api/case-studies")
      .then(setCases)
      .catch((err) => setCaseError(err.message || "Failed to load case studies"))
      .finally(() => setCaseLoading(false));
  }, []);

  useEffect(() => {
    setPortfolioLoading(true);
    apiFetch<Portfolio[]>("/api/portfolio")
      .then(setPortfolio)
      .catch((err) => setPortfolioError(err.message || "Failed to load portfolio"))
      .finally(() => setPortfolioLoading(false));
  }, []);

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.published).length;
  const draftBlogs = totalBlogs - publishedBlogs;

  const totalCases = cases.length;
  const publishedCases = cases.filter((c) => c.published).length;
  const draftCases = totalCases - publishedCases;

  const totalPortfolio = portfolio.length;
  const publishedPortfolio = portfolio.filter((p) => p.published).length;
  const draftPortfolio = totalPortfolio - publishedPortfolio;

  const totalContent = totalBlogs + totalCases;
  const isLoading = blogLoading || caseLoading || portfolioLoading;

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
              <Shield className="text-[#0020BF]" size={22} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">DTALES Admin Dashboard</h1>
              <p className="text-gray-600 text-sm">Welcome, Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#0020BF] hover:bg-[#0b2be0] text-white px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </motion.div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Blog Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <FileText className="text-[#0020BF]" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Blog Management</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/blogs/new')}
                className="p-2 rounded-lg bg-[#0020BF] hover:bg-[#0b2be0] text-white transition-all shadow-sm"
              >
                <Plus className="text-white" size={18} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Create, edit, and manage blog posts
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Total Posts: {blogLoading ? "Loading..." : totalBlogs}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Published: {blogLoading ? "Loading..." : publishedBlogs}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Drafts: {blogLoading ? "Loading..." : draftBlogs}</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/admin/blogs/manage')}
              className="mt-5 w-full py-2.5 bg-[#0020BF] hover:bg-[#0b2be0] text-white rounded-lg transition-all text-sm font-semibold shadow-sm"
            >
              Manage Blogs
            </button>
          </motion.div>

          {/* Case Studies Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Layers className="text-[#0020BF]" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Case Studies Management</h2>
              </div>
              <button
                onClick={() => navigate('/admin/case-studies/new')}
                className="p-2 rounded-lg bg-[#0020BF] hover:bg-[#0b2be0] text-white transition-all shadow-sm"
              >
                <Plus className="text-white" size={18} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Create, edit, and manage case studies
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Total Case Studies: {caseLoading ? "Loading..." : totalCases}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Published: {caseLoading ? "Loading..." : publishedCases}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Drafts: {caseLoading ? "Loading..." : draftCases}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/case-studies/manage')}
              className="mt-5 w-full py-2.5 bg-[#0020BF] hover:bg-[#0b2be0] text-white rounded-lg transition-all text-sm font-semibold shadow-sm"
            >
              Manage Case Studies
            </button>
          </motion.div>

          {/* Portfolio Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Layers className="text-[#0020BF]" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Portfolio Management</h2>
              </div>
              <button
                onClick={() => navigate('/admin/portfolio/create')}
                className="p-2 rounded-lg bg-[#0020BF] hover:bg-[#0b2be0] text-white transition-all shadow-sm"
              >
                <Plus className="text-white" size={18} />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Create, edit, and manage portfolio projects
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Total Portfolio: {portfolioLoading ? "Loading..." : totalPortfolio}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Published: {portfolioLoading ? "Loading..." : publishedPortfolio}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-900 text-sm">Drafts: {portfolioLoading ? "Loading..." : draftPortfolio}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/portfolio/manage')}
              className="mt-5 w-full py-2.5 bg-[#0020BF] hover:bg-[#0b2be0] text-white rounded-lg transition-all text-sm font-semibold shadow-sm"
            >
              Manage Portfolio
            </button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-3xl bg-white border border-gray-200 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 tracking-tight">Quick Stats</h2>
          {(blogError || caseError || portfolioError) && (
            <p className="text-sm text-red-600 mb-4">
              {blogError || caseError || portfolioError}
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{isLoading ? "Loading..." : totalContent}</p>
              <p className="text-gray-600 text-sm">Total Content</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{blogLoading ? "Loading..." : totalBlogs}</p>
              <p className="text-gray-600 text-sm">Blog Posts</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{caseLoading ? "Loading..." : totalCases}</p>
              <p className="text-gray-600 text-sm">Case Studies</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              <p className="text-2xl font-bold text-gray-900">{blogLoading || caseLoading ? "Loading..." : draftBlogs + draftCases}</p>
              <p className="text-gray-600 text-sm">Drafts</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
