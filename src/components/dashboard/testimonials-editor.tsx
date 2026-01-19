'use client';

import { useState } from 'react';
import { Testimonial, TestimonialsSettings, TestimonialsStyle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
    Quote, Trash2, PlusCircle, Star, GripVertical,
    User, Building, Calendar, Image as ImageIcon
} from 'lucide-react';
import { testimonialStyles } from '@/components/profile/testimonials';

interface TestimonialsEditorProps {
    enabled: boolean;
    testimonials: Testimonial[];
    settings: TestimonialsSettings;
    onEnabledChange: (enabled: boolean) => void;
    onTestimonialsChange: (testimonials: Testimonial[]) => void;
    onSettingsChange: (settings: TestimonialsSettings) => void;
}

export function TestimonialsEditor({
    enabled,
    testimonials,
    settings,
    onEnabledChange,
    onTestimonialsChange,
    onSettingsChange,
}: TestimonialsEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
        name: '',
        text: '',
    });

    const addTestimonial = () => {
        if (!newTestimonial.name?.trim() || !newTestimonial.text?.trim()) return;

        const testimonial: Testimonial = {
            id: Date.now().toString(),
            name: newTestimonial.name.trim(),
            text: newTestimonial.text.trim(),
            title: newTestimonial.title?.trim(),
            company: newTestimonial.company?.trim(),
            avatarUrl: newTestimonial.avatarUrl?.trim(),
            rating: newTestimonial.rating,
            date: newTestimonial.date?.trim(),
        };

        onTestimonialsChange([...testimonials, testimonial]);
        setNewTestimonial({ name: '', text: '' });
    };

    const removeTestimonial = (id: string) => {
        onTestimonialsChange(testimonials.filter((t) => t.id !== id));
    };

    const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
        onTestimonialsChange(
            testimonials.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
    };

    const updateSettings = (key: keyof TestimonialsSettings, value: unknown) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Quote className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <CardTitle>Testimonials</CardTitle>
                            <CardDescription>
                                Showcase reviews and testimonials from clients
                            </CardDescription>
                        </div>
                    </div>
                    <Switch checked={enabled} onCheckedChange={onEnabledChange} />
                </div>
            </CardHeader>

            {enabled && (
                <CardContent className="space-y-6">
                    {/* Display Settings */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Display Settings
                        </h4>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Section Title</Label>
                                <Input
                                    placeholder="What People Say"
                                    value={settings.title || ''}
                                    onChange={(e) => updateSettings('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Style</Label>
                                <Select
                                    value={settings.style || 'carousel'}
                                    onValueChange={(val) => updateSettings('style', val as TestimonialsStyle)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {testimonialStyles.map((style) => (
                                            <SelectItem key={style.value} value={style.value}>
                                                <div className="flex flex-col">
                                                    <span>{style.label}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {style.description}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="show-ratings"
                                    checked={settings.showRatings || false}
                                    onCheckedChange={(checked) => updateSettings('showRatings', checked)}
                                />
                                <Label htmlFor="show-ratings">Show Ratings</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="show-avatars"
                                    checked={settings.showAvatars || false}
                                    onCheckedChange={(checked) => updateSettings('showAvatars', checked)}
                                />
                                <Label htmlFor="show-avatars">Show Avatars</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    id="show-dates"
                                    checked={settings.showDates || false}
                                    onCheckedChange={(checked) => updateSettings('showDates', checked)}
                                />
                                <Label htmlFor="show-dates">Show Dates</Label>
                            </div>
                        </div>

                        {(settings.style === 'carousel' || settings.style === 'quotes' || settings.style === 'minimal') && (
                            <div className="space-y-3 p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id="auto-rotate"
                                        checked={settings.autoRotate || false}
                                        onCheckedChange={(checked) => updateSettings('autoRotate', checked)}
                                    />
                                    <Label htmlFor="auto-rotate">Auto-rotate</Label>
                                </div>
                                {settings.autoRotate && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">
                                            Rotate Interval: {settings.rotateInterval || 5}s
                                        </Label>
                                        <Slider
                                            min={3}
                                            max={15}
                                            step={1}
                                            value={[settings.rotateInterval || 5]}
                                            onValueChange={([val]) => updateSettings('rotateInterval', val)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Existing Testimonials */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Quote className="h-4 w-4" />
                            Testimonials ({testimonials.length})
                        </h4>

                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="p-4 rounded-lg border bg-card"
                            >
                                {editingId === testimonial.id ? (
                                    <div className="space-y-3">
                                        <div className="grid gap-3 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Name *</Label>
                                                <Input
                                                    value={testimonial.name}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Rating</Label>
                                                <Select
                                                    value={(testimonial.rating || 0).toString()}
                                                    onValueChange={(val) => updateTestimonial(testimonial.id, { rating: parseInt(val) || undefined })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="No rating" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">No rating</SelectItem>
                                                        <SelectItem value="5">⭐⭐⭐⭐⭐ 5 stars</SelectItem>
                                                        <SelectItem value="4">⭐⭐⭐⭐ 4 stars</SelectItem>
                                                        <SelectItem value="3">⭐⭐⭐ 3 stars</SelectItem>
                                                        <SelectItem value="2">⭐⭐ 2 stars</SelectItem>
                                                        <SelectItem value="1">⭐ 1 star</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Title/Role</Label>
                                                <Input
                                                    placeholder="CEO, Designer, etc."
                                                    value={testimonial.title || ''}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { title: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Company</Label>
                                                <Input
                                                    placeholder="Company name"
                                                    value={testimonial.company || ''}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { company: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Avatar URL</Label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={testimonial.avatarUrl || ''}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { avatarUrl: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Date</Label>
                                                <Input
                                                    placeholder="Jan 2024"
                                                    value={testimonial.date || ''}
                                                    onChange={(e) => updateTestimonial(testimonial.id, { date: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Testimonial Text *</Label>
                                            <Textarea
                                                value={testimonial.text}
                                                onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                                                rows={3}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Done Editing
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3">
                                        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{testimonial.name}</span>
                                                {testimonial.rating && (
                                                    <span className="text-yellow-500 text-xs">
                                                        {'⭐'.repeat(testimonial.rating)}
                                                    </span>
                                                )}
                                            </div>
                                            {(testimonial.title || testimonial.company) && (
                                                <p className="text-xs text-muted-foreground">
                                                    {testimonial.title}
                                                    {testimonial.title && testimonial.company && ' at '}
                                                    {testimonial.company}
                                                </p>
                                            )}
                                            <p className="text-sm mt-1 line-clamp-2">&ldquo;{testimonial.text}&rdquo;</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditingId(testimonial.id)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500"
                                                onClick={() => removeTestimonial(testimonial.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Separator />

                    {/* Add New Testimonial */}
                    <div className="space-y-4 p-4 rounded-lg border border-dashed">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            Add New Testimonial
                        </h4>

                        <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-1">
                                <Label className="text-xs">Name *</Label>
                                <Input
                                    placeholder="John Doe"
                                    value={newTestimonial.name || ''}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Rating</Label>
                                <Select
                                    value={(newTestimonial.rating || 0).toString()}
                                    onValueChange={(val) => setNewTestimonial({ ...newTestimonial, rating: parseInt(val) || undefined })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">No rating</SelectItem>
                                        <SelectItem value="5">⭐⭐⭐⭐⭐ 5 stars</SelectItem>
                                        <SelectItem value="4">⭐⭐⭐⭐ 4 stars</SelectItem>
                                        <SelectItem value="3">⭐⭐⭐ 3 stars</SelectItem>
                                        <SelectItem value="2">⭐⭐ 2 stars</SelectItem>
                                        <SelectItem value="1">⭐ 1 star</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Title/Role (optional)</Label>
                                <Input
                                    placeholder="CEO, Designer, etc."
                                    value={newTestimonial.title || ''}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Company (optional)</Label>
                                <Input
                                    placeholder="Company name"
                                    value={newTestimonial.company || ''}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, company: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs">Testimonial Text *</Label>
                            <Textarea
                                placeholder="What they said about you..."
                                value={newTestimonial.text || ''}
                                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={addTestimonial}
                            disabled={!newTestimonial.name?.trim() || !newTestimonial.text?.trim()}
                        >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Testimonial
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
