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
  | 'tech'
  | 'sunset'
  | 'forest'
  | 'oceanic';

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
  | 'circles'
  | 'deep-hole'
  | 'solaris'
  | 'star-wars';

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
  text?: string;
  level?: 'h1' | 'h2' | 'h3';
};

export type TextBlock = ContentBlockBase & {
  type: 'text';
  text?: string;
};

export type ImageBlock = ContentBlockBase & {
  type: 'image';
  url?: string;
  alt?: string;
};

export type QuoteBlock = ContentBlockBase & {
  type: 'quote';
  text?: string;
  author?: string;
};

export type Skill = {
  name: string;
  level: number; // 0-100
};

export type SkillsBlock = ContentBlockBase & {
  type: 'skills';
  title?: string;
  skills?: Skill[];
};

export type ProductSlide = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export type ProductSliderBlock = ContentBlockBase & {
  type: 'product-slider';
  title?: string;
  slides: ProductSlide[];
};

export type Logo = {
  id: string;
  imageUrl: string;
  alt: string;
};

export type LogoCarouselBlock = ContentBlockBase & {
  type: 'logo-carousel';
  title?: string;
  logos: Logo[];
};


export type ContentBlock = HeadingBlock | TextBlock | ImageBlock | QuoteBlock | SkillsBlock | ProductSliderBlock | LogoCarouselBlock;

export type VCard = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  website?: string;
};

// ========== NEW FEATURE TYPES ==========

// Social media platforms supported
export type SocialPlatform =
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'github'
  | 'telegram'
  | 'whatsapp'
  | 'snapchat'
  | 'pinterest'
  | 'discord'
  | 'twitch'
  | 'spotify'
  | 'email';

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

// Feature block toggles for profiles
export type EnabledBlocks = {
  viewCounter?: boolean;    // Show view count publicly
  socialIcons?: boolean;    // Show social icons grid
  contactForm?: boolean;    // Show contact form
};

// Analytics event stored in MongoDB
export type AnalyticsEvent = {
  id: string;
  profileId: string;
  type: 'view' | 'click';
  linkId?: string;          // For click events
  referrer: string;         // Traffic source
  userAgent: string;
  ipHash: string;           // Hashed for privacy
  country?: string;
  timestamp: Date;
};

// Analytics summary for dashboard
export type AnalyticsSummary = {
  totalViews: number;
  totalClicks: number;
  clicksByLink: { linkId: string; linkTitle: string; clicks: number }[];
  referrerBreakdown: { source: string; count: number }[];
  viewsOverTime: { date: string; views: number }[];
};

// Contact form submission
export type ContactSubmission = {
  id: string;
  profileId: string;
  profileName?: string;     // For admin display
  name: string;
  email: string;
  phone?: string;           // Optional phone field
  subject?: string;         // Optional subject field
  company?: string;         // Optional company field
  message: string;
  isRead: boolean;
  createdAt: Date;
};

// Contact form customization settings
export type ContactFormSettings = {
  title?: string;           // Form heading (default: "Get in Touch")
  description?: string;     // Subtitle/description under heading
  buttonText?: string;      // Submit button text (default: "Send Message")
  successMessage?: string;  // Message shown after submission
  // Optional form fields
  fields?: {
    phone?: boolean;        // Show phone number field
    subject?: boolean;      // Show subject field
    company?: boolean;      // Show company field
  };
  // Field placeholders
  placeholders?: {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    company?: string;
    message?: string;
  };
};

// ========== UPDATED PROFILE TYPE ==========

export type Profile = {
  id: string; // MongoDB ObjectId as string
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
  content?: ContentBlock[];
  links?: Link[];
  vCard?: VCard;
  createdAt?: string;
  // New feature fields
  enabledBlocks?: EnabledBlocks;
  socialLinks?: SocialLink[];
  viewCount?: number;       // Cached view count for display
  contactFormSettings?: ContactFormSettings;  // Contact form customization
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
  logoUrl?: string;
  heroImageUrl?: string;
  heroButton1Text?: string;
  heroButton1Link?: string;
  heroButton2Text?: string;
  heroButton2Link?: string;
};
