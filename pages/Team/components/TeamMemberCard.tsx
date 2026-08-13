import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamMember } from '../../../types';
import InfoPanel from './InfoPanel';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  size: 'lg' | 'md';
  panelSide: 'left' | 'right';
  isFocused: boolean;
  isOpen: boolean;
  isDimmed: boolean;
  canHover: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onToggle: () => void;
  onClose: () => void;
}

// Each team asset is a single pre-composed image (blue D + person already
// merged), so the block just frames that image — no separate D layer.
const BLOCK_SIZE = {
  md: { block: 'h-[180px] w-[180px] sm:h-[210px] sm:w-[210px] md:h-[250px] md:w-[250px]', width: 'w-[180px] sm:w-[210px] md:w-[250px]' },
  lg: { block: 'h-[220px] w-[220px] sm:h-[256px] sm:w-[256px] md:h-[305px] md:w-[305px]', width: 'w-[220px] sm:w-[256px] md:w-[305px]' },
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  size,
  panelSide,
  isFocused,
  isOpen,
  isDimmed,
  canHover,
  onHoverStart,
  onHoverEnd,
  onToggle,
  onClose,
}) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const { block: blockClass, width: widthClass } = BLOCK_SIZE[size];

  return (
    <div
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? onHoverEnd : undefined}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      onClick={canHover ? undefined : onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`${member.name}, ${member.role}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!canHover) onToggle();
        }
      }}
      className="relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0020BF]/40 rounded-3xl"
      style={{ zIndex: isOpen ? 30 : isFocused ? 20 : 'auto' }}
    >
      <motion.div
        animate={{ opacity: isDimmed ? 0.35 : 1, scale: isFocused ? 1.05 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`relative ${blockClass} bg-white will-change-transform`}
      >
        {/* Each asset is a complete pre-composed card (blue D + person) —
            the two states crossfade in place so nothing shifts on hover. */}
        <img
          src={member.imageBw}
          alt={`${member.name}, ${member.role}`}
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-[400ms] ease-in-out"
          style={{ zIndex: 1, opacity: isFocused ? 0 : 1 }}
        />
        <img
          src={member.image}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none transition-opacity duration-[400ms] ease-in-out"
          style={{ zIndex: 2, opacity: isFocused ? 1 : 0 }}
        />
      </motion.div>

      {/* Name plate — always visible, minimal */}
      <motion.div
        animate={{ opacity: isDimmed ? 0.35 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`mt-4 ${widthClass}`}
      >
        <h3 className="text-base md:text-lg font-bold text-black tracking-tight truncate">{member.name}</h3>
        <p className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-[#0020BF] mt-1">{member.role}</p>
        <motion.span
          animate={{ opacity: isFocused ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          className="block mt-1 text-xs font-semibold text-[#0020BF] whitespace-nowrap"
        >
          {isOpen ? 'Close' : 'View profile'}
        </motion.span>
      </motion.div>

      <AnimatePresence>
        {isOpen && isDesktop && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0.82, x: panelSide === 'right' ? -16 : 16 }}
            animate={{ opacity: 1, scaleX: 1, x: 0 }}
            exit={{ opacity: 0, scaleX: 0.82, x: panelSide === 'right' ? -16 : 16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: panelSide === 'right' ? 'left center' : 'right center' }}
            className={`absolute top-0 w-[min(820px,calc(100vw_-_536px))] ${
              panelSide === 'right' ? 'left-full ml-8' : 'right-full mr-8'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <InfoPanel member={member} onClose={onClose} />
          </motion.div>
        )}
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pt-6">
              <InfoPanel member={member} onClose={onClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamMemberCard;
