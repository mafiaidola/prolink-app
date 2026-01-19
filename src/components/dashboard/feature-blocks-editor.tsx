'use client';

import { useState } from 'react';
import { Profile, SocialLink, SocialPlatform, EnabledBlocks } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Eye, Share2, MessageSquare, Trash2, PlusCircle,
    Instagram, Twitter, Facebook, Linkedin, Youtube, Github,
    Send as Telegram, MessageCircle, Music2
} from 'lucide-react';

const socialPlatforms: { value: SocialPlatform; label: string; icon: React.ReactNode }[] = [
    { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4" /> },
    { value: 'twitter', label: 'Twitter/X', icon: <Twitter className="h-4 w-4" /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube className="h-4 w-4" /> },
    { value: 'github', label: 'GitHub', icon: <Github className="h-4 w-4" /> },
    { value: 'tiktok', label: 'TikTok', icon: <Music2 className="h-4 w-4" /> },
    { value: 'telegram', label: 'Telegram', icon: <Telegram className="h-4 w-4" /> },
    { value: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="h-4 w-4" /> },
    { value: 'spotify', label: 'Spotify', icon: <Music2 className="h-4 w-4" /> },
    { value: 'twitch', label: 'Twitch', icon: <Music2 className="h-4 w-4" /> },
    { value: 'discord', label: 'Discord', icon: <MessageCircle className="h-4 w-4" /> },
    { value: 'pinterest', label: 'Pinterest', icon: <Share2 className="h-4 w-4" /> },
    { value: 'snapchat', label: 'Snapchat', icon: <Share2 className="h-4 w-4" /> },
    { value: 'email', label: 'Email', icon: <MessageSquare className="h-4 w-4" /> },
];

interface FeatureBlocksEditorProps {
    enabledBlocks: EnabledBlocks;
    socialLinks: SocialLink[];
    onEnabledBlocksChange: (blocks: EnabledBlocks) => void;
    onSocialLinksChange: (links: SocialLink[]) => void;
}

export function FeatureBlocksEditor({
    enabledBlocks,
    socialLinks,
    onEnabledBlocksChange,
    onSocialLinksChange,
}: FeatureBlocksEditorProps) {
    const [newPlatform, setNewPlatform] = useState<SocialPlatform>('instagram');
    const [newUrl, setNewUrl] = useState('');

    const handleToggle = (key: keyof EnabledBlocks, value: boolean) => {
        onEnabledBlocksChange({ ...enabledBlocks, [key]: value });
    };

    const addSocialLink = () => {
        if (!newUrl.trim()) return;

        const newLink: SocialLink = {
            id: Date.now().toString(),
            platform: newPlatform,
            url: newUrl.trim(),
        };

        onSocialLinksChange([...socialLinks, newLink]);
        setNewUrl('');
        setNewPlatform('instagram');
    };

    const removeSocialLink = (id: string) => {
        onSocialLinksChange(socialLinks.filter(link => link.id !== id));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Feature Blocks</CardTitle>
                <CardDescription>
                    Enable optional features for this profile. These are modular blocks visitors can interact with.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* View Counter Toggle */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Eye className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-medium">View Counter</p>
                            <p className="text-sm text-muted-foreground">
                                Display a public view count on this profile.
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={enabledBlocks.viewCounter || false}
                        onCheckedChange={(checked) => handleToggle('viewCounter', checked)}
                    />
                </div>

                {/* Social Icons Toggle */}
                <div className="rounded-lg border shadow-sm overflow-hidden">
                    <div className="flex flex-row items-center justify-between p-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Share2 className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="font-medium">Social Icons Grid</p>
                                <p className="text-sm text-muted-foreground">
                                    Show a grid of social media icons.
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={enabledBlocks.socialIcons || false}
                            onCheckedChange={(checked) => handleToggle('socialIcons', checked)}
                        />
                    </div>

                    {/* Social Links Editor - only show if enabled */}
                    {enabledBlocks.socialIcons && (
                        <div className="border-t p-4 bg-muted/30 space-y-4">
                            {/* Existing social links */}
                            {socialLinks.length > 0 && (
                                <div className="space-y-2">
                                    {socialLinks.map((link) => {
                                        const platform = socialPlatforms.find(p => p.value === link.platform);
                                        return (
                                            <div key={link.id} className="flex items-center gap-2 bg-background rounded-lg p-2 border">
                                                <span className="p-1.5 rounded bg-muted">{platform?.icon}</span>
                                                <span className="text-sm font-medium capitalize">{link.platform}</span>
                                                <span className="text-xs text-muted-foreground truncate flex-1">{link.url}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-600"
                                                    onClick={() => removeSocialLink(link.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Add new social link */}
                            <div className="flex items-end gap-2">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-sm font-medium">Platform</label>
                                    <Select value={newPlatform} onValueChange={(val) => setNewPlatform(val as SocialPlatform)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {socialPlatforms.map((platform) => (
                                                <SelectItem key={platform.value} value={platform.value}>
                                                    <span className="flex items-center gap-2">
                                                        {platform.icon}
                                                        {platform.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-[2] space-y-1.5">
                                    <label className="text-sm font-medium">URL</label>
                                    <Input
                                        placeholder="https://instagram.com/yourprofile"
                                        value={newUrl}
                                        onChange={(e) => setNewUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialLink())}
                                    />
                                </div>
                                <Button type="button" variant="outline" onClick={addSocialLink}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Form Toggle */}
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="space-y-0.5">
                            <p className="font-medium">Contact Form</p>
                            <p className="text-sm text-muted-foreground">
                                Allow visitors to send you messages via a contact form.
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={enabledBlocks.contactForm || false}
                        onCheckedChange={(checked) => handleToggle('contactForm', checked)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
