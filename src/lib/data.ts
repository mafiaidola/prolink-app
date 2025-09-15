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
    const supabase = createClient();
    const fallbackContent: HomepageContent = {
        title: 'ProLink',
        subtitle: 'Your Ultimate Digital Profile Builder.',
        description: 'Create, manage, and share a stunning, professional bio link page that brings all your content together.',
        features: [],
        faviconUrl: '/favicon.ico',
    };

    if (!supabase) return fallbackContent;

    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).single();

    if (error || !data) {
        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching homepage content:', error);
        }
        // Provide a default fallback if the database is empty or errors out
        return fallbackContent;
    }
    
    // Ensure features is an array
    const features = Array.isArray(data.features) ? data.features : [];

    return {
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        features: features,
        faviconUrl: data.faviconUrl || '/favicon.ico',
    };
};
