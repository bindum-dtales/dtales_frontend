import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Pause, Play } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HERO_SLIDES } from '../constants';

// TODO: Replace HERO_SLIDES with API call when backend endpoint is ready
// const slides = await apiFetch<HeroSlide[]>("/api/hero-slides");

const HeroSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); 

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 8000);
  };

  const scrollToSection = (sectionId: string) => {
    const isHome = location.pathname === "/";
    
    if (!isHome) {
      navigate("/");
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCTAClick = () => {
    switch (currentIndex) {
      case 0:
        scrollToSection("about");
        break;
      case 1:
        navigate('/services');
        break;
      case 2:
        navigate('/blogs');
        break;
      case 3:
        scrollToSection("contact");
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0">
             <motion.img
              src={HERO_SLIDES[currentIndex].image} 
              alt={HERO_SLIDES[currentIndex].title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>

          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="overflow-hidden"
            >
               <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl">
                {HERO_SLIDES[currentIndex].title}
              </h1>
            </motion.div>
            
            <motion.p
              className="text-2xl md:text-4xl font-semibold text-white leading-relaxed mt-4 mb-12 max-w-4xl mx-auto text-center drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {HERO_SLIDES[currentIndex].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <button 
                onClick={handleCTAClick}
                className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                {HERO_SLIDES[currentIndex].cta}
                <span className="bg-black text-white rounded-full p-1 group-hover:translate-x-1 transition-transform duration-300">
                    <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 z-20 bg-black/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-white/80 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <div className="flex gap-3">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className="group relative h-1.5 py-2 cursor-pointer"
            >
                <div className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'w-12 bg-white' : 'w-2 bg-white/30 group-hover:bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;