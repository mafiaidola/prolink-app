
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Profile, Theme, AnimatedBackground, ProfileLayout } from '@/lib/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, PlusCircle, Wand2, Loader2, QrCode, Pilcrow, Type, Image as ImageIcon, MessageSquareQuote, GripVertical, BarChart, Check, Paintbrush, Sparkles, LayoutTemplate } from 'lucide-react';
import { createProfile, updateProfile } from '@/lib/profile-actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { suggestProfileFields } from '@/ai/flows/suggest-profile-fields';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { QRCodeDialog } from './qr-code-dialog';
import { Switch } from '@/components/ui/switch';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './sortable-item';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { AnimatedBackground as AnimatedBackgroundPreview } from '@/components/profile/animated-background';


const linkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
});

const skillSchema = z.object({
    name: z.string().min(1, "Skill name is required"),
    level: z.number().min(0).max(100),
});

const contentBlockSchema = z.object({
    id: z.string(),
    type: z.enum(['heading', 'text', 'image', 'quote', 'skills']),
    text: z.string().optional(),
    level: z.enum(['h1', 'h2', 'h3']).optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    author: z.string().optional(),
    title: z.string().optional(), // For skills block
    skills: z.array(skillSchema).optional(),
});

const vCardSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional().or(z.literal('')),
    phone: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    website: z.string().url("Invalid URL").optional().or(z.literal('')),
});


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  jobTitle: z.string().min(2, 'Job title is required'),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  coverUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  content: z.array(contentBlockSchema).optional(),
  links: z.array(linkSchema).optional(),
  vCard: vCardSchema.optional(),
  theme: z.string(),
  animatedBackground: z.string(),
  layout: z.string(),
  isPublished: z.boolean(),
  isVerified: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const themes: Theme[] = ['default', 'modern', 'classic', 'glass', 'neon', 'minimal', 'retro', 'dark', 'corporate', 'artistic', 'tech', 'sunset', 'forest', 'oceanic'];
const backgrounds: AnimatedBackground[] = ['none', 'particles', 'waves', 'stars', 'electric', 'gradient', 'aurora', 'lines', 'cells', 'circles'];
const layouts: ProfileLayout[] = ['default', 'stacked', 'minimalist-center', 'modern-split', 'minimalist-left-align'];

const themePreviews: Record<Theme, { bg: string, text: string }> = {
    default: { bg: 'bg-slate-100', text: 'text-slate-800' },
    modern: { bg: 'bg-white', text: 'text-gray-800' },
    classic: { bg: 'bg-[#FDF6E3]', text: 'text-[#655342]' },
    glass: { bg: 'bg-gray-500/30', text: 'text-white' },
    neon: { bg: 'bg-black', text: 'text-purple-400' },
    minimal: { bg: 'bg-white', text: 'text-black' },
    retro: { bg: 'bg-[#FFDAB9]', text: 'text-[#8B4513]' },
    dark: { bg: 'bg-gray-900', text: 'text-white' },
    corporate: { bg: 'bg-blue-50', text: 'text-blue-900' },
    artistic: { bg: 'bg-gradient-to-br from-yellow-100 to-pink-100', text: 'text-gray-800' },
    tech: { bg: 'bg-gray-900', text: 'text-teal-400' },
    sunset: { bg: 'bg-gradient-to-r from-orange-400 to-rose-400', text: 'text-white' },
    forest: { bg: 'bg-gradient-to-r from-green-500 to-teal-600', text: 'text-white' },
    oceanic: { bg: 'bg-gradient-to-r from-blue-400 to-indigo-500', text: 'text-white' },
};

const layoutPreviews: Record<ProfileLayout, React.ReactNode> = {
    'default': <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="30" r="18"/><rect x="20" y="55" width="60" height="8" rx="4"/><rect x="30" y="70" width="40" height="6" rx="3"/></svg>,
    'stacked': <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="30" r="18"/><rect x="20" y="55" width="60" height="8" rx="4"/><rect x="20" y="70" width="60" height="6" rx="3"/></svg>,
    'minimalist-center': <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor"><circle cx="50" cy="30" r="18"/><rect x="30" y="55" width="40" height="8" rx="4"/><rect x="40" y="70" width="20" height="6" rx="3"/></svg>,
    'modern-split': <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor"><rect x="5" y="5" width="35" height="90" rx="4" /><rect x="45" y="25" width="50" height="8" rx="4" /><rect x="45" y="40" width="50" height="6" rx="3" /><rect x="45" y="55" width="50" height="6" rx="3" /></svg>,
    'minimalist-left-align': <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor"><circle cx="25" cy="25" r="15"/><rect x="10" y="50" width="80" height="8" rx="4"/><rect x="10" y="65" width="60" height="6" rx="3"/></svg>,
};

