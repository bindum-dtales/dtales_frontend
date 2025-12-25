import React from 'react';
// Fix: Import 'Variants' as a type to resolve the 'no exported member' error.
import { motion, type Variants } from 'framer-motion';
import HeroSlider from '../components/HeroSlider';
import Testimonials from '../components/Testimonials';
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
                About DTALES Tech
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                DTALES Tech is your expert partner in Technical Storytelling and Market Enablement, committed to transforming complex innovation into market success by providing an end-to-end ecosystem of services. We go beyond traditional documentation, offering sophisticated strategy consulting, content process management, and toolchain optimization to build resilient knowledge base systems. You can then enhance your market reach with specialized technical marketing content supported by professional creatives that articulate your value to technical buyers. Our agile approach ensures the consistent delivery of relevant, reliable product documentation and compelling market narratives, guaranteeing enhanced product understanding and experience with zero-overhead for your product and engineering teams.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer Section (1 Row Layout) */}
      <section className="py-12 px-6" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 max-w-3xl">
             <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-6">
                What We Offer
             </h2>
             <p className="text-xl text-gray-500">
                Comprehensive solutions for your documentation ecosystem.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Card - Consultation */}
             <motion.div
                className="bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-shadow duration-300 group flex flex-col justify-between min-h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
             >
                <div>
                    <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8">
                        <Lightbulb size={28} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Consultation</h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                       We work with product teams to learn the product, understand the customer, and analyze existing systems to strategize and ideate ideal knowledge systems.
                    </p>
                </div>
                <div className="flex justify-end mt-8">
                    <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
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
             >
                 <div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                        <Database size={28} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Technology</h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                       We recommend, develop, and maintain tools and toolchain management systems to create, and publish technical content.
                    </p>
                 </div>
                 <div className="flex justify-end mt-8">
                    <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
             >
                 <div>
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
                        <FileText size={28} />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Content</h3>
                    <p className="text-lg text-gray-500 leading-relaxed">
                       We create highly diverse range of technically accurate content catering to the product and customer requirement.
                    </p>
                 </div>
                 <div className="flex justify-end mt-8">
                    <span className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <ArrowUpRight />
                    </span>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Why DTALES Tech Section - Styled as Cards with Animated Icons */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center max-w-3xl mx-auto">
                <motion.h2
                    className="text-4xl md:text-5xl font-bold tracking-tight text-dtales-navy mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    Why DTALES Tech?
                </motion.h2>
                <motion.p
                    className="text-xl text-gray-500"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    Reshaping the future of technical documentation.
                </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expertise */}
                <motion.div
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <motion.div
                        className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6"
                        variants={iconVariants}
                        whileHover="hover"
                    >
                        <Award size={28} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black mb-4">Expertise</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        DTALES Tech boasts a team of seasoned experts in technical documentation, UX writing, and customer enablement. We alleviate the burden on product and development teams by taking complete ownership of all product documentation tasks, from conception to execution.
                    </p>
                </motion.div>

                {/* Customization */}
                <motion.div
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6"
                        variants={iconVariants}
                        whileHover="hover"
                    >
                        <Sliders size={28} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black mb-4">Customization</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        We offer customized technical documentation solutions that go beyond the norm. Our tailored approach aligns content, style, and format with your product, audience, and brand. By crafting engaging user manuals and seamlessly integrating with your systems, we drive user engagement.
                    </p>
                </motion.div>

                {/* Consolidation */}
                <motion.div
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                     <motion.div
                        className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"
                        variants={iconVariants}
                        whileHover="hover"
                    >
                        <Layers size={28} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black mb-4">Consolidation</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                       We provide a comprehensive and convenient single-point solution for all your product documentation needs, streamlining your workflow and maximizing efficiency. Beyond initial deliverables, we offer ongoing support to ensure your documentation remains up-to-date.
                    </p>
                </motion.div>

                {/* Agility */}
                <motion.div
                    className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.div
                        className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6"
                        variants={iconVariants}
                        whileHover="hover"
                    >
                        <Zap size={28} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black mb-4">Agility</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        We understand that technology and products need to adapt and respond quickly to changing market dynamics. We use iterative processes and close collaboration to ensure continuous improvement and optimal results.
                    </p>
                </motion.div>
            </div>
         </div>
      </section>

      <Testimonials />

      {/* Big CTA */}
      <section className="py-32 bg-[#F5F5F7] text-center px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             whileInView={{ scale: 1, opacity: 1 }}
             viewport={{ once: true }}
          >
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">Ready to tell your story?</h2>
              <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto">
                Join the forward-thinking companies building with DTales.
              </p>
              <button className="bg-dtales-navy text-white px-12 py-5 rounded-full text-xl font-semibold hover:bg-black transition-all hover:scale-105 shadow-xl">
                Start a Project
              </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;