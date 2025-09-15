'use client';

import type { Profile, ContentBlock, HeadingBlock, TextBlock, ImageBlock, QuoteBlock, SkillsBlock } from '@/lib/types';
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
import { BadgeCheck, MessageSquare, Download } from 'lucide-react';
import VCard from 'vcard-creator';
import { Progress } from '../ui/progress';

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
    card: 'bg-gray-900/90 text-gray-100 border-teal-500/30 font-mono',
    button: 'secondary',
    separator: 'bg-teal-500/20',
    cardDescription: 'text-gray-400',
    cardTitle: 'text-white',
    linkButton: 'bg-gray-800/80 hover:bg-gray-700/80 text-gray-100'
  },
};

const getIcon = (iconUrl?: string) => {
    if (iconUrl) {
      return (
        <Image
          src={iconUrl}
          alt="icon"
          width={20}
          height={20}
          className="rtl:ml-3 ltr:mr-3 group-hover:animate-pulse"
        />
      );
    }
    return <LucideIcons.Link className="h-5 w-5 rtl:ml-3 ltr:mr-3" />;
};

const VCardButton = ({ profile, theme }: { profile: Profile, theme: any }) => {
    if (!profile.vCard || !profile.vCard.firstName) return null;

    const handleDownload = () => {
        const myVCard = new VCard();
        myVCard
            .addName(profile.vCard?.lastName, profile.vCard?.firstName)
            .addCompany(profile.vCard?.company || '')
            .addJobtitle(profile.vCard?.title || '')
            .addEmail(profile.vCard?.email || '')
            .addPhoneNumber(profile.vCard?.phone || '')
            .addURL(profile.vCard?.website || '');
        
        const vCardString = myVCard.toString();
        const blob = new Blob([vCardString], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${profile.slug}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={handleDownload} variant={theme.button as any} className={cn("w-full justify-center h-12 text-md group", theme.linkButton)}>
            <Download className="h-5 w-5 rtl:ml-3 ltr:mr-3" />
            <span>Save Contact</span>
        </Button>
    );
}


const BlockRenderer = ({ block, selectedTheme }: { block: ContentBlock; selectedTheme: any }) => {
    switch (block.type) {
        case 'heading':
            const HeadingTag = block.level as keyof JSX.IntrinsicElements;
            return <HeadingTag className={cn('font-headline', {
                'text-2xl': HeadingTag === 'h1',
                'text-xl': HeadingTag === 'h2',
                'text-lg': HeadingTag === 'h3',
            }, selectedTheme.cardTitle)}>{block.text}</HeadingTag>;
        case 'text':
            return <p className="text-sm">{block.text}</p>;
        case 'image':
            return <div className="relative aspect-video w-full overflow-hidden rounded-md my-4"><Image src={block.url || ''} alt={block.alt || ''} layout="fill" objectFit="cover" /></div>;
        case 'quote':
            return (
                <blockquote className={cn("border-l-4 pl-4 italic my-4", selectedTheme.separator)}>
                    <p className="flex items-start">
                        <MessageSquare className="w-5 h-5 mr-2 shrink-0" />
                        <span>{block.text}</span>
                    </p>
                    {block.author && <footer className="mt-2 text-sm not-italic">- {block.author}</footer>}
                </blockquote>
            );
        case 'skills':
            const skillsBlock = block as SkillsBlock;
            return (
                <div>
                    <h3 className={cn("text-lg font-headline mb-3", selectedTheme.cardTitle)}>{skillsBlock.title}</h3>
                    <div className="space-y-3">
                        {skillsBlock.skills.map((skill, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span>{skill.name}</span>
                                    <span className={cn("font-mono text-xs", selectedTheme.cardDescription)}>{skill.level}%</span>
                                </div>
                                <Progress value={skill.level} className="h-2" />
                            </div>
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
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
            <div className="flex items-center gap-2">
              <CardTitle className={cn("text-3xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
              {profile.isVerified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
            </div>
            <CardDescription className={cn("text-lg", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="space-y-4">
                {profile.content?.map(block => <BlockRenderer key={block.id} block={block} selectedTheme={selectedTheme} />)}
            </div>

            {(profile.links && profile.links.length > 0 || profile.vCard?.firstName) && (
                <>
                    <Separator className={cn("my-4", selectedTheme.separator)} />
                    <div className="flex flex-col space-y-3">
                        <VCardButton profile={profile} theme={selectedTheme} />
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
                <div className="flex items-center gap-2">
                  <CardTitle className={cn("text-3xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
                  {profile.isVerified && <BadgeCheck className="w-6 h-6 text-blue-500" />}
                </div>
                <CardDescription className={cn("text-lg", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
            </div>
            
            <div className="space-y-4 mt-6 text-center">
                {profile.content?.map(block => <BlockRenderer key={block.id} block={block} selectedTheme={selectedTheme} />)}
            </div>

            {(profile.links && profile.links.length > 0 || profile.vCard?.firstName) && (
                <div className="flex flex-col space-y-3 mt-6">
                    <VCardButton profile={profile} theme={selectedTheme} />
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
        </CardContent>
    </Card>
);

const MinimalistCenterLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <div className="w-full max-w-md mx-auto z-10 flex flex-col items-center justify-center min-h-full text-center p-4">
        <Card className={cn("w-full transition-all duration-300 !bg-transparent !shadow-none !border-none", selectedTheme.card)}>
            <CardHeader className="items-center text-center pt-6">
                <Avatar className={cn("w-28 h-28 mb-4 border-4 shadow-lg", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                    <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2">
                  <CardTitle className={cn("text-4xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
                  {profile.isVerified && <BadgeCheck className="w-7 h-7 text-blue-500" />}
                </div>
                <CardDescription className={cn("text-xl", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
                <div className="space-y-4 pt-2 max-w-sm">
                    {profile.content?.map(block => <BlockRenderer key={block.id} block={block} selectedTheme={selectedTheme} />)}
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                 {(profile.links && profile.links.length > 0 || profile.vCard?.firstName) && (
                    <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
                        <VCardButton profile={profile} theme={selectedTheme} />
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

const ModernSplitLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <Card className={cn("w-full max-w-4xl mx-auto z-10 shadow-2xl transition-all duration-300 overflow-hidden md:grid md:grid-cols-3", selectedTheme.card)}>
        <div className="md:col-span-1 md:border-r md:border-border/50 p-6 flex flex-col items-center text-center">
            {profile.coverUrl && (
                <div className="relative h-24 w-full mb-[-4rem]">
                    <Image src={profile.coverUrl} alt={`${profile.name}'s cover photo`} fill style={{ objectFit: "cover" }} className='rounded-t-lg md:rounded-none' data-ai-hint="background abstract" />
                </div>
            )}
             <Avatar className={cn("w-24 h-24 border-4 shadow-lg shrink-0", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-4">
              <CardTitle className={cn("text-2xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
              {profile.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
            </div>
            <CardDescription className={cn("text-md mt-1", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
            
             {(profile.links && profile.links.length > 0 || profile.vCard?.firstName) && (
                <>
                    <Separator className={cn("my-4 w-full", selectedTheme.separator)} />
                    <div className="flex flex-col space-y-3 w-full">
                        <VCardButton profile={profile} theme={selectedTheme} />
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
        </div>
        <div className="md:col-span-2 p-6 md:p-8">
            <div className="space-y-6">
                 {profile.content?.map(block => <BlockRenderer key={block.id} block={block} selectedTheme={selectedTheme} />)}
            </div>
        </div>
    </Card>
);

const MinimalistLeftAlignLayout = ({ profile, selectedTheme, t }: { profile: Profile; selectedTheme: any; t: any; }) => (
    <Card className={cn("w-full max-w-md mx-auto z-10 shadow-2xl transition-all duration-300", selectedTheme.card)}>
        <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-4">
                <Avatar className={cn("w-16 h-16 border-2 shadow-sm shrink-0", selectedTheme.card.includes('white/10') ? 'border-white/20' : 'border-card')}>
                    <AvatarImage src={profile.logoUrl} alt={profile.name} data-ai-hint="person face" />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <CardTitle className={cn("text-2xl font-headline", selectedTheme.cardTitle)}>{profile.name}</CardTitle>
                        {profile.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
                    </div>
                    <CardDescription className={cn("text-md", selectedTheme.cardDescription)}>{profile.jobTitle}</CardDescription>
                </div>
            </div>
            
            <Separator className={cn("my-6", selectedTheme.separator)} />

            <div className="space-y-4">
                {profile.content?.map(block => <BlockRenderer key={block.id} block={block} selectedTheme={selectedTheme} />)}
            </div>

            {(profile.links && profile.links.length > 0 || profile.vCard?.firstName) && (
                <div className="flex flex-col space-y-3 mt-6">
                    <VCardButton profile={profile} theme={selectedTheme} />
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
            )}
        </CardContent>
    </Card>
);


const layouts = {
    default: DefaultLayout,
    stacked: StackedLayout,
    'minimalist-center': MinimalistCenterLayout,
    'modern-split': ModernSplitLayout,
    'minimalist-left-align': MinimalistLeftAlignLayout,
};

export function ProfileCard({ profile }: { profile: Profile }) {
  const { language } = useApp();
  
  const selectedTheme = themeStyles[profile.theme] || themeStyles.default;
  const t = translations[language];
  const LayoutComponent = layouts[profile.layout] || layouts.default;

  return <LayoutComponent profile={profile} selectedTheme={selectedTheme} t={t} />;
}
