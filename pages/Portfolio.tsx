import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// Debug: Confirm portfolio page loaded
console.log("PORTFOLIO PAGE LOADED");

// Portfolio Item Type
type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  youtubeLink?: string;
  externalLink?: string;
  featured?: boolean;
};

// Mock Portfolio Data
const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    title: "Brand Identity Design",
    category: "Branding",
    thumbnail: "https://via.placeholder.com/600x400?text=Brand+Identity",
    externalLink: "https://example.com",
    featured: true,
  },
  {
    id: 2,
    title: "E-Commerce Platform Redesign",
    category: "Web",
    thumbnail: "https://via.placeholder.com/600x400?text=E-Commerce",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    title: "Product Launch Campaign",
    category: "Video",
    thumbnail: "https://via.placeholder.com/600x400?text=Product+Launch",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    featured: true,
  },
  {
    id: 4,
    title: "SaaS Dashboard Development",
    category: "Web",
    thumbnail: "https://via.placeholder.com/600x400?text=SaaS+Dashboard",
    externalLink: "https://example.com/saas",
  },
  {
    id: 5,
    title: "Corporate Video Production",
    category: "Video",
    thumbnail: "https://via.placeholder.com/600x400?text=Corporate+Video",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 7,
    title: "Brand Refresh Project",
    category: "Branding",
    thumbnail: "https://via.placeholder.com/600x400?text=Brand+Refresh",
    youtubeLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

const categories = ["All", "Video", "Web", "Branding"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const projectsPerPage = 10;
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  useEffect(() => {
    setIsPageTransitioning(true);
    gridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
    const timeout = setTimeout(() => {
      setIsPageTransitioning(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentPage]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      className="bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-3xl text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Portfolio
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Selected Works by DTales
          </motion.h2>

          <motion.p
            className="text-lg text-gray-600 leading-relaxed"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            We craft digital stories, brands, videos and web experiences.
          </motion.p>
        </div>
      </div>

      {/* Featured Projects Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
              Featured Projects
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems
              .filter((item) => item.featured)
              .map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                    delay: index * 0.1,
                  }}
                  viewport={{ once: true, margin: '-100px' }}
                  onClick={() => {
                    if (item.youtubeLink) {
                      window.open(item.youtubeLink, '_blank');
                    } else if (item.externalLink) {
                      window.open(item.externalLink, '_blank');
                    }
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300" />

                    {/* Title at Bottom-Left */}
                    <div className="absolute bottom-0 left-0 p-6 text-white">
                      <p className="text-sm font-semibold text-white/80 mb-2">
                        {item.category}
                      </p>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 flex justify-center gap-6 mb-16">
        {categories.map((category) => (
          <div key={category} className="relative">
            <motion.button
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="px-6 py-2 rounded-full text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-black"
            >
              {category}
            </motion.button>

            {category === activeCategory && (
              <motion.div
                layoutId="activeFilterUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Portfolio Grid Section */}
      <section className="bg-white pt-20 pb-8 px-4">
        <div className="max-w-[1600px] mx-auto px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
              All Projects
            </h2>
          </motion.div>

          <div ref={gridRef} className="relative">
            <motion.div
              layout
              animate={{
                opacity: isTransitioning ? 0.85 : isPageTransitioning ? 0.4 : 1
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-16"
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
            {(() => {
              const nonFeaturedItems = portfolioItems.filter((item) => !item.featured);
              const filteredItems =
                activeCategory === "All"
                  ? nonFeaturedItems
                  : nonFeaturedItems.filter((item) => item.category === activeCategory);
              
              const indexOfLastProject = currentPage * projectsPerPage;
              const indexOfFirstProject = indexOfLastProject - projectsPerPage;
              const currentProjects = filteredItems.slice(
                indexOfFirstProject,
                indexOfLastProject
              );

              return currentProjects.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={false}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.03
                  }}
                    onClick={() => {
                      if (item.youtubeLink) {
                        window.open(item.youtubeLink, '_blank');
                      } else if (item.externalLink) {
                        window.open(item.externalLink, '_blank');
                      }
                    }}
                    className="group cursor-pointer relative rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_120px_rgba(37,99,235,0.95)]"
                  >
                  {/* Image Container */}
                  <div className="relative h-[420px] w-full overflow-hidden rounded-t-xl">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Hover Overlay with Content */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex flex-col justify-end p-6">
                      <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-sm text-white/80 mb-2">{item.category}</p>
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {item.title}
                        </h3>
                        <span className="text-white font-semibold text-base">
                          View Project →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </motion.div>

          {/* Pagination Controls */}
          {(() => {
            const nonFeaturedItems = portfolioItems.filter((item) => !item.featured);
            const filteredItems =
              activeCategory === "All"
                ? nonFeaturedItems
                : nonFeaturedItems.filter((item) => item.category === activeCategory);
            const totalPages = Math.ceil(filteredItems.length / projectsPerPage);

            return (
              <div className="flex justify-center items-center gap-4 mt-16">
                <motion.button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1}
                  className="px-6 py-2 rounded-full bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Previous
                </motion.button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-full transition-colors duration-300 ${
                      currentPage === page
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {page}
                  </motion.button>
                ))}

                <motion.button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 rounded-full bg-black text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Next
                </motion.button>
              </div>
            );
          })()}

            {/* Blur Overlay */}
            <motion.div
              className="absolute inset-0 bg-white/30 backdrop-blur-sm pointer-events-none"
              animate={{ opacity: isTransitioning ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
