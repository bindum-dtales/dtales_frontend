export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Testimonial {
  id: number;
  client: string;
  company: string;
  quote: string;
  logo?: string;
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  link: string;
  category: string;
  cover_image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}