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

    const rawData = Object.fromEntries(formData.entries());
    
    const features: Feature[] = [];
    const featureKeys = Object.keys(rawData).filter(key => key.startsWith('features.'));
    
    // Get the highest index to determine the number of features submitted
    const maxIndex = featureKeys.reduce((max, key) => {
        const match = key.match(/features\.(\d+)\./);
        if (match) {
            const index = parseInt(match[1], 10);
            return Math.max(max, index);
        }
        return max;
    }, -1);

    for (let i = 0; i <= maxIndex; i++) {
        const icon = formData.get(`features.${i}.icon`) as string;
        const title = formData.get(`features.${i}.title`) as string;
        const description = formData.get(`features.${i}.description`) as string;

        // Only add the feature if all its fields are present and not empty.
        // This handles cases where a feature is removed on the client.
        if (icon && title && description) {
            features.push({ icon, title, description });
        }
    }

    const dataToValidate = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        description: formData.get('description') as string,
        features: features,
        faviconUrl: formData.get('faviconUrl') as string,
    };

    const validatedFields = homepageContentSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
        console.error("Zod validation failed:", validatedFields.error.flatten().fieldErrors);
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
