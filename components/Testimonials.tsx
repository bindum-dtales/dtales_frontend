import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { TextColor } from './ui/text-color';

type Testimonial = {
  id: number;
  quote: string;
  client: string;
  company: string;
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call when backend endpoint is ready
    // apiFetch<Testimonial[]>("/api/testimonials").then(setTestimonials).finally(() => setLoading(false));
    
    // Temporary fallback
    const fallbackData: Testimonial[] = [
      { id: 7, quote: "DTALES team is exceptionally methodical in execution. We've worked with a few teams previously for our social media account, but these guys are definitely a class apart. They set the right expectations and follow through with clear, transparent communication to make sure the work gets done. Just hand it over, forget about it. It will be delivered one step above what you expect!", client: "Abilash Kokkath", company: "Trail Tribe, Dubai" },
      { id: 8, quote: "DTALES has consistently demonstrated exceptional professionalism, a highly responsive team, and reliable service delivery. Their attention to detail and commitment to quality truly set them apart. I would confidently recommend DTALES to anyone looking for a dependable and customer-focused partner.", client: "Kiran Patil", company: "Manager (Technical Marketing), Airowire" },
      
    ];
    setTestimonials(fallbackData);
    setLoading(false);
  }, []);

  // Auto-rotate testimonials every 8 seconds with smooth fade transitions
  useEffect(() => {
    if (testimonials.length === 0) return;
    
    const totalSets = Math.ceil(testimonials.length / 4);
    const interval = setInterval(() => {
      // Fade out current testimonials
      setIsVisible(false);
      
      // After fade-out completes, change index and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSets);
        setIsVisible(true);
      }, 600); // Wait for fade-out to complete
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials]);

  if (loading) {
    return (
      <section className="py-32 bg-[#F5F5F7] text-gray-800 overflow-hidden relative">
        <div className="text-center text-gray-500">Loading testimonials...</div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-[#F5F5F7] text-gray-800 overflow-hidden relative">

      <div className="relative z-10">
        <div className="mb-20 text-center max-w-4xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-6xl font-bold tracking-tight text-dtales-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <TextColor text="Why DTALES Tech" />
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            See how teams across industries describe their journey working with DTALES.
          </motion.p>
        </div>

        {/* 2x2 Grid Layout with Auto-rotation */}
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {testimonials.slice(currentIndex * 4, currentIndex * 4 + 4).map((t) => (
              <div
                key={t.id}
                className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <Quote className="text-dtales-navy mb-6 w-10 h-10 opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                
                <p className="text-lg leading-relaxed mb-8 text-gray-600 group-hover:text-gray-800 transition-colors flex-grow">
                  "{t.quote}"
                </p>
                
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold shadow-lg flex-shrink-0 text-white">
                    {t.client.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-base leading-tight text-black truncate">{t.client}</h4>
                    <p className="text-dtales-navy text-sm font-medium truncate">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;