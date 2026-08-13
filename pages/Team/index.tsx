import React from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../../constants';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/seo/SEO';
import PersonSchema from '../../components/seo/PersonSchema';
import TeamShowcase from './components/TeamShowcase';

const Team: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-white overflow-hidden">
      <SEO
        title="Team | DTALES Tech"
        description="Meet the DTALES Tech team leading technical content, product marketing, creative strategy, and operational execution."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Team', url: '/team' },
        ]}
      >
        <PersonSchema
          people={TEAM_MEMBERS.map((member) => ({
            name: member.name,
            jobTitle: member.role,
            image: member.image,
            sameAs: member.linkedin ? [member.linkedin] : undefined,
            worksFor: '/team',
          }))}
        />
      </SEO>

      {/* Header */}
      <section className="pt-3 md:pt-4 pb-4 md:pb-6 text-center px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-black mb-6 tracking-tighter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Our Team
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            Meet the people leading the change at DTALES Tech
          </motion.p>
        </div>
      </section>

      {/* Team Showcase */}
      <section className="pt-3 md:pt-4 pb-20 md:pb-24 px-6">
        <div className="max-w-7xl xl:max-w-[1600px] mx-auto">
          <TeamShowcase />
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-32 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">We are always hiring</h2>
          <p className="text-xl text-gray-400 mb-12">
            If you are passionate about storytelling and technology, we want to hear from you
          </p>
          <a href="mailto:career@dtales.tech" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-colors">
            Write to Us <ArrowRight />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Team;
