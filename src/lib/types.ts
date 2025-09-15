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
  | 'stacked'
  | 'minimalist-center'
  | 'modern-split'
  | 'minimalist-left-align';

export type ContentBlockBase = {
  id: string;
};

export type HeadingBlock = ContentBlockBase & {
  type: 'heading';
  text: string;
  level: 'h1' | 'h2' | 'h3';
};

export type TextBlock = ContentBlockBase & {
  type: 'text';
  text: string;
};

export type ImageBlock = ContentBlockBase & {
  type: 'image';
  url: string;
  alt: string;
};

export type QuoteBlock = ContentBlockBase & {
  type: 'quote';
  text: string;
  author?: string;
};

export type Skill = {
  name: string;
  level: number; // 0-100
};

export type SkillsBlock = ContentBlockBase & {
    type: 'skills';
    title: string;
    skills: Skill[];
};

export type ContentBlock = HeadingBlock | TextBlock | ImageBlock | QuoteBlock | SkillsBlock;

export type VCard = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website: string;
};

export type Profile = {
  id: string; // Will be a UUID from Supabase
  slug: string;
  name: string;
  jobTitle: string;
  logoUrl: string;
  coverUrl?: string;
  theme: Theme;
  animatedBackground: AnimatedBackground;
  layout: ProfileLayout;
  isPublished: boolean;
  isVerified: boolean;
  content: ContentBlock[];
  links: Link[];
  vCard?: VCard;
  createdAt?: string; // Supabase adds this
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
  faviconUrl?: string;
};
