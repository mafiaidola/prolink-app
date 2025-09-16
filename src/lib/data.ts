import type { Profile, HomepageContent } from '@/lib/types';
import { createClient } from '@/lib/supabase';

const fallbackProfiles: Profile[] = [
    {
        "id": "1",
        "slug": "nour-al-huda",
        "name": "Nour Al-Huda",
        "jobTitle": "Digital Marketing Specialist",
        "logoUrl": "https://picsum.photos/seed/nour-al-huda/200/200",
        "coverUrl": "https://picsum.photos/seed/nour-al-huda-cover/800/300",
        "theme": "modern",
        "animatedBackground": "particles",
        "layout": "default",
        "isPublished": true,
        "isVerified": true,
        "content": [
            { "id": "bio-1", "type": "text", "text": "A passionate digital marketer with 5 years of experience in SEO, SMM, and content strategy. Helping businesses grow online." },
            { "id": "work-1", "type": "heading", "level": "h2", "text": "My Work" },
            { "id": "skills-1", "type": "skills", "title": "Key Skills", "skills": [{ "name": "SEO", "level": 90 }, { "name": "Content Strategy", "level": 85 }, { "name": "Social Media Marketing", "level": 95 }] }
        ],
        "links": [{"id": "linkedin", "title": "LinkedIn Profile", "url": "https://linkedin.com/in/nour-al-huda", "icon": "https://cdn.simpleicons.org/linkedin/white"}, {"id": "twitter", "title": "Twitter / X", "url": "https://x.com/nour", "icon": "https://cdn.simpleicons.org/x/white"}, {"id": "website", "title": "Personal Website", "url": "https://nour.dev", "icon": "https://cdn.simpleicons.org/website/white"}],
        "vCard": { "firstName": "Nour", "lastName": "Al-Huda", "email": "contact@nour.dev", "phone": "+1987654321", "company": "Creative Solutions", "title": "Digital Marketing Specialist", "website": "https://nour.dev" }
    },
    {
        "id": "2",
        "slug": "ahmed-khan",
        "name": "Ahmed Khan",
        "jobTitle": "Senior Frontend Developer",
        "logoUrl": "https://picsum.photos/seed/ahmed-khan/200/200",
        "coverUrl": "https://picsum.photos/seed/ahmed-khan-cover/800/300",
        "theme": "tech",
        "animatedBackground": "lines",
        "layout": "stacked",
        "isPublished": true,
        "isVerified": false,
        "content": [
            { "id": "bio-2", "type": "text", "text": "Building beautiful and performant user interfaces with React and Next.js. Lover of clean code and good coffee." },
            { "id": "quote-1", "type": "quote", "text": "Code is like humor. When you have to explain it, it’s bad.", "author": "Cory House" }
        ],
        "links": [{"id": "github", "title": "GitHub Profile", "url": "https://github.com/ahmed-khan", "icon": "https://cdn.simpleicons.org/github/white"}, {"id": "portfolio", "title": "Portfolio", "url": "https://ahmed-khan-portfolio.com", "icon": "https://cdn.simpleicons.org/briefcase/white"}],
        "vCard": { "firstName": "Ahmed", "lastName": "Khan", "email": "ahmed@example.com" }
    }
];

// Helper function to read profiles from Supabase
export const getProfiles = async (): Promise<Profile[]> => {
    const supabase = createClient();
    if (!supabase) return fallbackProfiles;

    const { data, error } = await supabase.from('profiles').select('*').order('name');
    if (error) {
        console.warn('Error fetching profiles, returning fallback. Supabase error:', error.message);
        return fallbackProfiles;
    }
    return data as Profile[];
};

// Helper function to read a single profile by slug from Supabase
export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    const supabase = createClient();
    if (!supabase) {
        return fallbackProfiles.find(p => p.slug === slug);
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).single();
    if (error) {
        console.warn(`Error fetching profile for slug "${slug}", returning fallback. Supabase error:`, error.message);
        return fallbackProfiles.find(p => p.slug === slug);
    }
    return data as Profile;
};

// Helper function to read homepage content from Supabase
export const getHomepageContent = async (): Promise<HomepageContent> => {
    const fallbackContent: HomepageContent = {
        title: 'ProLink',
        subtitle: 'Your Ultimate Digital Profile Builder.',
        description: 'Create, manage, and share a stunning, professional bio link page that brings all your content together.',
        features: [
            { "icon": "Palette", "title": "Stunning Customization", "description": "Choose from multiple themes, animated backgrounds, and custom colors to make your profile truly yours." },
            { "icon": "SlidersHorizontal", "title": "Advanced Controls", "description": "Manage unlimited links, generate custom slugs, and get suggestions for your profile fields with our AI assistant." },
            { "icon": "QrCode", "title": "Dynamic QR Codes", "description": "Create and customize QR codes with your logo and brand colors to bridge the physical and digital worlds." },
            { "icon": "Languages", "title": "Bilingual Support", "description": "Full support for English (LTR) and Arabic (RTL) to reach a wider audience." }
        ],
        faviconUrl: '/favicon.ico',
    };
    
    const supabase = createClient();
    if (!supabase) return fallbackContent;

    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).single();

    if (error) {
        console.warn('Error fetching homepage content, returning fallback. Supabase error:', error.message);
        return fallbackContent;
    }
    
    const features = Array.isArray(data.features) ? data.features : [];

    return {
        title: data.title || fallbackContent.title,
        subtitle: data.subtitle || fallbackContent.subtitle,
        description: data.description || fallbackContent.description,
        features: features.length > 0 ? features : fallbackContent.features,
        faviconUrl: data.faviconUrl || fallbackContent.faviconUrl,
    };
};
