export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    description: "We deep dive into your product, audience and goals.",
  },
  {
    number: "02",
    title: "Strategize",
    description: "We craft the right content and positioning framework.",
  },
  {
    number: "03",
    title: "Create",
    description: "We build content that is clear, compelling and search-ready.",
  },
  {
    number: "04",
    title: "Distribute",
    description: "We ensure the right content reaches the right people.",
  },
  {
    number: "05",
    title: "Measure",
    description: "We track performance and refine for better results.",
  },
];
