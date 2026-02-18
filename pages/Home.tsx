import React from 'react';
// Fix: Import 'Variants' as a type to resolve the 'no exported member' error.
import { motion, type Variants } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import Testimonials from '../components/Testimonials';
import { useNavigate } from 'react-router-dom';
import { TextColor } from '../components/ui/text-color';
import { 
  ArrowUpRight, 
  Lightbulb, 
  FileText, 
  Database, 
  Award, 
  Sliders, 
  Layers, 
  Zap 
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  // Helper for icon animation
  const iconVariants: Variants = {
    hover: { scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 10 } }
  };

  return (
    <main className="bg-[#F5F5F7]"> {/* Apple-like light gray background */}
      <HeroSlider />
      
      {/* About DTALES Tech Section - Styled as Card */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="bg-white rounded-[2.5rem] p-12 md:p-20 shadow-sm"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-3xl md:text-5xl font-bold mb-8 tracking-tight text-dtales-navy"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <TextColor text="About DTALES Tech" />
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                DTALES Tech is your expert partner in Technical Storytelling and Market Enablement, committed to transforming complex innovation into market success by providing an end-to-end ecosystem of services. We go beyond traditional documentation, offering sophisticated strategy consulting, content process management, and toolchain optimization to build resilient knowledge base systems.
              </motion.p>
              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                You can then enhance your market reach with specialized technical marketing content supported by professional creatives that articulate your value to technical buyers. Our agile approach ensures the consistent delivery of relevant, reliable product documentation and compelling market narratives, guaranteeing enhanced product understanding and experience with zero overhead for your product and engineering teams.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section (1 Row Layout) */}
      <section className="py-12 px-6" id="services">
         <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl mx-auto text-center">
           <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
             <TextColor text="What We Offer" />
           </h2>
           <p className="text-xl text-gray-500">
             Driving Market Impact with Information
           </p>
         </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
           {/* Card - Consultation */}
           <motion.div
             className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between min-h-[400px]"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             onClick={() => navigate('/services')}
           >
             <div>
                <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8">
                  <Lightbulb size={28} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Strategy</h3>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Define the architecture, process, and governance model for all technical communications, ensuring every piece of content is aligned to business goals.
                </p>
             </div>
             <div className="flex justify-end mt-8">
                <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors" onClick={() => navigate('/services')}>
                  <ArrowUpRight />
                </span>
             </div>
           </motion.div>

           {/* Card - Technology */}
           <motion.div
             className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between min-h-[400px]"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             onClick={() => navigate('/services')}
           >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-8">
                  <img src="/icon1.png" alt="Content icon" className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Content</h3>
                <p className="text-lg text-gray-500 leading-relaxed">
                  We transform complex product information into crystal-clear, user-centric knowledge bases, APIs, and manuals that maximize product adoption and reduce support tickets.
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors" onClick={() => navigate('/services')}>
                  <ArrowUpRight />
                </span>
             </div>
           </motion.div>

           {/* Card - Content */}
           <motion.div
             className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between min-h-[400px]"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             onClick={() => navigate('/services')}
           >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-8">
                  <img src="/icon2.png" alt="Creatives icon" className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Creatives</h3>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Design impactful infographics, explainer videos, and visual storytelling elements that simplify complex technical concepts and capture the attention of technical decision-makers.
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors" onClick={() => navigate('/services')}>
                  <ArrowUpRight />
                </span>
             </div>
           </motion.div>

           {/* Card - Technology (new 4th card) */}
           <motion.div
             className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between min-h-[400px]"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             onClick={() => navigate('/services')}
           >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-8">
                  <img src="/icon3.png" alt="Technology icon" className="w-7 h-7 object-contain" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Technology</h3>
                <p className="text-lg text-gray-500 leading-relaxed">
                  Implement, integrate, and manage next-generation Component Content Management Systems (CCMS) and AI-enabled documentation tools for maximum operational efficiency and future-proofing.
                </p>
              </div>
              <div className="flex justify-end mt-8">
                <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors" onClick={() => navigate('/services')}>
                  <ArrowUpRight />
                </span>
              </div>
           </motion.div>
         </div>
        </div>
      </section>

      <Testimonials />

      {/* Trusted by Tomorrow's Tech Leaders Section with Horizontal Slider */}
      <section className="py-24 px-6 bg-[#0b0f1a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <motion.h2
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <TextColor text="Trusted by Tomorrow's Tech Leaders" />
            </motion.h2>
            <motion.p
              className="text-xl text-[#cfd3ff]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Building the Future of Knowledge, Together
            </motion.p>
          </div>

          {/* Horizontal Scrolling Section */}
          <div className="relative w-full overflow-hidden">
            <div className="flex animate-scroll-horizontal" style={{ width: '200%' }}>
              {/* Original 8 items - duplicated for seamless loop */}
              {[
                { icon: 'Shield', title: 'AI Security Applications', desc: 'Simplifying complex threat protection through authoritative, trust-building narratives.' },
                { icon: 'Network', title: 'AI Network Monitoring Tools', desc: 'Showcasing operational ROI through data-driven content and demos.' },
                { icon: 'Code', title: 'Information Technology and Services (ITES)', desc: 'Highlighting digital transformation through strategic thought-leadership and blogs.' },
                { icon: 'Globe', title: 'Network Consultancy and Systems Integration', desc: 'Positioning firms as the bridge to future-ready connectivity through strategic content.' },
                { icon: 'Factory', title: 'Product Manufacturing', desc: 'Transforming technical engineering into high-impact, market-ready visual stories.' },
                { icon: 'Box', title: 'OEM Resellers', desc: 'Differentiating resale services with agile, co-branded creative assets.' },
                { icon: 'BarChart3', title: 'Market Research and Data Analytics', desc: 'Turning dense data into digestible, high-value executive insights.' },
                { icon: 'Plane', title: 'Aviation', desc: 'Crafting premium narratives for high-stakes aerospace and logistics stakeholders.' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex-shrink-0 w-96 px-8 py-10 mx-4 bg-white/10 backdrop-blur-[14px] rounded-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/[0.15] hover:-translate-y-1 transition-all duration-300"
                  style={{ 
                    WebkitBackdropFilter: 'blur(14px)',
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white text-sm font-semibold backdrop-blur-sm">●</span>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-[#cfd3ff] text-sm leading-relaxed pl-9">{item.desc}</p>
                </motion.div>
              ))}
              
              {/* Duplicated items for seamless loop */}
              {[
                { icon: 'Shield', title: 'AI Security Applications', desc: 'Simplifying complex threat protection through authoritative, trust-building narratives.' },
                { icon: 'Network', title: 'AI Network Monitoring Tools', desc: 'Showcasing operational ROI through data-driven content and demos.' },
                { icon: 'Code', title: 'Information Technology and Services (ITES)', desc: 'Highlighting digital transformation through strategic thought-leadership and blogs.' },
                { icon: 'Globe', title: 'Network Consultancy and Systems Integration', desc: 'Positioning firms as the bridge to future-ready connectivity through strategic content.' },
                { icon: 'Factory', title: 'Product Manufacturing', desc: 'Transforming technical engineering into high-impact, market-ready visual stories.' },
                { icon: 'Box', title: 'OEM Resellers', desc: 'Differentiating resale services with agile, co-branded creative assets.' },
                { icon: 'BarChart3', title: 'Market Research and Data Analytics', desc: 'Turning dense data into digestible, high-value executive insights.' },
                { icon: 'Plane', title: 'Aviation', desc: 'Crafting premium narratives for high-stakes aerospace and logistics stakeholders.' },
              ].map((item, idx) => (
                <motion.div
                  key={`dup-${idx}`}
                  className="flex-shrink-0 w-96 px-8 py-10 mx-4 bg-white/10 backdrop-blur-[14px] rounded-2xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/[0.15] hover:-translate-y-1 transition-all duration-300"
                  style={{ 
                    WebkitBackdropFilter: 'blur(14px)',
                  }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-white/20 flex items-center justify-center text-white text-sm font-semibold backdrop-blur-sm">●</span>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-[#cfd3ff] text-sm leading-relaxed pl-9">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="py-32 bg-[#F5F5F7] text-center px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
          >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
                <span className="bg-gradient-to-r from-[#0024ff] to-[#001cc3] bg-[length:200%_200%] animate-gradient-shift bg-clip-text text-transparent">
                  Ready to tell your story?
                </span>
              </h2>
              <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
                Where Innovation Meets Articulation. Let's Build Together.
              </p>
              <button
                className="bg-dtales-navy text-white px-12 py-5 rounded-full text-xl font-semibold transition-all hover:scale-105 shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001cc3]"
                onClick={() => navigate('/contact')}
                aria-label="Start a Project"
              >
                Start a Project
              </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;