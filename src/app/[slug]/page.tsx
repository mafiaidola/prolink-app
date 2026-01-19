import { getProfileBySlug, getHomepageContent } from '@/lib/data';
import { notFound } from 'next/navigation';
import { AnimatedBackground } from '@/components/profile/animated-background';
import { ProfileCard } from '@/components/profile/profile-card';
import { LanguageSwitcher } from '@/components/profile/language-switcher';
import { ViewCounter } from '@/components/profile/view-counter';
import { SocialIconsGrid } from '@/components/profile/social-icons-grid';
import { ContactForm } from '@/components/profile/contact-form';
import { trackPageView } from '@/lib/analytics-actions';
import { headers } from 'next/headers';
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await getProfileBySlug(params.slug);
  const content = await getHomepageContent();

  if (!profile) {
    return { title: 'Profile Not Found' };
  }

  // Use a fallback for the description if profile.content is not available or the first block is not text
  const description = profile.content?.find(c => c.type === 'text')?.text || profile.jobTitle || 'A professional profile.';

  // Use cover photo or logo for OG image
  const ogImage = profile.coverUrl || profile.logoUrl;

  return {
    title: `${profile.name} | ${content.title}`,
    description: description,
    // OG meta tags for rich link previews
    openGraph: {
      title: profile.name,
      description: profile.jobTitle || description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: profile.name }] : [],
      type: 'profile',
      siteName: content.title,
    },
    // Twitter card
    twitter: {
      card: 'summary_large_image',
      title: profile.name,
      description: profile.jobTitle || description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const profile = await getProfileBySlug(params.slug);

  if (!profile || !profile.isPublished) {
    notFound();
  }

  // Track page view (fire and forget, don't block rendering)
  const headersList = await headers();
  const referrer = headersList.get('referer') || '';
  const userAgent = headersList.get('user-agent') || '';
  const forwardedFor = headersList.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0] || '127.0.0.1';

  // Fire tracking asynchronously
  trackPageView(profile.id, referrer, userAgent, ip).catch(console.error);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 gap-6">
      <AnimatedBackground type={profile.animatedBackground} />

      {/* View counter - top left */}
      {profile.enabledBlocks?.viewCounter && profile.viewCount !== undefined && (
        <div className="absolute top-4 left-4 z-20">
          <ViewCounter count={profile.viewCount} />
        </div>
      )}

      {/* Language switcher - top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main profile card */}
      <ProfileCard profile={profile} />

      {/* Social icons grid - below profile card */}
      {profile.enabledBlocks?.socialIcons && profile.socialLinks && profile.socialLinks.length > 0 && (
        <div className="z-10 mt-4">
          <SocialIconsGrid socialLinks={profile.socialLinks} size="md" />
        </div>
      )}

      {/* Contact form - below social icons */}
      {profile.enabledBlocks?.contactForm && (
        <div className="z-10 mt-4 w-full max-w-md">
          <ContactForm profileId={profile.id} profileName={profile.name} />
        </div>
      )}
    </main>
  );
}
