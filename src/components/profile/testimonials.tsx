'use client';

import { useState, useEffect } from 'react';
import { Testimonial, TestimonialsSettings, TestimonialsStyle } from '@/lib/types';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

interface TestimonialsProps {
    testimonials: Testimonial[];
    settings?: TestimonialsSettings;
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-400'
                        }`}
                />
            ))}
        </div>
    );
}

// Single testimonial card
function TestimonialCard({
    testimonial,
    showRating = true,
    showAvatar = true,
    showDate = false,
    variant = 'default',
}: {
    testimonial: Testimonial;
    showRating?: boolean;
    showAvatar?: boolean;
    showDate?: boolean;
    variant?: 'default' | 'minimal' | 'quote';
}) {
    if (variant === 'minimal') {
        return (
            <div className="text-center py-4">
                <p className="text-white/90 italic mb-3">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="text-white/70 text-sm font-medium">— {testimonial.name}</p>
            </div>
        );
    }

    if (variant === 'quote') {
        return (
            <div className="text-center py-6 px-4">
                <Quote className="w-10 h-10 text-purple-400/50 mx-auto mb-4" />
                <p className="text-xl text-white/90 italic mb-4 leading-relaxed">
                    &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex flex-col items-center gap-2">
                    {showAvatar && testimonial.avatarUrl && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                            <Image
                                src={testimonial.avatarUrl}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <p className="text-white font-semibold">{testimonial.name}</p>
                        {(testimonial.title || testimonial.company) && (
                            <p className="text-white/60 text-sm">
                                {testimonial.title}
                                {testimonial.title && testimonial.company && ' at '}
                                {testimonial.company}
                            </p>
                        )}
                    </div>
                    {showRating && testimonial.rating && (
                        <StarRating rating={testimonial.rating} />
                    )}
                </div>
            </div>
        );
    }

    // Default card style
    return (
        <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-start gap-3">
                {showAvatar && testimonial.avatarUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                        <Image
                            src={testimonial.avatarUrl}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <div>
                            <p className="text-white font-medium truncate">{testimonial.name}</p>
                            {(testimonial.title || testimonial.company) && (
                                <p className="text-white/60 text-xs truncate">
                                    {testimonial.title}
                                    {testimonial.title && testimonial.company && ' at '}
                                    {testimonial.company}
                                </p>
                            )}
                        </div>
                        {showRating && testimonial.rating && (
                            <StarRating rating={testimonial.rating} />
                        )}
                    </div>
                </div>
            </div>
            <p className="text-white/80 text-sm mt-3 leading-relaxed">
                &ldquo;{testimonial.text}&rdquo;
            </p>
            {showDate && testimonial.date && (
                <p className="text-white/40 text-xs mt-2">{testimonial.date}</p>
            )}
        </div>
    );
}

// Carousel style
function CarouselStyle({
    testimonials,
    settings,
}: {
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate
    useEffect(() => {
        if (!settings.autoRotate) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, (settings.rotateInterval || 5) * 1000);
        return () => clearInterval(interval);
    }, [settings.autoRotate, settings.rotateInterval, testimonials.length]);

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const goPrev = () =>
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                            <TestimonialCard
                                testimonial={testimonial}
                                showRating={settings.showRatings}
                                showAvatar={settings.showAvatars}
                                showDate={settings.showDates}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {testimonials.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    {/* Dots indicator */}
                    <div className="flex justify-center gap-2 mt-4">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Grid style
function GridStyle({
    testimonials,
    settings,
}: {
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
                <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    showRating={settings.showRatings}
                    showAvatar={settings.showAvatars}
                    showDate={settings.showDates}
                />
            ))}
        </div>
    );
}

// Stack style
function StackStyle({
    testimonials,
    settings,
}: {
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
}) {
    return (
        <div className="space-y-4">
            {testimonials.map((testimonial) => (
                <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    showRating={settings.showRatings}
                    showAvatar={settings.showAvatars}
                    showDate={settings.showDates}
                />
            ))}
        </div>
    );
}

// Quotes style (large centered quote)
function QuotesStyle({
    testimonials,
    settings,
}: {
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate
    useEffect(() => {
        if (!settings.autoRotate) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, (settings.rotateInterval || 5) * 1000);
        return () => clearInterval(interval);
    }, [settings.autoRotate, settings.rotateInterval, testimonials.length]);

    return (
        <div className="relative">
            <TestimonialCard
                testimonial={testimonials[currentIndex]}
                showRating={settings.showRatings}
                showAvatar={settings.showAvatars}
                variant="quote"
            />
            {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Minimal style
function MinimalStyle({
    testimonials,
    settings,
}: {
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate
    useEffect(() => {
        if (!settings.autoRotate) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, (settings.rotateInterval || 5) * 1000);
        return () => clearInterval(interval);
    }, [settings.autoRotate, settings.rotateInterval, testimonials.length]);

    return (
        <div className="relative">
            <TestimonialCard
                testimonial={testimonials[currentIndex]}
                variant="minimal"
            />
            {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Main Testimonials component
export function Testimonials({ testimonials, settings = {} }: TestimonialsProps) {
    if (!testimonials || testimonials.length === 0) return null;

    const title = settings.title || 'What People Say';
    const style = settings.style || 'carousel';

    const renderStyle = () => {
        switch (style) {
            case 'grid':
                return <GridStyle testimonials={testimonials} settings={settings} />;
            case 'stack':
                return <StackStyle testimonials={testimonials} settings={settings} />;
            case 'quotes':
                return <QuotesStyle testimonials={testimonials} settings={settings} />;
            case 'minimal':
                return <MinimalStyle testimonials={testimonials} settings={settings} />;
            case 'carousel':
            default:
                return <CarouselStyle testimonials={testimonials} settings={settings} />;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <h3 className="text-xl font-semibold text-white mb-6 text-center">
                    {title}
                </h3>
                {renderStyle()}
            </div>
        </div>
    );
}

// Style options for the editor
export const testimonialStyles: { value: TestimonialsStyle; label: string; description: string }[] = [
    { value: 'carousel', label: 'Carousel', description: 'Horizontal sliding cards' },
    { value: 'grid', label: 'Grid', description: '2-3 column layout' },
    { value: 'stack', label: 'Stack', description: 'Vertical stacked cards' },
    { value: 'quotes', label: 'Quotes', description: 'Large centered quote' },
    { value: 'minimal', label: 'Minimal', description: 'Simple text only' },
];
