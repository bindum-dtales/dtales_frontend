import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { getAllPortfolio } from '../src/lib/portfolioApi';
import { getProxiedImageUrl } from '../src/utils/imageProxy';

// Debug: Confirm portfolio page loaded
console.log("PORTFOLIO PAGE LOADED");

// Portfolio Item Type (mapped from API)
type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  link: string;
};

const categories = ["All", "Video", "Web", "Branding"];
// Use environment variable for backend URL with fallback to Render deployment
const API_URL = `${import.meta.env.VITE_API_URL || "https://dtales-backend-gzlj.onrender.com"}/api/portfolio`;
const COLD_START_TIMEOUT = 8000; // 8 seconds
const RETRY_DELAY = 3000; // 3 seconds before retry

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerWakingUp, setIsServerWakingUp] = useState(false);
  const projectsPerPage = 10;
  const gridRef = useRef<HTMLDivElement>(null);
  const coldStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Background Image Slider State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = ['/1.png', '/2.png', '/3.png', '/4.png'];

  // Fetch portfolio items on mount with robust error handling and retry logic
  useEffect(() => {
    const fetchPortfolioWithRetry = async (retryCount = 0) => {
      const maxRetries = 1;
      try {
        // Mark fetch as started
        setLoading(true);
        setError(null);
        console.log("[PORTFOLIO] Fetch started at:", new Date().toISOString());
        console.log("[PORTFOLIO] Retry attempt:", retryCount);
        console.time("PORTFOLIO_API_FETCH");

        // Set up cold start detection timeout
        coldStartTimeoutRef.current = setTimeout(() => {
          console.warn("[PORTFOLIO] Backend taking >8s, likely cold start");
          setIsServerWakingUp(true);
        }, COLD_START_TIMEOUT);

        // Fetch data with CORS headers and robust configuration
        console.log("[PORTFOLIO] Fetching from:", API_URL);
        console.log("[PORTFOLIO] Browser:", navigator.userAgent);
        console.log("[PORTFOLIO] Origin:", window.location.origin);

        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          credentials: "omit",
        });
        
        console.timeEnd("PORTFOLIO_API_FETCH");
        console.log("[PORTFOLIO] Response received at:", new Date().toISOString());
        console.log("[PORTFOLIO] Response status:", response.status);

        // Parse JSON first to see the actual data
        const data = await response.json();
        console.log("[PORTFOLIO] Received data:", data);
        console.log("[PORTFOLIO] Data type:", Array.isArray(data) ? 'array' : typeof data);
        console.log("[PORTFOLIO] Data length:", data?.length);

        // Only throw error if response status indicates failure
        if (!response.ok) {
          console.error("[PORTFOLIO] Non-OK response but got data:", data);
          throw new Error(`Server error: ${response.status}`);
        }

        // Map API data to local format
        console.time("PORTFOLIO_DATA_MAPPING");
        
        // ✅ Handle empty array as valid response (not an error)
        if (!Array.isArray(data)) {
          console.error("[PORTFOLIO] Expected array but got:", typeof data, data);
          throw new Error("Invalid data format from server");
        }

        const mappedData: PortfolioItem[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          thumbnail: item.cover_image_url,
          link: item.link,
        }));
        console.timeEnd("PORTFOLIO_DATA_MAPPING");
        console.log("[PORTFOLIO] Mapped data count:", mappedData.length);

        // Immediately update portfolioItems and clear loading state
        // DO NOT wait for images to load
        setPortfolioItems(mappedData);
        console.log("[PORTFOLIO] Set portfolioItems to:", mappedData.length, "items");
        
        setLoading(false);
        setIsServerWakingUp(false);
        console.log("[PORTFOLIO] Loading state cleared, UI ready");
        console.log("[PORTFOLIO] Images will load asynchronously");

      } catch (err: any) {
        console.error("[PORTFOLIO] Fetch error:", {
          message: err.message,
          userAgent: navigator.userAgent,
          origin: window.location.origin,
          error: err,
        });

        // Retry logic: retry once after 3 seconds if first attempt fails
        if (retryCount < 1) {
          console.warn("[PORTFOLIO] Retrying after 3 seconds...");
          setError("Connection failed. Retrying...");
          
          // Clear cold start timeout before retry
          if (coldStartTimeoutRef.current) {
            clearTimeout(coldStartTimeoutRef.current);
          }

          // Wait 3 seconds then retry
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return fetchPortfolioWithRetry(retryCount + 1);
        }

        // After retry fails, show user-friendly error message
        const userMessage = "Unable to connect to server. Please check your internet connection.";
        console.error("[PORTFOLIO] Final error after retry:", userMessage);
        setError(userMessage);
        setLoading(false);
        setIsServerWakingUp(false);
      } finally {
        // Clear the cold start timeout if it hasn't fired
        if (coldStartTimeoutRef.current) {
          clearTimeout(coldStartTimeoutRef.current);
        }
      }
    };

    fetchPortfolioWithRetry();

    // Cleanup timeout on unmount
    return () => {
      if (coldStartTimeoutRef.current) {
        clearTimeout(coldStartTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("[PORTFOLIO] Active category changed to:", activeCategory);
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

  // Background Image Slider Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Filter logic for portfolio items
  const getFeaturedProjects = () => {
    return portfolioItems.filter(item => 
      item.category.toLowerCase() === 'featured_project'
    );
  };

  const getFilteredProjects = () => {
    if (activeCategory === 'All') {
      // Show all items in the All tab
      return portfolioItems;
    }
    
    // For specific category tabs (Video/Web/Branding),
    // only show items matching that category (exclude featured_project)
    return portfolioItems.filter(item => 
      item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  };

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
      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading portfolio...</p>
            {isServerWakingUp && (
              <p className="text-sm text-orange-500 mt-4 animate-pulse">
                ⏳ Waking up server... This may take a moment
              </p>
            )}
          </div>
        </div>
      ) : error ? (
        /* Error State */
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <p className="text-xl text-red-600 mb-4">Failed to load portfolio</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : portfolioItems.length === 0 ? (
        /* Empty State */
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md">
            <p className="text-xl text-gray-600">No portfolio items available yet.</p>
          </div>
        </div>
      ) : (
        <>
      {/* Hero Section with Background Image Slider */}
      <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden">
        {/* Background Images */}
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-all duration-1000 ease-in-out"
            style={{
              opacity: currentImageIndex === index ? 1 : 0,
              transform: currentImageIndex === index ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              onLoad={() => {
                if (index === 0) {
                  console.log("[PORTFOLIO] Hero background image loaded");
                }
              }}
            />
          </div>
        ))}

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            Portfolio
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-3xl font-semibold text-white/90 mb-6"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Selected Works by DTALES Tech
          </motion.h2>

          <motion.p
            className="text-lg text-white/80 leading-relaxed"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            We craft digital stories, brands, videos and web experiences.
          </motion.p>
        </div>
      </div>

      {/* Featured Projects Section - Only show featured_project items */}
      {getFeaturedProjects().length > 0 && (
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
            {getFeaturedProjects().map((item, index) => (
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
                    if (item.link) {
                      window.open(item.link, '_blank');
                    }
                  }}
                  className="group cursor-pointer"
                >
                  <div className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <img
                      key={`featured-${item.id}`}
                      src={getProxiedImageUrl(item.thumbnail) || item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onLoad={() => {
                        console.log("[PORTFOLIO] Featured project image loaded:", item.title);
                      }}
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
      )}

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
              const filteredItems = getFilteredProjects();
              
              const indexOfLastProject = currentPage * projectsPerPage;
              const indexOfFirstProject = indexOfLastProject - projectsPerPage;
              const currentProjects = filteredItems.slice(
                indexOfFirstProject,
                indexOfLastProject
              );

              return currentProjects.map((item, index) => (
                <motion.div
                  key={`portfolio-${item.id}`}
                  layout
                  initial={false}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.03
                  }}
                    onClick={() => {
                      if (item.link) {
                        window.open(item.link, '_blank');
                      }
                    }}
                    className="group cursor-pointer relative rounded-xl bg-white shadow-md transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_120px_rgba(37,99,235,0.95)]"
                  >
                  {/* Image Container */}
                  <div className="relative h-[420px] w-full overflow-hidden rounded-t-xl">
                    <img
                      key={`img-${item.id}`}
                      src={getProxiedImageUrl(item.thumbnail) || item.thumbnail}
                      alt={item.title}
                      loading="lazy"
                      width={800}
                      height={420}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onLoad={() => {
                        console.log("[PORTFOLIO] Portfolio item image loaded:", item.title);
                      }}
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
            const filteredItems = getFilteredProjects();
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
      </>
      )}
    </motion.div>
  );
}
