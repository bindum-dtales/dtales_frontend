import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, X } from 'lucide-react';
import { TeamMember } from '../../../types';

interface InfoPanelProps {
  member: TeamMember;
  onClose: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const InfoPanel: React.FC<InfoPanelProps> = ({ member, onClose }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      exit="hidden"
      className="relative bg-white rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,32,191,0.25)] border border-[#0020BF]/10 p-6 md:p-7 text-left"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${member.name}'s profile`}
        className="absolute top-4 right-4 md:top-5 md:right-5 w-9 h-9 rounded-full bg-[#F5F5F7] hover:bg-[#0020BF] hover:text-white text-gray-500 flex items-center justify-center transition-colors duration-300 z-10"
      >
        <X size={16} />
      </button>

      <motion.div variants={item} className="inline-block px-3 py-1.5 bg-[#F5F5F7] rounded-full text-xs font-bold tracking-widest uppercase text-[#0020BF] mb-3">
        {member.role}
      </motion.div>

      <motion.h3 variants={item} className="text-2xl md:text-3xl font-bold text-black mb-1 tracking-tight pr-12">
        {member.name}
      </motion.h3>

      <motion.div variants={item} className="w-14 h-1 bg-[#0020BF] mb-4 rounded-full" />

      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-8">
        <motion.p variants={item} className="text-sm md:text-[15px] text-gray-600 leading-relaxed flex-1 lg:max-w-md">
          {member.bio}
        </motion.p>

        <div className="flex flex-col gap-4 lg:w-[220px] lg:flex-shrink-0">
          {member.skills && member.skills.length > 0 && (
            <motion.div variants={item} className="flex flex-wrap gap-2 content-start">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#0020BF] bg-[#0020BF]/[0.06] border border-[#0020BF]/10"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div variants={item} className="flex flex-wrap gap-5 lg:mt-auto">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold text-black hover:text-[#0020BF] transition-colors group"
              >
                <Linkedin size={18} /> <span className="group-hover:underline">LinkedIn</span>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm font-semibold text-black hover:text-[#0020BF] transition-colors group"
              >
                <Mail size={18} /> <span className="group-hover:underline">Get in touch</span>
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InfoPanel;
