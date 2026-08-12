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
  { icon: Box, value: "356+", label: "Assets Delivered" },
  { icon: FileText, value: "15+", label: "Documentation Systems" },
  { icon: PenLine, value: "56+", label: "Blogs & Articles" },
  { icon: PlayCircle, value: "54+", label: "Videos & Demos" },
  { icon: Globe, value: "63+", label: "Web / Brand Projects" },
];
