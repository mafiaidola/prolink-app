import type { Profile, HomepageContent, Feature } from '@/lib/types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    slug: 'nour-al-huda',
    name: 'Nour Al-Huda',
    jobTitle: 'Digital Marketing Specialist',
    bio: 'Crafting digital experiences that connect and convert. Expert in SEO, content strategy, and social media engagement.',
    logoUrl: 'https://picsum.photos/seed/nour-logo/200/200',
    coverUrl: 'https://picsum.photos/seed/nour-cover/800/300',
    companyInfo: 'At Innovatech Solutions, we drive growth through cutting-edge digital strategies and data-driven results.',
    theme: 'glass',
    animatedBackground: 'particles',
    layout: 'default',
    isPublished: true,
    links: [
      { id: '1', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
      { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'Github' },
      { id: '3', title: 'Personal Website', url: 'https://example.com', icon: 'Globe' },
      { id: '4', title: 'Contact Me', url: 'mailto:nour@example.com', icon: 'Mail' },
      { id: '5', title: 'Portfolio', url: 'https://example.com/portfolio', icon: 'Book' },
    ],
  },
  {
    id: '2',
    slug: 'john-doe',
    name: 'John Doe',
    jobTitle: 'Full-Stack Developer',
    bio: 'Building the web of tomorrow, one line of code at a time.',
    logoUrl: 'https://picsum.photos/seed/john-logo/200/200',
    coverUrl: 'https://picsum.photos/seed/john-cover/800/300',
    companyInfo: 'Freelance Developer specialized in React and Node.js.',
    theme: 'dark',
    animatedBackground: 'stars',
    layout: 'stacked',
    isPublished: true,
    links: [
        { id: '1', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
        { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'Github' },
        { id: '3', title: 'Twitter / X', url: 'https://x.com', icon: 'Twitter' },
    ],
  },
];

const defaultFeatures: Feature[] = [
  {
    icon: 'Palette',
    title: 'Stunning Customization',
    description: 'Choose from multiple themes, animated backgrounds, and custom colors to make your profile truly yours.',
  },
  {
    icon: 'SlidersHorizontal',
    title: 'Advanced Controls',
    description: 'Manage unlimited links, generate custom slugs, and get suggestions for your profile fields with our AI assistant.',
  },
  {
    icon: 'QrCode',
    title: 'Dynamic QR Codes',
    description: 'Create and customize QR codes with your logo and brand colors to bridge the physical and digital worlds.',
  },
  {
    icon: 'Languages',
    title: 'Bilingual Support',
    description: 'Full support for English (LTR) and Arabic (RTL) to reach a wider audience effortlessly.',
  },
];

const defaultHomepageContent: HomepageContent = {
  title: 'ProLink',
  subtitle: 'Your Ultimate Digital Profile Builder.',
  description: 'Create, manage, and share a stunning, professional bio link page that brings all your content together.',
  features: defaultFeatures,
};

// This is a temporary in-memory store.
// In a real app, this would be a database.
let profilesStore: Profile[] = [...mockProfiles];
let homepageContentStore: HomepageContent = defaultHomepageContent;


export const getProfiles = async (): Promise<Profile[]> => {
    return Promise.resolve(profilesStore);
};

export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    return Promise.resolve(profilesStore.find((p) => p.slug === slug));
};

export const updateProfile = async (updatedProfile: Profile): Promise<Profile> => {
    const profileId = updatedProfile.id;
    const exists = profilesStore.some(p => p.id === profileId);
    if (!exists) {
        throw new Error("Profile not found");
    }
    const slugInUse = profilesStore.some(p => p.slug === updatedProfile.slug && p.id !== profileId);
    if (slugInUse) {
        throw new Error("Slug is already in use by another profile.");
    }

    profilesStore = profilesStore.map((p) =>
        p.id === profileId ? updatedProfile : p
    );
    return Promise.resolve(updatedProfile);
};

export const createProfile = async (newProfileData: Omit<Profile, 'id'>): Promise<Profile> => {
    const slugInUse = profilesStore.some(p => p.slug === newProfileData.slug);
    if (slugInUse) {
        throw new Error("Slug is already in use.");
    }

    const newProfile: Profile = {
        ...newProfileData,
        id: new Date().toISOString(), // Generate a unique ID
        logoUrl: `https://picsum.photos/seed/${newProfileData.slug}/200/200`,
        coverUrl: `https://picsum.photos/seed/${newProfileData.slug}-cover/800/300`,
    };

    profilesStore.push(newProfile);
    return Promise.resolve(newProfile);
}

export const getHomepageContent = async (): Promise<HomepageContent> => {
  return Promise.resolve(homepageContentStore);
};

export const updateHomepageContent = async (content: HomepageContent): Promise<HomepageContent> => {
  homepageContentStore = content;
  return Promise.resolve(homepageContentStore);
}
