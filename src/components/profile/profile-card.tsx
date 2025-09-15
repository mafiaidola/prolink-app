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
  // Add other themes here
  modern: {},
  classic: {},
  neon: {},
  minimal: {},
  retro: {},
  corporate: {},
  artistic: {},
  tech: {},
};


export function ProfileCard({ profile }: { profile: Profile }) {
  const { language } = useApp();
  
  const selectedTheme = themeStyles[profile.theme as keyof typeof themeStyles] || themeStyles.default;

  const translations = {
    en: {
      about: 'About',
    },
    ar: {
      about: 'عني',
    },
  };
  const t = translations[language];
  
  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon className="h-5 w-5 rtl:ml-3 ltr:mr-3 group-hover:animate-pulse" /> : <LucideIcons.Link className="h-5 w-5 rtl:ml-3 ltr:mr-3" />;
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto z-10 shadow-2xl transition-all duration-300", selectedTheme.card)}>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4 border-4 border-white/50 shadow-lg">
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
          <h3 className="text-center font-semibold text-lg font-headline">{t.about}</h3>
          <p className="text-sm text-center">{profile.companyInfo}</p>
        </div>
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
                {getIcon(link.icon || 'Link')}
                <span>{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
