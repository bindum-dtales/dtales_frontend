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
  // Each input modality gets its own channel so mouse hover and keyboard
  // focus never fight over the same state, then they're merged below into
  // one canonical activeMemberId. Guarding the "clear" setters with a
  // functional update (only clear if it's still *my* id) means a
  // late-firing pointerleave/blur from the previously-hovered card can
  // never stomp on a newer card's already-set active id.
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [keyboardFocusId, setKeyboardFocusId] = useState<string | null>(null);
  const [tapActiveId, setTapActiveId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const listener = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  // On hover-capable devices, mouse hover always wins; keyboard focus is the
  // fallback (tabbing without moving the mouse). Touch devices use tap.
  const activeMemberId = canHover ? hoveredId ?? keyboardFocusId : tapActiveId;

  return (
    <div className="flex flex-col items-start md:flex-row md:flex-nowrap md:items-end md:justify-center gap-y-14 gap-x-8 lg:gap-x-12">
      {TEAM_MEMBERS.map((member, index) => {
        const layout = LAYOUT[index % LAYOUT.length];
        const isFocused = activeMemberId === member.name;
        return (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative md:w-auto"
            // The open card's panel is wide and overlaps its neighbours, so
            // the open card is raised ABOVE its resting siblings. That makes
            // the panel both the topmost painted layer (neighbours can never
            // show through it) and the topmost hit-testable one, so moving
            // the cursor across the panel can never reach a neighbour's
            // pointer handlers and switch the active member mid-move.
            style={{ zIndex: isFocused ? 50 : 10 }}
          >
            <TeamMemberCard
              member={member}
              size={layout.size}
              panelSide={layout.panelSide}
              isFocused={isFocused}
              isOpen={isFocused}
              isDimmed={activeMemberId !== null && !isFocused}
              canHover={canHover}
              onHoverStart={() => setHoveredId(member.name)}
              onHoverEnd={() => setHoveredId((prev) => (prev === member.name ? null : prev))}
              onFocus={() => setKeyboardFocusId(member.name)}
              onBlur={() => setKeyboardFocusId((prev) => (prev === member.name ? null : prev))}
              onToggle={() => setTapActiveId((prev) => (prev === member.name ? null : member.name))}
              onClose={() => {
                setTapActiveId(null);
                setHoveredId(null);
                setKeyboardFocusId(null);
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default TeamShowcase;
