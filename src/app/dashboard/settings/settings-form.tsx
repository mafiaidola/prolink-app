'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { HomepageContent, Feature } from '@/lib/types';
import { PlusCircle, Trash, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React, { useActionState, useEffect } from 'react';
import { saveSettings, type SettingsState } from '@/lib/settings-actions';

const featureSchema = z.object({
    icon: z.string().min(1, "Icon is required."),
    title: z.string().min(1, "Title is required."),
    description: z.string().min(1, "Description is required."),
});

const homepageContentSchema = z.object({
    title: z.string().min(1, "Title is required."),
    subtitle: z.string().min(1, "Subtitle is required."),
    description: z.string().min(1, "Description is required."),
    features: z.array(featureSchema),
    faviconUrl: z.string().url().optional().or(z.literal('')),
});


export function SettingsForm({ content }: { content: HomepageContent }) {
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof homepageContentSchema>>({
        resolver: zodResolver(homepageContentSchema),
        defaultValues: content,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'features',
    });
    
    const initialState: SettingsState = {
        success: false,
        error: undefined,
        message: undefined
    };

    const [state, formAction] = useActionState(saveSettings, initialState);

    useEffect(() => {
        if (state?.success) {
            toast({
                title: 'Settings Saved',
                description: state.message,
            });
        } else if (state?.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Title</FormLabel>
                                <FormControl>
                                    <Input {...field} name={field.name}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                    <Input {...field} name={field.name}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} name={field.name}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="faviconUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Favicon URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://example.com/favicon.ico" {...field} name={field.name} />
                                </FormControl>
                                <FormDescription>
                                    Provide a URL to an external image to be used as the favicon.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Features</h3>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end p-4 border rounded-md">
                             <FormField
                                control={form.control}
                                name={`features.${index}.icon`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Icon</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Palette" {...field} name={field.name} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="flex-1 space-y-2">
                                <FormField
                                    control={form.control}
                                    name={`features.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Feature Title</FormLabel>
                                            <FormControl>
                                                <Input {...field} name={field.name} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`features.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Feature Description</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} name={field.name} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => append({ icon: 'HelpCircle', title: '', description: '' })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Feature
                    </Button>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form>
    );
}
