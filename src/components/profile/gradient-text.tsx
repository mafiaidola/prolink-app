'use client';

import { NameGradient } from '@/lib/types';

// Gradient preset definitions - 21 total presets
const gradientPresets: Record<NameGradient, { gradient: string; animated?: boolean }> = {
    none: {
        gradient: 'inherit',
    },
    // Original presets
    sunset: {
        gradient: 'linear-gradient(90deg, #f97316, #ec4899, #a855f7)',
        animated: true,
    },
    ocean: {
        gradient: 'linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1)',
        animated: true,
    },
    neon: {
        gradient: 'linear-gradient(90deg, #ec4899, #eab308, #06b6d4)',
        animated: true,
    },
    gold: {
        gradient: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ea580c)',
        animated: true,
    },
    aurora: {
        gradient: 'linear-gradient(90deg, #22c55e, #06b6d4, #a855f7)',
        animated: true,
    },
    fire: {
        gradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308)',
        animated: true,
    },
    royal: {
        gradient: 'linear-gradient(90deg, #a855f7, #3b82f6, #ec4899)',
        animated: true,
    },
    matrix: {
        gradient: 'linear-gradient(90deg, #166534, #22c55e, #4ade80)',
        animated: true,
    },
    // NEW presets
    candy: {
        gradient: 'linear-gradient(90deg, #ec4899, #8b5cf6, #ec4899)',
        animated: true,
    },
    cyber: {
        gradient: 'linear-gradient(90deg, #06b6d4, #d946ef, #facc15)',
        animated: true,
    },
    nature: {
        gradient: 'linear-gradient(90deg, #22c55e, #14b8a6, #0ea5e9)',
        animated: true,
    },
    cherry: {
        gradient: 'linear-gradient(90deg, #dc2626, #f43f5e, #e11d48)',
        animated: true,
    },
    midnight: {
        gradient: 'linear-gradient(90deg, #1e3a8a, #7c3aed, #1e3a8a)',
        animated: true,
    },
    bronze: {
        gradient: 'linear-gradient(90deg, #92400e, #d97706, #b45309)',
        animated: true,
    },
    silver: {
        gradient: 'linear-gradient(90deg, #6b7280, #d1d5db, #9ca3af)',
        animated: true,
    },
    rainbow: {
        gradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
        animated: true,
    },
    peach: {
        gradient: 'linear-gradient(90deg, #fda4af, #fb923c, #f97316)',
        animated: true,
    },
    mint: {
        gradient: 'linear-gradient(90deg, #6ee7b7, #2dd4bf, #22d3ee)',
        animated: true,
    },
    lavender: {
        gradient: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #f0abfc)',
        animated: true,
    },
    coral: {
        gradient: 'linear-gradient(90deg, #fb7185, #f97316, #ec4899)',
        animated: true,
    },
};

interface GradientTextProps {
    text: string;
    gradient?: NameGradient;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export function GradientText({
    text,
    gradient = 'none',
    className = '',
    as: Component = 'h1',
}: GradientTextProps) {
    const preset = gradientPresets[gradient] || gradientPresets.none;

    // If no gradient, render plain text
    if (gradient === 'none' || !preset.gradient || preset.gradient === 'inherit') {
        return <Component className={className}>{text}</Component>;
    }

    const gradientStyle: React.CSSProperties = {
        background: preset.gradient,
        backgroundSize: preset.animated ? '200% 200%' : 'auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    return (
        <Component
            className={`${className} ${preset.animated ? 'animate-gradient-shift' : ''}`}
            style={gradientStyle}
        >
            {text}
        </Component>
    );
}

// Gradient preview component for the editor
export function GradientPreview({
    gradient,
    selected,
    onClick,
}: {
    gradient: NameGradient;
    selected: boolean;
    onClick: () => void;
}) {
    const preset = gradientPresets[gradient] || gradientPresets.none;
    const isNone = gradient === 'none';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        relative p-2 rounded-lg border-2 transition-all duration-200 min-w-[70px]
        ${selected
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-transparent hover:border-muted-foreground/30'
                }
        ${isNone ? 'bg-muted' : ''}
      `}
            style={
                isNone
                    ? {}
                    : {
                        background: preset.gradient,
                    }
            }
        >
            <span
                className={`
          text-xs font-semibold capitalize
          ${isNone ? 'text-muted-foreground' : 'text-white drop-shadow-md'}
        `}
            >
                {gradient === 'none' ? 'None' : gradient}
            </span>
            {selected && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                </div>
            )}
        </button>
    );
}

// All gradient options for the selector - 21 total
export const gradientOptions: NameGradient[] = [
    'none',
    'sunset',
    'ocean',
    'neon',
    'gold',
    'aurora',
    'fire',
    'royal',
    'matrix',
    // New presets
    'candy',
    'cyber',
    'nature',
    'cherry',
    'midnight',
    'bronze',
    'silver',
    'rainbow',
    'peach',
    'mint',
    'lavender',
    'coral',
];
