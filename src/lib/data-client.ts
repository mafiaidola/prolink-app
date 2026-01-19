// This file is for client-side data fetching.
// Since MongoDB cannot run in browsers, we use a fallback approach for client components.
// For actual data, use server components or server actions instead.

import type { HomepageContent } from '@/lib/types';

// Default fallback content for client-side use
// Actual MongoDB data is fetched via server components in layout.tsx and page.tsx
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

// This function provides fallback content for client components.
// For MongoDB data, use server components (getHomepageContent from '@/lib/data')
export const getHomepageContent = async (): Promise<HomepageContent> => {
    // Client components should use server-fetched data passed as props
    // This fallback is only used when direct client-side fetch is attempted
    return fallbackContent;
};
