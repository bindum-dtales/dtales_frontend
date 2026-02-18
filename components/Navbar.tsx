import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";


const Navbar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <motion.nav
      style={{
        backgroundColor: 'rgba(40, 40, 40, 0.55)',
        backdropFilter: 'blur(28px) saturate(160%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}
      className="fixed top-0 left-0 w-full z-50 relative"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="z-50 relative group flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <motion.img
              src="/dtales-logo.png"
              alt="DTALES Tech Logo"
              className="h-12 w-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-sm font-medium text-white hover:opacity-70 transition"
          >
            Home
          </Link>

          {/* Dropdown — Services */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-white hover:opacity-70 transition">
              Services
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  activeDropdown === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-1">
                    <Link
                      to="/services"
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg"
                    >
                      Services
                    </Link>
                    <Link
                      to="/portfolio"
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg"
                    >
                      Portfolio
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/team"
            className="text-sm font-medium text-white hover:opacity-70 transition"
          >
            Our Team
          </Link>

          {/* Dropdown — Articles */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("articles")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-white hover:opacity-70 transition">
              Articles
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  activeDropdown === "articles" ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {activeDropdown === "articles" && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/90 backdrop-blur-2xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="p-1">
                    <Link
                      to="/blogs"
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg"
                    >
                      Blogs
                    </Link>
                    <Link
                      to="/case-studies"
                      className="block px-4 py-3 text-sm text-white hover:bg-white/10 rounded-lg"
                    >
                      Case Studies
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => navigate('/contact')}
            className="bg-[#0020BF] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-[#0A2CFF] hover:scale-105 transition-all shadow-lg"
          >
            Get Started
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden z-50 p-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="absolute left-0 top-full w-full bg-[#0b0f1a] border-t border-white/10 shadow-2xl md:hidden z-40"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 py-4 flex flex-col divide-y divide-white/10">
              <Link
                to="/"
                className="py-3 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </Link>
              <div className="py-3">
                <span className="block text-base font-semibold text-white/80 mb-2">Services</span>
                <div className="flex flex-col gap-2 pl-2">
                  <Link
                    to="/services"
                    className="text-sm text-white transition-colors duration-200 hover:text-white/80"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Services
                  </Link>
                  <Link
                    to="/portfolio"
                    className="text-sm text-white transition-colors duration-200 hover:text-white/80"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Portfolio
                  </Link>
                </div>
              </div>
              <Link
                to="/team"
                className="py-3 text-base font-medium text-white transition-colors duration-200 hover:text-white/80"
                onClick={() => setIsMobileOpen(false)}
              >
                Our Team
              </Link>
              <div className="py-3">
                <span className="block text-base font-semibold text-white/80 mb-2">Articles</span>
                <div className="flex flex-col gap-2 pl-2">
                  <Link
                    to="/blogs"
                    className="text-sm text-white transition-colors duration-200 hover:text-white/80"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Blogs
                  </Link>
                  <Link
                    to="/case-studies"
                    className="text-sm text-white transition-colors duration-200 hover:text-white/80"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    Case Studies
                  </Link>
                </div>
              </div>
              <div className="py-3">
                <button
                  onClick={() => {
                    navigate('/contact');
                    setIsMobileOpen(false);
                  }}
                  className="w-full bg-[#0020BF] text-white px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-[#0A2CFF] transition-all duration-200 shadow-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;