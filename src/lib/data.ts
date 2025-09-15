import type { Profile } from '@/lib/types';

export const mockProfiles: Profile[] = [
  {
    id: '1',
    slug: 'nour-al-huda',
    name: 'Nour Al-Huda',
    jobTitle: 'Digital Marketing Specialist',
    bio: 'Crafting digital experiences that connect and convert. Expert in SEO, content strategy, and social media engagement.',
    logoUrl: 'https://picsum.photos/seed/nour-logo/200/200',
    companyInfo: 'At Innovatech Solutions, we drive growth through cutting-edge digital strategies and data-driven results.',
    theme: 'glass',
    animatedBackground: 'particles',
    isPublished: true,
    links: [
      { id: '1', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
      { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'Github' },
      { id: '3', title: 'Personal Website', url: 'https://example.com', icon: 'Globe' },
      { id: '4', title: 'Contact Me', url: 'mailto:nour@example.com', icon: 'Mail' },
      { id: '5', title: 'Portfolio', url: 'https://example.com/portfolio', icon: 'BookMarked' },
    ],
  },
  {
    id: '2',
    slug: 'john-doe',
    name: 'John Doe',
    jobTitle: 'Full-Stack Developer',
    bio: 'Building the web of tomorrow, one line of code at a time.',
    logoUrl: 'https://picsum.photos/seed/john-logo/200/200',
    companyInfo: 'Freelance Developer specialized in React and Node.js.',
    theme: 'dark',
    animatedBackground: 'stars',
    isPublished: true,
    links: [
        { id: '1', title: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
        { id: '2', title: 'GitHub', url: 'https://github.com', icon: 'Github' },
        { id: '3', title: 'Twitter / X', url: 'https://x.com', icon: 'Twitter' },
    ],
  },
];

// This is a temporary in-memory store.
// In a real app, this would be a database.
let profilesStore: Profile[] = [...mockProfiles];

export const getProfiles = async (): Promise<Profile[]> => {
    return Promise.resolve(profilesStore);
};

export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    return Promise.resolve(profilesStore.find((p) => p.slug === slug));
};

export const updateProfile = async (updatedProfile: Profile): Promise<Profile> => {
    const exists = profilesStore.some(p => p.id === updatedProfile.id);
    if (!exists) {
        throw new Error("Profile not found");
    }
    const slugInUse = profilesStore.some(p => p.slug === updatedProfile.slug && p.id !== updatedProfile.id);
    if (slugInUse) {
        throw new Error("Slug is already in use by another profile.");
    }

    profilesStore = profilesStore.map((p) =>
        p.id === updatedProfile.id ? updatedProfile : p
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
        logoUrl: `https://picsum.photos/seed/${newProfileData.slug}/200/200`
    };

    profilesStore.push(newProfile);
    return Promise.resolve(newProfile);
}
