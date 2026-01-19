'use client';

import { NameGradient } from '@/lib/types';

// Animation types for different gradient effects
type AnimationType = 'shift' | 'shimmer' | 'pulse' | 'flow' | 'wave' | 'none';

// Gradient preset definitions - 25 total presets with varied animations
const gradientPresets: Record<NameGradient, { gradient: string; animation: AnimationType }> = {
    none: {
        gradient: 'inherit',
        animation: 'none',
    },
    // Classic animated presets
    sunset: {
        gradient: 'linear-gradient(90deg, #f97316, #ec4899, #a855f7, #f97316)',
        animation: 'shimmer',
    },
    ocean: {
        gradient: 'linear-gradient(90deg, #06b6d4, #3b82f6, #6366f1, #06b6d4)',
        animation: 'flow',
    },
    neon: {
        gradient: 'linear-gradient(90deg, #ec4899, #eab308, #06b6d4, #ec4899)',
        animation: 'pulse',
    },
    gold: {
        gradient: 'linear-gradient(90deg, #fbbf24, #f59e0b, #ea580c, #fbbf24)',
        animation: 'shimmer',
    },
    aurora: {
        gradient: 'linear-gradient(90deg, #22c55e, #06b6d4, #a855f7, #22c55e)',
        animation: 'wave',
    },
    fire: {
        gradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #ef4444)',
        animation: 'pulse',
    },
    royal: {
        gradient: 'linear-gradient(90deg, #a855f7, #3b82f6, #ec4899, #a855f7)',
        animation: 'shimmer',
    },
    matrix: {
        gradient: 'linear-gradient(90deg, #166534, #22c55e, #4ade80, #166534)',
        animation: 'flow',
    },
    // Dramatic new presets
    candy: {
        gradient: 'linear-gradient(90deg, #ec4899, #8b5cf6, #06b6d4, #ec4899)',
        animation: 'wave',
    },
    cyber: {
        gradient: 'linear-gradient(90deg, #06b6d4, #d946ef, #facc15, #06b6d4)',
        animation: 'pulse',
    },
    nature: {
        gradient: 'linear-gradient(90deg, #22c55e, #14b8a6, #0ea5e9, #22c55e)',
        animation: 'flow',
    },
    cherry: {
        gradient: 'linear-gradient(90deg, #dc2626, #f43f5e, #fb7185, #dc2626)',
        animation: 'shimmer',
    },
    midnight: {
        gradient: 'linear-gradient(90deg, #1e3a8a, #7c3aed, #c084fc, #1e3a8a)',
        animation: 'pulse',
    },
    bronze: {
        gradient: 'linear-gradient(90deg, #92400e, #d97706, #fbbf24, #92400e)',
        animation: 'shimmer',
    },
    silver: {
        gradient: 'linear-gradient(90deg, #6b7280, #e5e7eb, #9ca3af, #6b7280)',
        animation: 'shimmer',
    },
    rainbow: {
        gradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ef4444)',
        animation: 'wave',
    },
    peach: {
        gradient: 'linear-gradient(90deg, #fda4af, #fb923c, #fbbf24, #fda4af)',
        animation: 'shimmer',
    },
    mint: {
        gradient: 'linear-gradient(90deg, #6ee7b7, #2dd4bf, #22d3ee, #6ee7b7)',
        animation: 'flow',
    },
    lavender: {
        gradient: 'linear-gradient(90deg, #c4b5fd, #a78bfa, #f0abfc, #c4b5fd)',
        animation: 'shimmer',
    },
    coral: {
        gradient: 'linear-gradient(90deg, #fb7185, #f97316, #ec4899, #fb7185)',
        animation: 'pulse',
    },
    // NEW 4 presets for 25 total
    electric: {
        gradient: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f97316, #3b82f6)',
        animation: 'pulse',
    },
    plasma: {
        gradient: 'linear-gradient(90deg, #d946ef, #f43f5e, #fb923c, #d946ef)',
        animation: 'wave',
    },
    emerald: {
        gradient: 'linear-gradient(90deg, #059669, #10b981, #34d399, #059669)',
        animation: 'shimmer',
    },
    cosmic: {
        gradient: 'linear-gradient(90deg, #1e1b4b, #581c87, #9333ea, #c084fc, #1e1b4b)',
        animation: 'flow',
    },
};

// Map animation type to CSS class
function getAnimationClass(animation: AnimationType): string {
    switch (animation) {
        case 'shift': return 'animate-gradient-shift';
        case 'shimmer': return 'animate-gradient-shimmer';
        case 'pulse': return 'animate-gradient-pulse';
        case 'flow': return 'animate-gradient-flow';
        case 'wave': return 'animate-gradient-wave';
        default: return '';
    }
}

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

    const animationClass = getAnimationClass(preset.animation);

    const gradientStyle: React.CSSProperties = {
        background: preset.gradient,
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    };

    return (
        <Component
            className={`${className} ${animationClass}`}
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
    const animationClass = !isNone ? getAnimationClass(preset.animation) : '';

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        relative p-2 rounded-lg border-2 transition-all duration-200 min-w-[65px]
        ${selected
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-transparent hover:border-muted-foreground/30'
                }
        ${isNone ? 'bg-muted' : animationClass}
      `}
            style={
                isNone
                    ? {}
                    : {
                        background: preset.gradient,
                        backgroundSize: '300% 300%',
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

// All gradient options for the selector - 25 total
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
    'electric',
    'plasma',
    'emerald',
    'cosmic',
];
