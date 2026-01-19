'use client';

import { Eye } from 'lucide-react';

interface ViewCounterProps {
    count: number;
    theme?: 'light' | 'dark' | 'auto';
    size?: 'sm' | 'md' | 'lg';
}

export function ViewCounter({ count, theme = 'auto', size = 'md' }: ViewCounterProps) {
    // Format large numbers (e.g., 1234 -> 1.2K)
    const formatCount = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toLocaleString();
    };

    const sizeClasses = {
        sm: 'text-xs gap-1',
        md: 'text-sm gap-1.5',
        lg: 'text-base gap-2',
    };

    const iconSizes = {
        sm: 12,
        md: 14,
        lg: 16,
    };

    return (
        <div
            className={`
        inline-flex items-center ${sizeClasses[size]}
        px-3 py-1.5 rounded-full
        bg-white/10 backdrop-blur-sm
        text-white/80 font-medium
        border border-white/20
        transition-all duration-300
        hover:bg-white/20 hover:border-white/30
      `}
        >
            <Eye size={iconSizes[size]} className="opacity-70" />
            <span>{formatCount(count)}</span>
            <span className="opacity-60">views</span>
        </div>
    );
}
