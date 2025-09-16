'use client';

import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductSliderBlock as ProductSliderBlockType } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function ProductSlider({ block, selectedTheme }: { block: ProductSliderBlockType, selectedTheme: any }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  
  const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!block.slides || block.slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-6">
        {block.title && <h3 className={cn('text-lg font-headline mb-4', selectedTheme.cardTitle)}>{block.title}</h3>}
        <div className="overflow-hidden relative" ref={emblaRef}>
            <div className="flex">
                {block.slides.map((slide) => (
                    <div className="flex-grow-0 flex-shrink-0 basis-full min-w-0" key={slide.id}>
                        <div className={cn('mx-2 rounded-lg overflow-hidden border', selectedTheme.separator ? `border-[${selectedTheme.separator}]` : 'border-border' )}>
                            <div className="relative aspect-video w-full">
                                <Image src={slide.imageUrl} alt={slide.title} layout="fill" objectFit="cover" />
                            </div>
                            <div className="p-4">
                                <h4 className={cn('font-bold', selectedTheme.cardTitle)}>{slide.title}</h4>
                                <p className={cn('text-sm mt-1', selectedTheme.cardDescription)}>{slide.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {emblaApi && block.slides.length > 1 && (
                <>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                        onClick={scrollPrev}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                         variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                        onClick={scrollNext}
                    >
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </>
            )}
        </div>
    </div>
  );
}
