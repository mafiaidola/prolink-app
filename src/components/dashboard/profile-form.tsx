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
import { Trash, PlusCircle, Wand2, Loader2, QrCode, Pilcrow, Type, Image as ImageIcon, MessageSquareQuote, ArrowUp, ArrowDown } from 'lucide-react';
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

const linkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
});

const contentBlockSchema = z.object({
    id: z.string(),
    type: z.enum(['heading', 'text', 'image', 'quote']),
    text: z.string().optional(),
    level: z.enum(['h1', 'h2', 'h3']).optional(),
    url: z.string().optional(),
    alt: z.string().optional(),
    author: z.string().optional(),
});


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  jobTitle: z.string().min(2, 'Job title is required'),
  logoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  coverUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  content: z.array(contentBlockSchema),
  links: z.array(linkSchema),
  theme: z.string(),
  animatedBackground: z.string(),
  layout: z.string(),
  isPublished: z.boolean(),
  isVerified: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const themes: Theme[] = ['default', 'modern', 'classic', 'glass', 'neon', 'minimal', 'retro', 'dark', 'corporate', 'artistic', 'tech'];
const backgrounds: AnimatedBackground[] = ['none', 'particles', 'waves', 'stars', 'electric', 'gradient', 'aurora', 'lines', 'cells', 'circles'];
const layouts: ProfileLayout[] = ['default', 'stacked', 'minimalist-center'];

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
      name: profile.name,
      slug: profile.slug,
      jobTitle: profile.jobTitle,
      logoUrl: profile.logoUrl || '',
      coverUrl: profile.coverUrl || '',
      content: profile.content || [],
      links: profile.links || [],
      theme: profile.theme,
      animatedBackground: profile.animatedBackground,
      layout: profile.layout,
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

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    
    const profileData = {
        ...data,
        content: data.content.map(block => ({
            ...block,
            level: block.level || undefined,
            text: block.text || undefined,
            url: block.url || undefined,
            alt: block.alt || undefined,
            author: block.author || undefined,
        }))
    };

    try {
      if (isNewProfile) {
        const newProfile = await createProfile({ ...profileData, theme: data.theme as Theme, animatedBackground: data.animatedBackground as AnimatedBackground, layout: data.layout as ProfileLayout, links: data.links || [] });
        toast({
          title: 'Profile Created',
          description: 'Your new profile has been created successfully.',
        });
        router.push(`/dashboard/edit/${newProfile.slug}`);
        router.refresh();
      } else {
        const updated: Profile = { ...profile, ...profileData, theme: data.theme as Theme, animatedBackground: data.animatedBackground as AnimatedBackground, layout: data.layout as ProfileLayout };
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

  const addBlock = (type: 'heading' | 'text' | 'image' | 'quote') => {
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
                    Add and arrange blocks of content to build your profile page.
                </FormDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    {contentFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveContent(index, index - 1)} disabled={index === 0}>
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" className="h-7 w-7" onClick={() => moveContent(index, index + 1)} disabled={index === contentFields.length - 1}>
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
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
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('heading')}><Type className="mr-2 h-4 w-4" /> Add Heading</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text')}><Pilcrow className="mr-2 h-4 w-4" /> Add Text</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image')}><ImageIcon className="mr-2 h-4 w-4" /> Add Image</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => addBlock('quote')}><MessageSquareQuote className="mr-2 h-4 w-4" /> Add Quote</Button>
                </div>
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
                <CardTitle>Customization &amp; Settings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
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
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                          control={form.control}
                          name="theme"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Theme</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a theme" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {themes.map(theme => (
                                            <SelectItem key={theme} value={theme} className="capitalize">{theme}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="animatedBackground"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Animated Background</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a background" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {backgrounds.map(bg => (
                                            <SelectItem key={bg} value={bg} className="capitalize">{bg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="layout"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Layout</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a layout" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {layouts.map(layout => (
                                            <SelectItem key={layout} value={layout} className="capitalize">{layout.replace('-', ' ')}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                          )}
                      />
                    </div>
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
