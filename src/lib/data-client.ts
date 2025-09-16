// This file is for client-side data fetching.
// It exists to avoid module boundary errors when calling server-side `getHomepageContent` from a client component.

import type { HomepageContent } from '@/lib/types';
import { createClient } from '@/lib/supabase';

// This function is intended to be called from client components.
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
    
    const supabase = createClient();
    // In a client component context, we don't want to show warnings if Supabase isn't configured.
    if (!supabase) return fallbackContent;

    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).single();

    if (error) {
        // Silently return fallback on the client
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
