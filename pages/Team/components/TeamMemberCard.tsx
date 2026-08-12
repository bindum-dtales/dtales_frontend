import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TeamMember } from '../../../types';
import DShape from './DShape';
import InfoPanel from './InfoPanel';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
  size: 'lg' | 'md';
  dRotation: number;
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

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  index,
  size,
  dRotation,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 22, mass: 0.4 };
  const mvX = useSpring(rawX, springConfig);
  const mvY = useSpring(rawY, springConfig);

  const portraitX = useTransform(mvX, [-0.5, 0.5], [-8, 8]);
  const portraitY = useTransform(mvY, [-0.5, 0.5], [-8, 8]);
  const shapeX = useTransform(mvX, [-0.5, 0.5], [-4, 4]);
  const shapeY = useTransform(mvY, [-0.5, 0.5], [-4, 4]);
  const decorX = useTransform(mvX, [-0.5, 0.5], [-11, 11]);
  const decorY = useTransform(mvY, [-0.5, 0.5], [-11, 11]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFocused || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetParallax = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const heightClass = size === 'lg' ? 'h-[380px] sm:h-[440px] md:h-[560px]' : 'h-[320px] sm:h-[380px] md:h-[460px]';

  const portraitSrc = imgError ? member.image : member.cutoutImage ?? member.image;

  return (
    <div
      ref={containerRef}
      onMouseEnter={canHover ? onHoverStart : undefined}
      onMouseLeave={canHover ? () => { onHoverEnd(); resetParallax(); } : undefined}
      onMouseMove={canHover ? handleMouseMove : undefined}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={`${member.name}, ${member.role}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className="relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0020BF]/40 rounded-3xl"
      style={{ zIndex: isOpen ? 30 : isFocused ? 20 : 'auto' }}
    >
      <motion.div
        animate={{ opacity: isDimmed ? 0.35 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`relative ${heightClass} flex items-end justify-center`}
        style={{ zIndex: isFocused ? 20 : 1 }}
      >
        {/* Brand D shape */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: size === 'lg' ? '92%' : '82%',
            aspectRatio: '100 / 120',
            rotate: dRotation,
            x: shapeX,
            y: shapeY,
          }}
          animate={{
            scale: isFocused ? 1.08 : 1,
            opacity: isFocused ? 0.9 : 0.65,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <DShape className="w-full h-full" fill="#0020BF" />
        </motion.div>

        {/* Decorative index accent */}
        <motion.span
          aria-hidden="true"
          className="absolute -top-2 left-0 md:left-2 text-[11px] font-bold tracking-[0.3em] uppercase text-[#0020BF]/50 pointer-events-none"
          style={{ x: decorX, y: decorY }}
          animate={{ opacity: isFocused ? 1 : 0.5 }}
          transition={{ duration: 0.6 }}
        >
          {String(index + 1).padStart(2, '0')}
        </motion.span>

        {/* Portrait */}
        <motion.div
          className="relative w-full h-full flex items-end justify-center"
          style={{ x: portraitX, y: portraitY }}
          animate={{ scale: isFocused ? 1.1 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={portraitSrc}
            alt={member.name}
            onError={() => setImgError(true)}
            draggable={false}
            className="relative h-full w-auto max-w-none object-contain object-bottom will-change-transform"
            initial={false}
            animate={{
              filter: isFocused
                ? 'grayscale(0%) brightness(1) drop-shadow(0 30px 45px rgba(0,15,85,0.35))'
                : 'grayscale(100%) brightness(0.96) drop-shadow(0 0px 0px rgba(0,15,85,0))',
            }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          />
        </motion.div>
      </motion.div>

      {/* Name plate — always visible, minimal */}
      <motion.div
        animate={{ opacity: isDimmed ? 0.35 : 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="mt-5 flex items-baseline justify-between gap-4 border-t border-black/5 pt-4"
      >
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight">{member.name}</h3>
          <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-[#0020BF] mt-1">{member.role}</p>
        </div>
        <motion.span
          animate={{ x: isFocused ? 4 : 0, opacity: isFocused ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-semibold text-[#0020BF] whitespace-nowrap"
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: panelSide === 'right' ? 'left center' : 'right center' }}
            className={`absolute top-0 w-[min(820px,calc(100vw_-_536px))] ${
              panelSide === 'right' ? 'left-full ml-10' : 'right-full mr-10'
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
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
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
