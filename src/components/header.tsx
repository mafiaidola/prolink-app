import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { getHomepageContent } from '@/lib/data';
import Image from 'next/image';

export async function Header() {
  const content = await getHomepageContent();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {content.logoUrl ? (
            <Image src={content.logoUrl} alt={content.title} width={24} height={24} className="object-contain" />
          ) : (
            <Icons.Logo className="h-6 w-6 text-primary" />
          )}
          <span className="hidden font-bold sm:inline-block font-headline">
            {content.title}
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end">
          <nav className="flex items-center">
            <Button asChild>
              <Link href="/login">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
