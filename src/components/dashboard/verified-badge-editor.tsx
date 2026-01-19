'use client';

import React from 'react';
import { VerifiedBadgeSettings } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    BadgeCheck, CheckCircle, CheckCircle2, ShieldCheck, CircleCheck,
    Star, Sparkles, Award, Trophy, Medal,
    Crown, Gem, Diamond, Shield, ShieldPlus,
    Flame, Zap, Heart, ThumbsUp, Verified,
    Hexagon, Target, Eye, Sun, Moon
} from 'lucide-react';

// Available icons for verified badge
export const verifiedIcons = [
    { name: 'BadgeCheck', icon: BadgeCheck, label: 'Badge Check' },
    { name: 'CheckCircle', icon: CheckCircle, label: 'Check Circle' },
    { name: 'CheckCircle2', icon: CheckCircle2, label: 'Check Circle 2' },
    { name: 'ShieldCheck', icon: ShieldCheck, label: 'Shield Check' },
    { name: 'CircleCheck', icon: CircleCheck, label: 'Circle Check' },
    { name: 'Verified', icon: Verified, label: 'Verified' },
    { name: 'Star', icon: Star, label: 'Star' },
    { name: 'Sparkles', icon: Sparkles, label: 'Sparkles' },
    { name: 'Award', icon: Award, label: 'Award' },
    { name: 'Trophy', icon: Trophy, label: 'Trophy' },
    { name: 'Medal', icon: Medal, label: 'Medal' },
    { name: 'Crown', icon: Crown, label: 'Crown' },
    { name: 'Gem', icon: Gem, label: 'Gem' },
    { name: 'Diamond', icon: Diamond, label: 'Diamond' },
    { name: 'Shield', icon: Shield, label: 'Shield' },
    { name: 'ShieldPlus', icon: ShieldPlus, label: 'Shield Plus' },
    { name: 'Flame', icon: Flame, label: 'Flame' },
    { name: 'Zap', icon: Zap, label: 'Zap' },
    { name: 'Heart', icon: Heart, label: 'Heart' },
    { name: 'ThumbsUp', icon: ThumbsUp, label: 'Thumbs Up' },
    { name: 'Hexagon', icon: Hexagon, label: 'Hexagon' },
    { name: 'Target', icon: Target, label: 'Target' },
    { name: 'Eye', icon: Eye, label: 'Eye' },
    { name: 'Sun', icon: Sun, label: 'Sun' },
    { name: 'Moon', icon: Moon, label: 'Moon' },
];

// Preset colors for quick selection
const presetColors = [
    { color: '#3b82f6', label: 'Blue' },
    { color: '#22c55e', label: 'Green' },
    { color: '#f59e0b', label: 'Gold' },
    { color: '#ef4444', label: 'Red' },
    { color: '#8b5cf6', label: 'Purple' },
    { color: '#ec4899', label: 'Pink' },
    { color: '#06b6d4', label: 'Cyan' },
    { color: '#f97316', label: 'Orange' },
    { color: '#ffffff', label: 'White' },
    { color: '#000000', label: 'Black' },
];

// Get icon component by name
export function getIconByName(name: string) {
    const iconData = verifiedIcons.find(i => i.name === name);
    return iconData?.icon || BadgeCheck;
}

// Size classes mapping
const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
};

interface VerifiedBadgeEditorProps {
    settings: VerifiedBadgeSettings | undefined;
    onChange: (settings: VerifiedBadgeSettings) => void;
}

export function VerifiedBadgeEditor({ settings, onChange }: VerifiedBadgeEditorProps) {
    const currentSettings: VerifiedBadgeSettings = settings || {
        enabled: false,
        icon: 'BadgeCheck',
        color: '#3b82f6',
        size: 'md',
    };

    const updateSettings = (updates: Partial<VerifiedBadgeSettings>) => {
        onChange({ ...currentSettings, ...updates });
    };

    const selectedIcon = getIconByName(currentSettings.icon);
    const SelectedIconComponent = selectedIcon;

    return (
        <div className="rounded-xl border bg-card p-6 space-y-6">
            {/* Header with toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BadgeCheck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Verified Badge</h3>
                        <p className="text-sm text-muted-foreground">
                            Customize your profile verification badge
                        </p>
                    </div>
                </div>
                <Switch
                    checked={currentSettings.enabled}
                    onCheckedChange={(enabled) => updateSettings({ enabled })}
                />
            </div>

            {currentSettings.enabled && (
                <>
                    {/* Preview */}
                    <div className="p-4 rounded-lg bg-muted/50 flex items-center justify-center gap-3">
                        <span className="font-semibold text-lg">Your Name</span>
                        <SelectedIconComponent
                            className={sizeClasses[currentSettings.size]}
                            style={{ color: currentSettings.color }}
                        />
                    </div>

                    {/* Icon Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Choose Icon</Label>
                        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {verifiedIcons.map(({ name, icon: Icon, label }) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => updateSettings({ icon: name })}
                                    title={label}
                                    className={`
                                        p-2 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                                        ${currentSettings.icon === name
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                            : 'border-transparent bg-muted hover:bg-muted/80'
                                        }
                                    `}
                                >
                                    <Icon
                                        className="w-5 h-5"
                                        style={{ color: currentSettings.icon === name ? currentSettings.color : undefined }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Icon Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {presetColors.map(({ color, label }) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => updateSettings({ color })}
                                    title={label}
                                    className={`
                                        w-8 h-8 rounded-full border-2 transition-all duration-200
                                        ${currentSettings.color === color
                                            ? 'border-blue-500 ring-2 ring-blue-500/30'
                                            : 'border-muted hover:border-muted-foreground/50'
                                        }
                                    `}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <div className="flex items-center gap-2 ml-2">
                                <Label className="text-xs text-muted-foreground">Custom:</Label>
                                <Input
                                    type="color"
                                    value={currentSettings.color}
                                    onChange={(e) => updateSettings({ color: e.target.value })}
                                    className="w-10 h-8 p-0 border-0 cursor-pointer"
                                />
                                <Input
                                    type="text"
                                    value={currentSettings.color}
                                    onChange={(e) => updateSettings({ color: e.target.value })}
                                    placeholder="#3b82f6"
                                    className="w-24 h-8 text-xs font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Badge Size</Label>
                        <Select
                            value={currentSettings.size}
                            onValueChange={(size: 'sm' | 'md' | 'lg') => updateSettings({ size })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sm">Small</SelectItem>
                                <SelectItem value="md">Medium</SelectItem>
                                <SelectItem value="lg">Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            )}
        </div>
    );
}
