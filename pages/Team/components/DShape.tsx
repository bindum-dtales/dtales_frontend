import React from 'react';
import { motion, MotionValue } from 'framer-motion';

interface DShapeProps {
  className?: string;
  style?: React.CSSProperties;
  fill?: string;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}

/**
 * Brand "D" mark built as a solid geometric letterform (spine + bowl with a
 * punched counter), not a font glyph — kept crisp and scalable as SVG so it
 * reads as a constructed shape rather than typography.
 */
const DShape: React.FC<DShapeProps> = ({ className = '', style, fill = '#0020BF', x, y }) => {
  return (
    <motion.svg
      viewBox="0 0 100 120"
      className={className}
      style={{ x, y, ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={fill}
        d="M0,0 H54 C80,0 98,24 98,60 C98,96 80,120 54,120 H0 Z
           M22,22 H52 C67,22 76,38 76,60 C76,82 67,98 52,98 H22 Z"
      />
    </motion.svg>
  );
};

export default DShape;
