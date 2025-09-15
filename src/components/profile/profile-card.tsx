'use client';

import type { Profile } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import * as LucideIcons from 'lucide-react';
import Link from 'next/link';
import { useApp } from '@/components/providers';
import { cn } from '@/lib/utils';
import { translations } from '@/lib/translations';
import Image from 'next/image';

const themeStyles = {
  default: {
    card: 'bg-card/80',
    button: 'default',
  },
  glass: {
    card: 'bg-white/10 backdrop-filter backdrop-blur-lg border-white/20 text-white',
    button: 'secondary',
    separator: 'bg-white/20',
    cardDescription: 'text-gray-200',
    cardTitle: 'text-white',
    linkButton: 'bg-white/20 hover:bg-white/30 text-white'
  },
  dark: {
    card: 'bg-gray-900/80 border-gray-700 text-white',
    button: 'secondary',
    separator: 'bg-gray-700',
    cardDescription: 'text-gray-300',
    cardTitle: 'text-white',
    linkButton: 'bg-gray-800 hover:bg-gray-700 text-white'
  },
  modern: {
    card: 'bg-white/90 border-gray-200/80 text-gray-800 shadow-xl',
    button: 'default',
    separator: 'bg-gray-200',
    cardDescription: 'text-gray-600',
    cardTitle: 'text-gray-900',
    linkButton: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
  },
  classic: {
    card: 'bg-[#FDF6E3]/90 border-[#D2C8B4] text-[#655342]',
    button: 'default',
    separator: 'bg-[#D2C8B4]',
    cardDescription: 'text-[#87725f]',
    cardTitle: 'text-[#584433] font-serif',
    linkButton: 'bg-[#F2EADF] hover:bg-[#EAE0C7] text-[#655342]'
  },
  neon: {
    card: 'bg-black/80 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    button: 'default',
    separator: 'bg-purple-500/30',
    cardDescription: 'text-gray-300',
    cardTitle: 'text-white font-mono',
    linkButton: 'bg-purple-900/40 hover:bg-purple-800/60 text-white border border-purple-500/50'
  },
  minimal: {
    card: 'bg-white/95 text-black border-none shadow-none',
    button: 'ghost',
    separator: 'bg-gray-200',
    cardDescription: 'text-gray-500',
    cardTitle: 'text-black',
    linkButton: 'bg-transparent hover:bg-gray-100 text-black'
  },
  retro: {
    card: 'bg-[#FFDAB9]/90 border-[#D2B48C] text-[#8B4513] font-mono',
    button: 'default',
    separator: 'bg-[#D2B48C]',
    cardDescription: 'text-[#A0522D]',
    cardTitle: 'text-[#8B4513]',
    linkButton: 'bg-[#FFE4C4] hover:bg-[#F5DEB3] text-[#8B4513] border border-transparent'
  },
  corporate: {
    card: 'bg-blue-50/90 border-blue-200 text-blue-900',
    button: 'primary',
    separator: 'bg-blue-200',
    cardDescription: 'text-blue-700',
    cardTitle: 'text-blue-900',
    linkButton: 'bg-white hover:bg-blue-100 text-blue-900 border border-blue-200'
  },
  artistic: {
    card: 'bg-gradient-to-br from-yellow-100 via-red-100 to-pink-100/90 border-white/50 text-gray-800',
    button: 'default',
    separator: 'bg-gray-300/70',
    cardDescription: 'text-gray-600',
    cardTitle: 'text-gray-800 font-serif',
    linkButton: 'bg-white/50 hover:bg-white/80 text-gray-800'
  },
  tech: {
    card: 'bg-blue-900/95 border-blue-700 text-white',
    button: 'secondary',
    separator: 'bg-blue-700',
    cardDescription: 'text-blue-200',
    cardTitle: 'text-white',
    linkButton: 'bg-blue-800 hover:bg-blue-700 text-white'
  },
};

const getIcon = (name?: string) => {
    if (!name) return <LucideIcons.Link className="h-5 w-5 rtl:ml-3 ltr:mr-3" />;
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon className="h-5 w-5 rtl:ml-3 ltr:mr-3 group-hover:animate-pulse" /> : <LucideIcons.Link className="h-5 w-5 rtl:ml-3 ltr:mr-3" />;
};


const DefaultLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <Card className={cn("w-full max-w-md mx-auto z-10 shadow-2xl transition-all duration-300 overflow-hidden", selectedTheme.card)}>
        {profile.coverUrl && (
            <div className="relative h-36">
                <Image src={profile.coverUrl} alt={`${profile.name}'s cover photo`} fill style={{ objectFit: "cover" }} data-ai-hint="background abstract" />
            </div>
        )}
        <CardHeader className={cn("items-center text-center pt-6", profile.coverUrl ? "-mt-16" : "")}>
            <Avatar className={cn("w-24 h-24 mb-4 border-4 shadow-lg", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className={cn("text-3xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
            <CardDescription className={cn("text-lg", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
            <p className={cn("text-sm pt-2", selectedTheme.cardDescription)}>{profile.bio}</p>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <Separator className={cn("my-4", selectedTheme.separator)} />
            <div className="space-y-4">
                <h3 className={cn("text-center font-semibold text-lg font-headline", selectedTheme.cardTitle)}>{t.about}</h3>
                <p className="text-sm text-center">{profile.companyInfo}</p>
            </div>
            {profile.links && profile.links.length > 0 && (
                <>
                    <Separator className={cn("my-4", selectedTheme.separator)} />
                    <div className="flex flex-col space-y-3">
                        {profile.links.map((link) => (
                            <Button
                                key={link.id}
                                variant={selectedTheme.button as any}
                                className={cn("w-full justify-start h-12 text-md group", selectedTheme.linkButton)}
                                asChild
                            >
                                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                    {getIcon(link.icon)}
                                    <span>{link.title}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </>
            )}
        </CardContent>
    </Card>
);

const StackedLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <Card className={cn("w-full max-w-md mx-auto z-10 shadow-2xl transition-all duration-300 overflow-hidden", selectedTheme.card)}>
        {profile.coverUrl && (
            <div className="relative h-36">
                <Image src={profile.coverUrl} alt={`${profile.name}'s cover photo`} fill style={{ objectFit: "cover" }} data-ai-hint="background abstract" />
            </div>
        )}
        <CardContent className="p-6">
            <div className={cn("flex flex-col items-center text-center", profile.coverUrl ? "-mt-20" : "mt-6")}>
                <Avatar className={cn("w-24 h-24 mb-4 border-4 shadow-lg", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                    <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className={cn("text-3xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
                <CardDescription className={cn("text-lg", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
                <p className={cn("text-sm pt-2 max-w-xs", selectedTheme.cardDescription)}>{profile.bio}</p>
            </div>

            {profile.links && profile.links.length > 0 && (
                <div className="flex flex-col space-y-3 mt-6">
                    {profile.links.map((link) => (
                        <Button
                            key={link.id}
                            variant={selectedTheme.button as any}
                            className={cn("w-full justify-center h-12 text-md group", selectedTheme.linkButton)}
                            asChild
                        >
                            <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                {getIcon(link.icon)}
                                <span>{link.title}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            )}
            
            {profile.companyInfo && (
                <>
                    <Separator className={cn("my-6", selectedTheme.separator)} />
                    <div className="space-y-2">
                        <h3 className={cn("text-center font-semibold text-lg font-headline", selectedTheme.cardTitle)}>{t.about}</h3>
                        <p className="text-sm text-center">{profile.companyInfo}</p>
                    </div>
                </>
            )}
        </CardContent>
    </Card>
);

const MinimalistCenterLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <div className="w-full max-w-md mx-auto z-10 flex flex-col items-center justify-center min-h-full text-center">
        <Card className={cn("w-full transition-all duration-300 overflow-hidden !bg-transparent !shadow-none !border-none", selectedTheme.card)}>
            <CardHeader className="items-center text-center pt-6">
                <Avatar className={cn("w-28 h-28 mb-4 border-4 shadow-lg", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                    <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className={cn("text-4xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
                <CardDescription className={cn("text-xl", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
                <p className={cn("text-md pt-2 max-w-sm", selectedTheme.cardDescription)}>{profile.bio}</p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                {profile.links && profile.links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {profile.links.map((link) => (
                            <Button
                                key={link.id}
                                variant={'ghost'}
                                size="icon"
                                className={cn("w-14 h-14 rounded-full group", selectedTheme.linkButton)}
                                asChild
                                title={link.title}
                            >
                                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                    {getIcon(link.icon)}
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
);


const layouts = {
    default: DefaultLayout,
    stacked: StackedLayout,
    'minimalist-center': MinimalistCenterLayout,
};

export function ProfileCard({ profile }: { profile: Profile }) {
  const { language } = useApp();
  
  const selectedTheme = themeStyles[profile.theme] || themeStyles.default;
  const t = translations[language];
  const LayoutComponent = layouts[profile.layout] || layouts.default;

  return <LayoutComponent profile={profile} selectedTheme={selectedTheme} t={t} />;
}
