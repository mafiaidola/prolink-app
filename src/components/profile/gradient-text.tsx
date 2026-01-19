'use client';

import { NameGradient } from '@/lib/types';

// Gradient preset definitions
const gradientPresets: Record<NameGradient, { gradient: string; animated?: boolean }> = {
    none: {
        gradient: 'inherit',
    },
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
        relative p-3 rounded-lg border-2 transition-all duration-200
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
          text-sm font-semibold capitalize
          ${isNone ? 'text-muted-foreground' : 'text-white drop-shadow-md'}
        `}
            >
                {gradient === 'none' ? 'No Gradient' : gradient}
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

// All gradient options for the selector
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
];
