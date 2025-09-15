'use client';

import { useForm, useFieldArray, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { HomepageContent, Feature } from '@/lib/types';
import { PlusCircle, Trash, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { saveSettings } from '@/lib/actions';

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
});


export function SettingsForm({ content }: { content: HomepageContent }) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = React.useState(false);

    const form = useForm<z.infer<typeof homepageContentSchema>>({
        resolver: zodResolver(homepageContentSchema),
        defaultValues: content,
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'features',
    });
    
    const onSubmit = async (data: z.infer<typeof homepageContentSchema>) => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('subtitle', data.subtitle);
        formData.append('description', data.description);
        data.features.forEach((feature, index) => {
            formData.append(`features.${index}.icon`, feature.icon);
            formData.append(`features.${index}.title`, feature.title);
            formData.append(`features.${index}.description`, feature.description);
        });

        const result = await saveSettings(undefined as any, formData);

        if (result?.success) {
            toast({
                title: 'Settings Saved',
                description: result.message,
            });
        } else {
            toast({
                title: 'Error',
                description: result?.error || 'An unknown error occurred.',
                variant: 'destructive',
            });
        }
        setIsSaving(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                    <Input {...field} />
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
                                    <Textarea {...field} />
                                </FormControl>
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
                                        <Input placeholder="e.g. Palette" {...field} />
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
                                                <Input {...field} />
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
                                                <Textarea {...field} />
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
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form>
    );
}
