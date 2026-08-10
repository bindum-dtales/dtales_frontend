import {
  Box,
  FileText,
  PenLine,
  PlayCircle,
  Globe,
  type LucideIcon,
} from "lucide-react";

export type PortfolioStat = {
  icon: LucideIcon;
  value: string;
  label: string;
};

export const PORTFOLIO_STATS: PortfolioStat[] = [
  { icon: Box, value: "400+", label: "Assets Delivered" },
  { icon: FileText, value: "18+", label: "Documentation Systems" },
  { icon: PenLine, value: "120+", label: "Blogs & Articles" },
  { icon: PlayCircle, value: "40+", label: "Videos & Demos" },
  { icon: Globe, value: "60+", label: "Web / Brand Projects" },
];
