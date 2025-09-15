import { getProfileBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { AnimatedBackground } from '@/components/profile/animated-background';
import { ProfileCard } from '@/components/profile/profile-card';
import { LanguageSwitcher } from '@/components/profile/language-switcher';
import Link from 'next/link';
import { Icons } from '@/components/icons';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
    const profile = await getProfileBySlug(params.slug);
    if (!profile) {
      return { title: 'Profile Not Found' };
    }
    return {
      title: `${profile.name} | ProLink`,
      description: profile.bio,
    };
  }

export default async function ProfilePage({ params }: Props) {
  const profile = await getProfileBySlug(params.slug);

  if (!profile || !profile.isPublished) {
    notFound();
  }

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4">
        <AnimatedBackground type={profile.animatedBackground} />
        
        <div className="absolute top-4 right-4 z-20">
            <LanguageSwitcher />
        </div>
        
        <ProfileCard profile={profile} />

    </main>
  );
}
