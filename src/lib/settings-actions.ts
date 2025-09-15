'use server';

import { z } from 'zod';
import type { HomepageContent, Feature } from './types';
import { revalidatePath } from 'next/cache';
import { createClient } from './supabase';

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


export type SettingsState = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function saveSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
    const supabase = createClient();
    if (!supabase) {
        return { error: "Application is not connected to the database. Please check configuration." };
    }

    // Collect all keys related to features
    const featureKeys = Array.from(formData.keys()).filter(key => key.startsWith('features.'));

    // Group keys by index
    const featuresByIndex: Record<string, Partial<Feature>> = {};
    featureKeys.forEach(key => {
        const match = key.match(/features\[(\d+)\]\.(icon|title|description)/);
        if (match) {
            const [, index, field] = match;
            if (!featuresByIndex[index]) {
                featuresByIndex[index] = {};
            }
            featuresByIndex[index][field as keyof Feature] = formData.get(key) as string;
        }
    });

    // Create a clean array of features, filtering out any empty or partial objects
    const features: Feature[] = Object.values(featuresByIndex)
        .map(f => ({
            icon: f.icon || '',
            title: f.title || '',
            description: f.description || '',
        }))
        .filter(f => f.icon && f.title && f.description);
        
    const data = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        description: formData.get('description') as string,
        features: features,
        faviconUrl: formData.get('faviconUrl') as string,
    };

    const validatedFields = homepageContentSchema.safeParse(data);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            error: "Failed to validate settings. Please ensure all fields are filled correctly.",
        };
    }
    
    try {
        const { error } = await supabase
            .from('homepage_content')
            .update({ ...validatedFields.data, updatedAt: new Date().toISOString() })
            .eq('id', 1);

        if (error) throw error;
        
        revalidatePath('/');
        revalidatePath('/dashboard/settings');
        return { success: true, message: "Settings saved successfully!" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        console.error("Error saving settings to Supabase:", errorMessage);
        return { error: `Failed to save settings: ${errorMessage}` };
    }
}
