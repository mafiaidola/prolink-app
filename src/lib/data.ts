import type { Profile, HomepageContent } from '@/lib/types';
import { createClient } from '@/lib/supabase';

// Helper function to read profiles from Supabase
export const getProfiles = async (): Promise<Profile[]> => {
    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase.from('profiles').select('*').order('name');
    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return data as Profile[];
};

// Helper function to read a single profile by slug from Supabase
export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    const supabase = createClient();
    if (!supabase) return undefined;

    const { data, error } = await supabase.from('profiles').select('*').eq('slug', slug).single();
    if (error) {
        // Don't log "not found" errors, as they are expected for non-existent profiles
        if (error.code !== 'PGRST116') {
             console.error(`Error fetching profile with slug ${slug}:`, error);
        }
        return undefined;
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
            { "icon": "Languages", "title": "Bilingual Support", "description": "Full support for English (LTR) and Arabic (RTL) to reach a wider audience effortlessly." }
        ],
        faviconUrl: '/favicon.ico',
    };
    
    const supabase = createClient();
    if (!supabase) return fallbackContent;

    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).single();

    // If there's an error (like RLS blocking) or no data is found, return the fallback content.
    // This prevents the app from crashing.
    if (error || !data) {
        return fallbackContent;
    }
    
    // Ensure features is an array
    const features = Array.isArray(data.features) ? data.features : [];

    return {
        title: data.title || fallbackContent.title,
        subtitle: data.subtitle || fallbackContent.subtitle,
        description: data.description || fallbackContent.description,
        features: features.length > 0 ? features : fallbackContent.features,
        faviconUrl: data.faviconUrl || fallbackContent.faviconUrl,
    };
};
