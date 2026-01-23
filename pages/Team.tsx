import React from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../constants';
import { Linkedin, Mail, ArrowRight } from 'lucide-react';

const Team: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Header */}
      <section className="py-24 text-center px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
            <motion.h1
            className="text-6xl md:text-8xl font-bold text-black mb-8 tracking-tighter"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            >
            Our Team
            </motion.h1>
            <motion.p
            className="text-2xl text-gray-800 font-bold leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            >
            Meet the people leading the change at DTALES
            </motion.p>
        </div>
      </section>

      {/* Team Showcase */}
      <section className="py-24 px-6 bg-[#F5F5F7]">
        <div className="max-w-7xl mx-auto space-y-24">
          {TEAM_MEMBERS.map((member, index) => {
            const isYashas = member.name.toLowerCase() === 'yashas niranjana';
            return (
              <motion.div
                key={member.name}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Image Side */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full md:w-1/2 text-left">
                  <div className="inline-block px-4 py-2 bg-white rounded-full text-sm font-bold tracking-wide uppercase text-gray-400 mb-6 shadow-sm">
                    {member.role}
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 text-dtales-navy">{member.name}</h2>
                  <div className="w-20 h-1 bg-blue-500 mb-8"></div>
                  <p className="text-xl text-gray-600 leading-relaxed mb-10">
                    {member.bio}
                  </p>
                  
                  <div className="flex gap-6">
                    {isYashas ? (
                      <>
                        <a
                          href="https://www.linkedin.com/in/yash017?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Linkedin size={24} /> <span className="group-hover:underline">LinkedIn</span>
                        </a>
                        <a
                          href="mailto:contact@dtales.tech"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Mail size={24} /> <span className="group-hover:underline">Get in touch</span>
                        </a>
                      </>
                    ) : member.name === "Bindu Mohan" ? (
                      <>
                        <a
                          href="https://www.linkedin.com/in/bindu-mohan-54201438/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Linkedin size={24} /> <span className="group-hover:underline">LinkedIn</span>
                        </a>
                        <a
                          href="mailto:contact@dtales.tech"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Mail size={24} /> <span className="group-hover:underline">Get in touch</span>
                        </a>
                      </>
                    ) : member.name === "Sneha Peri" ? (
                      <>
                        <a
                          href="https://www.linkedin.com/in/snehaperi/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Linkedin size={24} /> <span className="group-hover:underline">LinkedIn</span>
                        </a>
                        <a
                          href="mailto:contact@dtales.tech"
                          className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition-colors group"
                        >
                          <Mail size={24} /> <span className="group-hover:underline">Get in touch</span>
                        </a>
                      </>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-32 bg-black text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">We are always hiring.</h2>
            <p className="text-xl text-gray-400 mb-12">
                If you are passionate about storytelling and technology, we want to hear from you.
            </p>
            <a href="mailto:career@dtales.tech" className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-200 transition-colors">
                View Open Positions <ArrowRight />
            </a>
        </div>
      </section>
    </div>
  );
};

export default Team;