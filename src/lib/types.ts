export type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
};

export type Theme =
  | 'modern'
  | 'classic'
  | 'glass'
  | 'neon'
  | 'minimal'
  | 'retro'
  | 'dark'
  | 'corporate'
  | 'artistic'
  | 'tech';
  
export type AnimatedBackground =
  | 'none'
  | 'particles'
  | 'waves'
  | 'stars'
  | 'electric'
  | 'gradient'
  | 'aurora'
  | 'lines'
  | 'cells'
  | 'circles';

export type Profile = {
  id: string;
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  logoUrl: string;
  companyInfo: string;
  theme: Theme;
  animatedBackground: AnimatedBackground;
  isPublished: boolean;
  links: Link[];
};

export type SessionPayload = {
  isAdmin: boolean;
  expires: Date;
};
