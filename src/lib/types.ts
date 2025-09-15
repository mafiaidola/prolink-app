export type Link = {
  id: string;
  title: string;
  url: string;
  icon?: string;
};

export type Theme =
  | 'default'
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

export type ProfileLayout = 
  | 'default' 
  | 'stacked';

export type Profile = {
  id: string;
  slug: string;
  name: string;
  jobTitle: string;
  bio: string;
  logoUrl: string;
  coverUrl?: string; // New field for cover photo
  companyInfo: string;
  theme: Theme;
  animatedBackground: AnimatedBackground;
  layout: ProfileLayout; // New field for layout
  isPublished: boolean;
  links: Link[];
};

export type SessionPayload = {
  isAdmin: boolean;
  expires: Date;
};

export type Feature = {
  icon: string;
  title: string;
  description: string;
};

export type HomepageContent = {
  title: string;
  subtitle: string;
  description: string;
  features: Feature[];
};
