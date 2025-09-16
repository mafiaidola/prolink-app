'use client';
import { LogoCarouselBlock as LogoCarouselBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function LogoCarousel({ block, selectedTheme }: { block: LogoCarouselBlockType; selectedTheme: any }) {
  if (!block.logos || block.logos.length === 0) return null;

  // Duplicate logos to create a seamless loop effect
  const extendedLogos = [...block.logos, ...block.logos, ...block.logos];

  return (
    <div className="w-full mt-6">
      <style jsx>{`
        .scroller {
          max-width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
        }
        .scroller__inner {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          animation: scroll 40s linear infinite;
        }
        @keyframes scroll {
          to {
            transform: translate(calc(-50% - 0.75rem));
          }
        }
        .logo-item {
          flex-shrink: 0;
        }
      `}</style>
      {block.title && <h3 className={cn('text-lg font-headline mb-4 text-center', selectedTheme.cardTitle)}>{block.title}</h3>}
      <div className="scroller">
        <div className="scroller__inner">
          {extendedLogos.map((logo, index) => (
            <div key={`${logo.id}-${index}`} className="logo-item flex justify-center items-center h-16">
              <Image
                src={logo.imageUrl}
                alt={logo.alt}
                width={100}
                height={64}
                className="object-contain max-h-16 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all"
                style={{
                    filter: selectedTheme.card.includes('dark') || selectedTheme.card.includes('bg-black') ? 'brightness(0) invert(1)' : 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
