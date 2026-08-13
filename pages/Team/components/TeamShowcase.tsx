import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../../../constants';
import TeamMemberCard from './TeamMemberCard';

// Single horizontal row on desktop. panelSide is the side the profile-info
// overlay opens toward for each member. Bindu (Founder & Principal) is the
// featured/large composition; the other three share the compact size.
const LAYOUT = [
  { size: 'lg' as const, panelSide: 'right' as const },
  { size: 'md' as const, panelSide: 'right' as const },
  { size: 'md' as const, panelSide: 'left' as const },
  { size: 'md' as const, panelSide: 'left' as const },
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
  // On hover-capable devices info opens on hover; touch devices fall back to tap.
  const openIndex = canHover ? hoveredIndex : activeIndex;

  return (
    <div className="flex flex-col items-start md:flex-row md:flex-nowrap md:items-end md:justify-center gap-y-14 gap-x-8 lg:gap-x-12">
      {TEAM_MEMBERS.map((member, index) => {
        const layout = LAYOUT[index % LAYOUT.length];
        return (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="md:w-auto"
          >
            <TeamMemberCard
              member={member}
              index={index}
              size={layout.size}
              panelSide={layout.panelSide}
              isFocused={focusedIndex === index}
              isOpen={openIndex === index}
              isDimmed={focusedIndex !== null && focusedIndex !== index}
              canHover={canHover}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onToggle={() => setActiveIndex((prev) => (prev === index ? null : index))}
              onClose={() => {
                setActiveIndex(null);
                setHoveredIndex(null);
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeamShowcase;
