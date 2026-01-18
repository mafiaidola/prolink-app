import type { Profile, HomepageContent } from '@/lib/types';
import { createClient as createPublicClient } from '@/lib/supabase';
import { createAdminClient } from '@/lib/supabase-admin';
import 'server-only';

const fallbackProfiles: Profile[] = [
    {
        "id": "nour-al-huda",
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
];

// Fetches ALL profiles (published and drafts). For admin dashboard use ONLY.
export const getProfiles = async (): Promise<Profile[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('profiles').select('*').order('name');
    if (error) {
        console.warn('Admin fetch: Error fetching profiles, returning fallback. Supabase error:', error.message);
        return fallbackProfiles;
    }
    return data as Profile[];
};

// Fetches a single PUBLISHED profile by slug. For public page use.
export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    const supabase = createPublicClient();
    if (!supabase) {
        return fallbackProfiles.find(p => p.slug === slug && p.isPublished);
    }

    const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).eq('isPublished', true).single();
    if (error) {
        // This is expected if a profile is not found or not published. Don't log as a major warning.
        return undefined;
    }
    return data as Profile;
};

// Fetches a single profile by slug, regardless of published status. For admin dashboard use ONLY.
export const getProfileForAdmin = async (slug: string): Promise<Profile | undefined> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).single();

    if (error) {
        console.error(`Admin fetch: Error fetching profile for slug "${slug}". Supabase error:`, error.message);
        // Don't return fallback data for admin, as it could be misleading.
        return undefined;
    }
    return data as Profile;
};

// Helper function to read homepage content from Supabase. Can be used by public and admin.
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
        logoUrl: '/logo.svg',
        heroImageUrl: 'https://picsum.photos/seed/prolink-hero/1200/800',
        heroButton1Text: 'Get Started',
        heroButton1Link: '/dashboard',
        heroButton2Text: 'View Demo',
        heroButton2Link: '/nour-al-huda',
    };
    
    const supabase = createPublicClient();
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
        logoUrl: data.logoUrl || fallbackContent.logoUrl,
        heroImageUrl: data.heroImageUrl || fallbackContent.heroImageUrl,
        heroButton1Text: data.heroButton1Text || fallbackContent.heroButton1Text,
        heroButton1Link: data.heroButton1Link || fallbackContent.heroButton1Link,
        heroButton2Text: data.heroButton2Text || fallbackContent.heroButton2Text,
        heroButton2Link: data.heroButton2Link || fallbackContent.heroButton2Link,
    };
};
