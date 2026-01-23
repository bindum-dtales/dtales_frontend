
import { TeamMember, Testimonial, SlideData } from './types';

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:10000";

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Bindu Mohan",
    role: "Founder & Principal",
    image: "/bindu.jpeg",
    bio: "A seasoned technical documentation leader and consultant with almost two decades of experience in building and optimizing documentation processes and teams. Bindu's expertise spans the entire documentation lifecycle, from establishing foundational practices to leading complex content migrations and strategies. With a passion for empowering organizations with clean, effective, and user-centric documentation, Bindu leads her team at DTALES Tech in keeping pace with the evolving landscape of technical communication."
  },
  {
    name: "Sneha Peri",
    role: "Content Lead",
    image: "/sneeha.jpeg",
    bio: "As a Content Lead with a Master's in Language and Literature, Sneha Peri blends analytical rigor with narrative depth to transform complex B2B and tech concepts into compelling stories. She specializes in the intersection of Information Development and Narrative Design, ensuring technical documentation is both precise and strategically aligned with market needs. Leveraging her expertise in market research, Sneha crafts data-driven strategies that bridge the gap between sophisticated technology and impactful communication."
  },
  {
    name: "Yashas Niranjana",
    role: "Creatives Lead",
    image: "/yash.png",
    bio: "A creative strategist and graphic designer with an MA from Coventry University, Yashas Niranjana specializes in building modern brands through impactful visuals and clean, minimalist design. He works closely with startups and creators to transform abstract ideas into fresh, authentic digital content and effective brand identities. By combining advanced design theory with a results-driven approach, Yashas is focused on delivering solutions that foster a genuine connection between brands and their audiences."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    client: "Sarah Johnson",
    company: "TechFlow Inc.",
    quote: "DTALES completely transformed our digital presence. Their storytelling approach is unmatched in the industry."
  },
  {
    id: 2,
    client: "Michael Chen",
    company: "GreenLeaf Ventures",
    quote: "Professional, creative, and incredibly dedicated. The new design increased our engagement by 200%."
  },
  {
    id: 3,
    client: "Priya Patel",
    company: "InnovateX",
    quote: "From the initial concept to the final launch, the team was exceptional. Bindu's leadership really shines through."
  },
  {
    id: 4,
    client: "David Wright",
    company: "Skyline Architecture",
    quote: "A masterclass in design and functionality. Highly recommended for anyone wanting a premium web experience."
  }
];

export const HERO_SLIDES: SlideData[] = [
  {
    id: 1,
    title: "From Concept to Clarity",
    subtitle: "Expert Documentation That Powers Your Product Experience",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop", // Strategy/Planning/Clarity image
    cta: "Learn More"
  },
  {
    id: 2,
    title: "Code Into Conversation",
    subtitle: "Technical Writing for Modern Products",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1920&auto=format&fit=crop",
    cta: "Our Services"
  },
  {
    id: 3,
    title: "Unlocking Potential",
    subtitle: "With Precision Content & Knowledge Systems",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
    cta: "View Portfolio"
  },
  {
    id: 4,
    title: "Your Single Partner",
    subtitle: "For Documentation Strategy, Toolchain & Content Excellence",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1920&auto=format&fit=crop",
    cta: "Contact Us"
  }
];