type ChoiceCardProps<T> = {
    options: T[];
    value: T;
    onChange: (value: T) => void;
    previews: Record<string & T, React.ReactNode>;
    renderType: 'color' | 'layout' | 'animation';
};

function ChoiceCards<T extends string>({ options, value, onChange, previews, renderType }: ChoiceCardProps<T>) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {options.map((option) => {
                const preview = previews[option];
                return (
                    <div
                        key={option}
                        onClick={() => onChange(option)}
                        className={cn(
                            'relative cursor-pointer rounded-lg border-2 bg-card p-3 transition-all duration-200 hover:bg-accent/50',
                            value === option ? 'border-primary shadow-lg' : 'border-border'
                        )}
                    >
                        <div className={cn("h-16 w-full rounded-md flex items-center justify-center overflow-hidden", renderType === 'animation' && option !== 'none' ? 'bg-black' : 'bg-secondary')}>
                             {renderType === 'color' && typeof preview === 'object' && preview && 'bg' in preview && (
                                <div className={cn('w-full h-full flex items-center justify-center', (preview as {bg:string}).bg)}>
                                    <span className={cn('font-bold text-xs', (preview as {text:string}).text)}>Aa</span>
                                </div>
                            )}
                            {renderType === 'layout' && (
                                <div className="w-full h-full flex items-center justify-center p-2 text-primary/70">
                                    {preview}
                                </div>
                            )}
                             {renderType === 'animation' && option !== 'none' ? <AnimatedBackgroundPreview type={option as AnimatedBackground} /> : renderType === 'animation' && <span>None</span>}
                        </div>
                        <p className="mt-2 text-center text-xs font-medium capitalize">{option.replace('-', ' ')}</p>
                        {value === option && (
                            <div className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [showQrCode, setShowQrCode] = React.useState(false);

  const isNewProfile = !profile.id;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name || '',
      slug: profile.slug || '',
      jobTitle: profile.jobTitle || '',
      logoUrl: profile.logoUrl || '',
      coverUrl: profile.coverUrl || '',
      content: profile.content || [],
      links: profile.links?.map(link => ({ ...link, icon: link.icon || '' })) || [],
      vCard: {
        firstName: profile.vCard?.firstName || '',
        lastName: profile.vCard?.lastName || '',
        email: profile.vCard?.email || '',
        phone: profile.vCard?.phone || '',
        company: profile.vCard?.company || '',
        title: profile.vCard?.title || '',
        website: profile.vCard?.website || '',
      },
      theme: profile.theme || 'default',
      animatedBackground: profile.animatedBackground || 'none',
      layout: profile.layout || 'default',
      isPublished: profile.isPublished || false,
      isVerified: profile.isVerified || false,
    },
  });

  const { fields: contentFields, append: appendContent, remove: removeContent, move: moveContent } = useFieldArray({
    control: form.control,
    name: 'content',
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
    control: form.control,
    name: 'links',
  });
  
  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
        const oldIndex = contentFields.findIndex((field) => field.id === active.id);
        const newIndex = contentFields.findIndex((field) => field.id === over!.id);
        moveContent(oldIndex, newIndex);
    }
  }

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    
    const profileData: Partial<Profile> = {
        ...data,
        content: data.content?.map(block => ({
            ...block,
            level: block.level || undefined,
            text: block.text || undefined,
            url: block.url || undefined,
            alt: block.alt || undefined,
            author: block.author || undefined,
            title: block.title || undefined,
            skills: block.skills || undefined,
        }))
    };

    try {
      if (isNewProfile) {
        const newProfile = await createProfile(profileData as Omit<Profile, 'id' | 'createdAt'>);
        toast({
          title: 'Profile Created',
          description: 'Your new profile has been created successfully.',
        });
        router.push(`/dashboard/edit/${newProfile.slug}`);
        router.refresh();
      } else {
        const updated: Profile = { ...profile, ...profileData, id: profile.id };
        await updateProfile(updated);
        toast({
          title: 'Profile Saved',
          description: 'Your changes have been saved successfully.',
        });
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSuggestFields = async () => {
    setIsSuggesting(true);
    try {
        const result = await suggestProfileFields({ jobTitle: form.getValues('jobTitle'), industry: '' });
        setSuggestions(result.suggestedFields);
    } catch(e) {
        toast({ title: 'AI Suggestion Failed', description: 'Could not get suggestions at this time.', variant: 'destructive' });
    } finally {
        setIsSuggesting(false);
    }
  };

  const addBlock = (type: 'heading' | 'text' | 'image' | 'quote' | 'skills') => {
    const newBlock: any = { id: new Date().toISOString(), type };
    switch (type) {
        case 'heading':
            newBlock.text = 'New Heading';
            newBlock.level = 'h2';
            break;
        case 'text':
            newBlock.text = 'New paragraph text.';
            break;
        case 'image':
            newBlock.url = '';
            newBlock.alt = 'Image description';
            break;
        case 'quote':
            newBlock.text = 'A memorable quote.';
            newBlock.author = 'Author';
            break;
        case 'skills':
            newBlock.title = 'My Skills';
            newBlock.skills = [{ name: 'Teamwork', level: 80 }];
            break;
    }
    appendContent(newBlock);
  };


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nour Al-Huda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., nour-al-huda" {...field} />
                    </FormControl>
                    <FormDescription>This will be the URL for your profile page. Use lowercase letters, numbers, and hyphens only.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Digital Marketing Specialist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Content Blocks</CardTitle>
                <FormDescription>
                    Add and arrange blocks of content to build your profile page. Drag and drop to reorder.
                </FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <DndContext
                        id="profile-content-dnd"
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={contentFields}
                            strategy={verticalListSortingStrategy}
                        >
                            {contentFields.map((field, index) => (
                                <SortableItem key={field.id} id={field.id}>
                                    <div className="p-4 border rounded-lg space-y-4 relative bg-background">
                                        <div className="absolute top-2 right-2 flex items-center">
                                            <Button type="button" size="icon" variant="destructive-ghost" className="h-7 w-7" onClick={() => removeContent(index)}>
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        {field.type === 'heading' && (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.text`}
                                                    render={({ field }) => (
                                                        <FormItem className="col-span-3">
                                                            <FormLabel>Heading Text</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.level`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Level</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="h1">H1</SelectItem>
                                                                    <SelectItem value="h2">H2</SelectItem>
                                                                    <SelectItem value="h3">H3</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {field.type === 'text' && (
                                            <FormField
                                                control={form.control}
                                                name={`content.${index}.text`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Paragraph Text</FormLabel>
                                                        <FormControl><Textarea {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                        {field.type === 'image' && (
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.url`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Image URL</FormLabel>
                                                            <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.alt`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Alt Text (for accessibility)</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {field.type === 'quote' && (
                                            <div className="space-y-4">
                                                 <FormField
                                                    control={form.control}
                                                    name={`content.${index}.text`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Quote Text</FormLabel>
                                                            <FormControl><Textarea {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.author`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Author (optional)</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                        {field.type === 'skills' && (
                                            <div className="space-y-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`content.${index}.title`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Skills Block Title</FormLabel>
                                                            <FormControl><Input {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormLabel>Skills</FormLabel>
                                                <SkillsSubForm form={form} contentIndex={index} />
                                            </div>
                                        )}
                                    </div>
                                </SortableItem>
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('heading')}><Type className="mr-2 h-4 w-4" /> Add Heading</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')}><Pilcrow className="mr-2 h-4 w-4" /> Add Text</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}><ImageIcon className="mr-2 h-4 w-4" /> Add Image</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('quote')}><MessageSquareQuote className="mr-2 h-4 w-4" /> Add Quote</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('skills')}><BarChart className="mr-2 h-4 w-4" /> Add Skills</Button>
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Contact Card (vCard)</CardTitle>
                <FormDescription>
                    Fill this information to allow users to save your contact details directly to their phone.
                </FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vCard.firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="Nour" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="vCard.lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Al-Huda" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="vCard.email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="contact@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="vCard.phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+123456789" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="vCard.company" render={({ field }) => (
                        <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Creative Solutions Inc." {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="vCard.title" render={({ field }) => (
                        <FormItem><FormLabel>Title / Position</FormLabel><FormControl><Input placeholder="Digital Marketer" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                 <FormField control={form.control} name="vCard.website" render={({ field }) => (
                    <FormItem><FormLabel>Website</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
                <CardTitle>Customization &amp; Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8">
                    <FormField
                      control={form.control}
                      name="logoUrl"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://example.com/image.png" {...field} />
                              </FormControl>
                              <FormDescription>Enter an external URL for the profile picture.</FormDescription>
                              <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="coverUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cover Photo URL</FormLabel>
                            <FormControl>
                               <Input placeholder="https://example.com/cover.png" {...field} />
                            </FormControl>
                             <FormDescription>Enter an external URL for the cover photo.</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="layout"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base flex items-center gap-2"><LayoutTemplate /> Layout</FormLabel>
                                  <FormDescription>Choose how your profile content is structured.</FormDescription>
                                </div>
                                <ChoiceCards
                                    options={layouts}
                                    value={field.value as ProfileLayout}
                                    onChange={field.onChange}
                                    previews={layoutPreviews}
                                    renderType='layout'
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                                <div className="mb-4">
                                  <FormLabel className="text-base flex items-center gap-2"><Paintbrush /> Theme</FormLabel>
                                  <FormDescription>Select a color scheme for your profile.</FormDescription>
                                </div>
                                <ChoiceCards
                                    options={themes}
                                    value={field.value as Theme}
                                    onChange={field.onChange}
                                    previews={themePreviews}
                                    renderType='color'
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="animatedBackground"
                        render={({ field }) => (
                            <FormItem>
                                 <div className="mb-4">
                                  <FormLabel className="text-base flex items-center gap-2"><Sparkles /> Animated Background</FormLabel>
                                  <FormDescription>Add a dynamic background effect to your profile.</FormDescription>
                                </div>
                                <ChoiceCards
                                    options={backgrounds}
                                    value={field.value as AnimatedBackground}
                                    onChange={field.onChange}
                                    previews={backgrounds.reduce((acc, bg) => ({...acc, [bg]: bg}), {})}
                                    renderType='animation'
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Published</FormLabel>
                                    <FormDescription>
                                        Enable this to make the profile page publicly accessible.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isVerified"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Verified Profile</FormLabel>
                                    <FormDescription>
                                        Enable this to show a verified badge on the profile.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Links</CardTitle>
                <Button type="button" variant="ghost" size="sm" onClick={handleSuggestFields} disabled={isSuggesting}>
                   {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Suggest Fields
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {linkFields.map((field, index) => {
                 return (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`links.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="LinkedIn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`links.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://linkedin.com/in/..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <div className="flex gap-4 items-end">
                         <FormField
                            control={form.control}
                            name={`links.${index}.icon`}
                            render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Icon URL</FormLabel>
                                <FormControl>
                                <Input placeholder="https://cdn.simpleicons.org/..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                         />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                       </div>
                    </div>
                 );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendLink({ id: new Date().toISOString(), title: '', url: '', icon: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </CardContent>
          </Card>
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => setShowQrCode(true)} disabled={isNewProfile}>
              <QrCode className="mr-2 h-4 w-4" />
              Show QR Code
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isNewProfile ? 'Create Profile' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog open={suggestions.length > 0} onOpenChange={() => setSuggestions([])}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>AI Field Suggestions</AlertDialogTitle>
                <AlertDialogDescription>
                    Based on your job title, we suggest adding these fields to your profile:
                </AlertDialogDescription>
            </AlertDialogHeader>
            <ul className="space-y-2 list-disc list-inside bg-secondary p-4 rounded-md">
                {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => setSuggestions([])}>Got it!</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
       <QRCodeDialog 
        open={showQrCode} 
        onOpenChange={setShowQrCode} 
        profile={profile}
      />
    </>
  );
}


function SkillsSubForm({ form, contentIndex }: { form: any, contentIndex: number }) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `content.${contentIndex}.skills`
    });

    return (
        <div className="space-y-4 pl-4 border-l-2">
            {fields.map((skill, skillIndex) => (
                <div key={skill.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormField
                        control={form.control}
                        name={`content.${contentIndex}.skills.${skillIndex}.name`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl><Input placeholder="e.g., JavaScript" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`content.${contentIndex}.skills.${skillIndex}.level`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proficiency ({field.value || 0}%)</FormLabel>
                                <div className="flex items-center gap-2">
                                    <FormControl>
                                        <Slider
                                            defaultValue={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                            max={100}
                                            step={5}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <Button type="button" variant="destructive" size="icon" onClick={() => remove(skillIndex)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ))}
             <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ name: '', level: 75 })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Skill
            </Button>
        </div>
    );
}

    

    
