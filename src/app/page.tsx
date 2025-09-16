import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getHomepageContent } from '@/lib/data';

export default async function Home() {
  const content = await getHomepageContent();
  
  const getIcon = (name: string) => {
    const Icon = (LucideIcons as any)[name];
    return Icon ? <Icon className="h-8 w-8 text-primary" /> : <LucideIcons.HelpCircle className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <Image
            src={content.heroImageUrl || "https://picsum.photos/seed/prolink-hero/1200/800"}
            alt="Abstract background with purple and pink gradients representing digital connections."
            fill
            className="object-cover z-0"
            data-ai-hint="abstract gradient"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
          <div className="container relative z-20 px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {content.title}
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                  {content.subtitle}
                </p>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                  {content.description}
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" asChild>
                  <Link href={content.heroButton1Link || '/dashboard'}>{content.heroButton1Text || 'Get Started'}</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href={content.heroButton2Link || '#'}>{content.heroButton2Text || 'Learn More'}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need in One Place
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ProLink offers a comprehensive suite of tools to build a powerful and personalized digital identity.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-4 mt-12">
              {content.features.map((feature, index) => (
                <Card key={index} className="bg-card/50 hover:bg-card transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                        {getIcon(feature.icon)}
                      </div>
                      <div className="grid gap-1">
                        <h3 className="text-lg font-bold font-headline">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ProLink. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
