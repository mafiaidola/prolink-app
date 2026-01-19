'use client';

import { SocialLink, SocialPlatform } from '@/lib/types';
import {
    Instagram,
    Twitter,
    Facebook,
    Linkedin,
    Youtube,
    Github,
    Send as Telegram,
    MessageCircle,
    Music2,
    Twitch,
    MapPin as Pinterest,
    MessageSquare as Discord,
    Camera as Snapchat,
    Mail
} from 'lucide-react';

// TikTok custom icon (not in lucide)
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

interface SocialIconsGridProps {
    socialLinks: SocialLink[];
    size?: 'sm' | 'md' | 'lg';
}

// Platform colors for hover effects
const platformColors: Record<SocialPlatform, string> = {
    instagram: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400',
    twitter: 'hover:bg-black',
    facebook: 'hover:bg-blue-600',
    linkedin: 'hover:bg-blue-700',
    tiktok: 'hover:bg-black',
    youtube: 'hover:bg-red-600',
    github: 'hover:bg-gray-900',
    telegram: 'hover:bg-sky-500',
    whatsapp: 'hover:bg-green-500',
    snapchat: 'hover:bg-yellow-400 hover:text-black',
    pinterest: 'hover:bg-red-600',
    discord: 'hover:bg-indigo-600',
    twitch: 'hover:bg-purple-600',
    spotify: 'hover:bg-green-500',
    email: 'hover:bg-gray-700',
};

// Get icon component for platform
const getIconComponent = (platform: SocialPlatform, size: number) => {
    const icons: Record<SocialPlatform, React.ReactNode> = {
        instagram: <Instagram size={size} />,
        twitter: <Twitter size={size} />,
        facebook: <Facebook size={size} />,
        linkedin: <Linkedin size={size} />,
        tiktok: <TikTokIcon size={size} />,
        youtube: <Youtube size={size} />,
        github: <Github size={size} />,
        telegram: <Telegram size={size} />,
        whatsapp: <MessageCircle size={size} />,
        snapchat: <Snapchat size={size} />,
        pinterest: <Pinterest size={size} />,
        discord: <Discord size={size} />,
        twitch: <Twitch size={size} />,
        spotify: <Music2 size={size} />,
        email: <Mail size={size} />,
    };
    return icons[platform];
};

export function SocialIconsGrid({ socialLinks, size = 'md' }: SocialIconsGridProps) {
    if (!socialLinks || socialLinks.length === 0) return null;

    const sizeConfig = {
        sm: { icon: 16, button: 'w-9 h-9' },
        md: { icon: 20, button: 'w-11 h-11' },
        lg: { icon: 24, button: 'w-14 h-14' },
    };

    const { icon: iconSize, button: buttonClass } = sizeConfig[size];

    return (
        <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
                <a
                    key={link.id}
                    href={link.platform === 'email' ? `mailto:${link.url}` : link.url}
                    target={link.platform === 'email' ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className={`
            ${buttonClass} ${platformColors[link.platform]}
            flex items-center justify-center
            rounded-full
            bg-white/10 backdrop-blur-sm
            text-white
            border border-white/20
            transition-all duration-300
            hover:scale-110 hover:border-transparent hover:text-white
            shadow-lg hover:shadow-xl
          `}
                    title={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                >
                    {getIconComponent(link.platform, iconSize)}
                </a>
            ))}
        </div>
    );
}
