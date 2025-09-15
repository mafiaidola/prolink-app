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
import { Trash, PlusCircle, Wand2, Loader2, QrCode } from 'lucide-react';
import { createProfile, updateProfile } from '@/lib/data';
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

const linkSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  jobTitle: z.string().min(2, 'Job title is required'),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  coverUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  companyInfo: z.string().max(200, 'Company info cannot exceed 200 characters').optional(),
  links: z.array(linkSchema),
  theme: z.string(),
  animatedBackground: z.string(),
  layout: z.string(),
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
      bio: profile.bio || '',
      logoUrl: profile.logoUrl || '',
      coverUrl: profile.coverUrl || '',
      companyInfo: profile.companyInfo || '',
      links: profile.links || [],
      theme: profile.theme,
      animatedBackground: profile.animatedBackground,
      layout: profile.layout,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'links',
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    
    try {
      if (isNewProfile) {
        const newProfile = await createProfile({ ...profile, ...data, theme: data.theme as Theme, animatedBackground: data.animatedBackground as AnimatedBackground, layout: data.layout as ProfileLayout });
        toast({
          title: 'Profile Created',
          description: 'Your new profile has been created successfully.',
        });
        router.push(`/dashboard/edit/${newProfile.slug}`);
      } else {
        const updated: Profile = { ...profile, ...data, theme: data.theme as Theme, animatedBackground: data.animatedBackground as AnimatedBackground, layout: data.layout as ProfileLayout };
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


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Core Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} />
                      </FormControl>
                      <FormDescription>Recommended size: 200x200px</FormDescription>
                      <FormMessage />
                      </FormItem>
                  )}
                />
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
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief introduction about yourself." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Company/Work</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Information about your company or work." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>Customization</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-1 gap-6">
                <FormField
                    control={form.control}
                    name="coverUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Cover Photo URL</FormLabel>
                        <FormControl>
                           <Input placeholder="https://example.com/cover.png" {...field} />
                        </FormControl>
                         <FormDescription>Recommended size: 800x300px</FormDescription>
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
                                      </Trigger>
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
                                      </Trigger>
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
              {fields.map((field, index) => {
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
                                <Input placeholder="https://example.com/icon.svg" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                         />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
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
                onClick={() => append({ id: new Date().toISOString(), title: '', url: '', icon: '' })}
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
