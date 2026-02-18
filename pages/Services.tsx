
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Globe, 
  Layout, 
  Settings, 
  Cpu, 
  Video, 
  BarChart, 
  Users 
} from 'lucide-react';

const Services: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Header with Background Image */}
      <section className="relative py-40 text-center px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full z-0">
             <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                alt="Services Background"
                className="w-full h-full object-cover opacity-50"
             />
             {/* Gradient overlay to blend with the content below */}
             <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6 px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-blue-100 text-blue-600 font-semibold tracking-wide text-sm shadow-sm"
            >
                Expertise & Education
            </motion.div>
            <motion.h1
                className="text-5xl md:text-7xl font-bold text-black mb-8 tracking-tighter"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                Our Services
            </motion.h1>
            {/* Rewritten motion.p for clarity and to eliminate potential hidden issues */}
            <motion.p
                className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                From comprehensive documentation strategies to future-ready training, we empower your product ecosystem
            </motion.p>
        </div>
      </section>

      {/* Technical Documentation Section */}
      <section className="py-24 px-6 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Content */}
                <motion.div
                    className="lg:col-span-5 relative lg:sticky lg:top-32"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-14 h-14 bg-black text-white rounded-2xl flex items-center justify-center mb-8">
                        <FileText size={28} />
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-dtales-navy tracking-tight">Technical Documentation</h2>
                    <div className="w-20 h-1 bg-blue-500 mb-8"></div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        We transform complex product information into user-friendly and valuable content, now supercharged by the strategic integration of Intelligent Automation. 
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                         Our cutting-edge approach ensures your customers can effortlessly learn about and effectively use your products, significantly enhancing their overall experience through adaptive documentation.
                    </p>
                </motion.div>

                {/* Right Grid */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ServiceCard 
                        icon={<BarChart />}
                        title="Pre-Sales & Marketing"
                        description="Technical Pre-Sales and Marketing Collateral that bridges the gap between tech and business value."
                        delay={0.1}
                    />
                    <ServiceCard 
                        icon={<BookOpen />}
                        title="User Manuals & API"
                        description="Comprehensive User Manuals and detailed API Documentation for developers and end-users."
                        delay={0.2}
                    />
                    <ServiceCard 
                        icon={<Globe />}
                        title="Online Help Systems"
                        description="Interactive, searchable, and accessible online help systems for instant user support."
                        delay={0.3}
                    />
                    <ServiceCard 
                        icon={<Layout />}
                        title="Information Portals"
                        description="Centralized knowledge hubs organizing your product's entire information architecture."
                        delay={0.4}
                    />
                    <ServiceCard 
                        icon={<Settings />}
                        title="Custom Solutions"
                        description="Tailored documentation solutions designed specifically for your unique product requirements."
                        delay={0.5}
                    />
                    <ServiceCard 
                        iconImg="/icon4.png"
                        iconAlt="Social Media Management icon"
                        title="Social Media Management"
                        description="Creating and curating technical, platform-optimized content for LinkedIn and Instagram."
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
      </section>

      {/* Technical Writing Training Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:flex-row-reverse">
                {/* Right Content (Text) - Swapped for visual interest */}
                <motion.div
                    className="lg:col-span-5 lg:order-2 relative lg:sticky lg:top-32"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8">
                        <Users size={28} />
                    </div>
                    <h2 className="text-4xl font-bold mb-6 text-dtales-navy tracking-tight">Technical Writing Training</h2>
                    <div className="w-20 h-1 bg-black mb-8"></div>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        Our technical writing training programs are designed to equip aspiring technical writers with the essential skills for the evolving landscape of technical documentation. 
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        By understanding these emerging trends, our trainees will be prepared to produce highly engaging, accessible, and user-centric documentation that leverages cutting-edge technologies.
                    </p>
                </motion.div>

                {/* Left Grid (Cards) */}
                <div className="lg:col-span-7 lg:order-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ServiceCard 
                        icon={<Cpu />}
                        title="AI-Powered Content"
                        description="Proficiency in leveraging Artificial Intelligence for efficient and scalable content creation."
                        delay={0.1}
                        bg="bg-blue-50"
                        iconColor="text-blue-600"
                    />
                    <ServiceCard 
                        icon={<Video />}
                        title="Interactive Multimedia"
                        description="Developing engaging content including video, interactive graphics, and dynamic tutorials."
                        delay={0.2}
                        bg="bg-purple-50"
                        iconColor="text-purple-600"
                    />
                    <ServiceCard 
                        icon={<BarChart />}
                        title="Data-Driven Personalization"
                        description="Using user data to create personalized documentation experiences that adapt to user needs."
                        delay={0.3}
                        bg="bg-green-50"
                        iconColor="text-green-600"
                    />
                    <ServiceCard 
                        icon={<Users />}
                        title="Collaborative Platforms"
                        description="Mastering modern collaborative authoring tools for seamless team workflows."
                        delay={0.4}
                        bg="bg-orange-50"
                        iconColor="text-orange-600"
                    />
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-dtales-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Enhance your documentation today.</h2>
            <p className="text-xl text-blue-200 mb-10">
                Whether you need expert services or professional training, DTALES is your partner in excellence.
            </p>
                        <button
                            className="bg-white text-dtales-navy px-10 py-4 rounded-full text-lg font-bold hover:scale-105 transition-all shadow-lg hover:shadow-white/20"
                            onClick={() => navigate('/contact')}
                            aria-label="Get in Touch"
                        >
                            Get in Touch
                        </button>
        </div>
      </section>
    </div>
  );
};

// Helper Component for Cards
const ServiceCard = ({ 
    icon, 
    iconImg,
    iconAlt,
    title, 
    description, 
    delay, 
    fullWidth = false,
    bg = "bg-white",
    iconColor = "text-black"
}: { 
    icon?: React.ReactNode, 
    iconImg?: string,
    iconAlt?: string,
    title: string, 
    description: string, 
    delay: number, 
    fullWidth?: boolean,
    bg?: string, 
    iconColor?: string
}) => (
    <motion.div
        className={`${bg} p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 ${fullWidth ? 'md:col-span-2' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
    >
        <div className={`w-12 h-12 rounded-xl bg-gray-100/50 ${iconColor} flex items-center justify-center mb-6`}>
            {iconImg ? (
                <img src={iconImg} alt={iconAlt} className="w-full h-full object-contain" />
            ) : (
                React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 }) : icon
            )}
        </div>
        <h3 className="text-xl font-bold mb-3 text-black">{title}</h3>
        <p className="text-gray-500 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default Services;