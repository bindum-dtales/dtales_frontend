import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../../../constants';
import TeamMemberCard from './TeamMemberCard';

// Editorial mosaic placement — deliberately asymmetric, not a uniform grid.
// panelSide is the side the profile-info overlay opens toward, based on which
// side of the mosaic the card sits on (left cards open rightward, and vice versa).
const LAYOUT = [
  { span: 'md:col-span-7', align: 'md:justify-self-start', size: 'lg' as const, dRotation: -4, offset: 'md:mt-0', panelSide: 'right' as const },
  { span: 'md:col-span-5', align: 'md:justify-self-end', size: 'md' as const, dRotation: 6, offset: 'md:mt-24', panelSide: 'left' as const },
  { span: 'md:col-span-5', align: 'md:justify-self-start', size: 'md' as const, dRotation: -6, offset: 'md:mt-8', panelSide: 'right' as const },
  { span: 'md:col-span-7', align: 'md:justify-self-end', size: 'lg' as const, dRotation: 4, offset: 'md:mt-0', panelSide: 'left' as const },
];

const TeamShowcase: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const focusedIndex = activeIndex ?? hoveredIndex;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-20 md:gap-y-8">
      {TEAM_MEMBERS.map((member, index) => {
        const layout = LAYOUT[index % LAYOUT.length];
        return (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full max-w-md ${layout.span} ${layout.align} ${layout.offset}`}
          >
            <TeamMemberCard
              member={member}
              index={index}
              size={layout.size}
              dRotation={layout.dRotation}
              panelSide={layout.panelSide}
              isFocused={focusedIndex === index}
              isOpen={activeIndex === index}
              isDimmed={focusedIndex !== null && focusedIndex !== index}
              canHover={canHover}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onToggle={() => setActiveIndex((prev) => (prev === index ? null : index))}
              onClose={() => setActiveIndex(null)}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeamShowcase;
