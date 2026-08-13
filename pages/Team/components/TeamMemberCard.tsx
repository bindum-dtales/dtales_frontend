import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TeamMember } from '../../../types';
import dImage from '../../../src/assets/Dbg.png';
import dMaskImage from '../../../src/assets/DbgMask.png';
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

// The block frames the blue D (Dbg.png), which fills it almost edge to edge.
const BLOCK_SIZE = {
  md: { block: 'h-[180px] w-[180px] sm:h-[210px] sm:w-[210px] md:h-[250px] md:w-[250px]', width: 'w-[180px] sm:w-[210px] md:w-[250px]' },
  lg: { block: 'h-[220px] w-[220px] sm:h-[256px] sm:w-[256px] md:h-[305px] md:w-[305px]', width: 'w-[220px] sm:w-[256px] md:w-[305px]' },
};

// The four person cutouts each have different internal framing/margins, so
// each gets its own box (relative to the D block) to sit convincingly inside
// the D — bottom-anchored. The mask below clips everything to the D's exact
// silhouette regardless of these values, so a box can safely overshoot the
// block's edges without ever spilling outside the D. Tune per person if a
// composition looks off; these don't affect the source images.
const PERSON_POSITION: Record<string, { left: string; bottom: string; width: string; height: string }> = {
  'Bindu Mohan': { left: '-11%', bottom: '5%', width: '100%', height: '270%' },
  'Sneha Peri': { left: '-7%', bottom: '5%', width: '80%', height: '122%' },
  'Yashas Niranjan': { left: '5%', bottom: '3%', width: '100%', height: '140%' },
  'Sakshi Agarwal': { left: '-15%', bottom: '5%', width: '100%', height: '132%' },
};
const DEFAULT_PERSON_POSITION = { left: '9%', bottom: '-6%', width: '84%', height: '126%' };

const EASE = 'cubic-bezier(0.22,1,0.36,1)';

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
  const personPos = PERSON_POSITION[member.name] ?? DEFAULT_PERSON_POSITION;

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
        animate={{ opacity: isDimmed ? 0.35 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`relative ${blockClass}`}
      >
        {/* D + person share one transform so the whole composition scales as a
            single object on hover — the D never gets its own independent motion. */}
        <div
          className="absolute inset-0 transition-transform duration-[450ms] will-change-transform"
          style={{ transform: isFocused ? 'scale(1.05)' : 'scale(1)', transitionTimingFunction: EASE }}
        >
          {/* Blue D — always blue, never grayscaled */}
          <img
            src={dImage}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            style={{ zIndex: 1 }}
          />

          {/* Person layer, physically clipped to the exact D silhouette via a
              CSS mask — nothing can render outside the D's shape. The mask
              image is an alpha-channel derivative of Dbg.png's own pixels
              (same silhouette, not redrawn); Dbg.png itself has no alpha
              channel, so used directly it would luminance-mask backwards
              (revealing the white background and hiding the blue D). */}
          <div
            className="absolute inset-0"
            style={{
              zIndex: 2,
              WebkitMaskImage: `url(${dMaskImage})`,
              maskImage: `url(${dMaskImage})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              maskMode: 'alpha',
            }}
          >
            {/* Sits inside the D, bottom-anchored. Only this layer desaturates on hover. */}
            <img
              src={member.personImage}
              alt={`${member.name}, ${member.role}`}
              draggable={false}
              className="absolute object-contain object-bottom select-none pointer-events-none transition-[filter] duration-[450ms]"
              style={{
                left: personPos.left,
                bottom: personPos.bottom,
                width: personPos.width,
                height: personPos.height,
                filter: isFocused ? 'grayscale(0%)' : 'grayscale(100%)',
                transitionTimingFunction: EASE,
              }}
            />
          </div>
        </div>
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
