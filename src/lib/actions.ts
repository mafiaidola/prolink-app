'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { updateHomepageContent } from './data';
import type { HomepageContent, Feature } from './types';
import { revalidatePath } from 'next/cache';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MoEP1337';

const loginSchema = z.object({
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginState = {
  error?: string;
  success?: boolean;
};

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validatedFields = loginSchema.safeParse({
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.password?.[0],
    };
  }

  if (validatedFields.data.password !== ADMIN_PASSWORD) {
    return { error: 'Invalid password.' };
  }

  await createSession({ isAdmin: true });
  
  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
}

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


export type SettingsState = {
    error?: string;
    success?: boolean;
    message?: string;
};

export async function saveSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
    
    const featuresData = Array.from(formData.keys())
        .filter(key => key.startsWith('features.'))
        .reduce((acc, key) => {
            const match = key.match(/features\.(\d+)\.(.*)/);
            if(match) {
                const [, indexStr, field] = match;
                const index = parseInt(indexStr, 10);
                if(!acc[index]) acc[index] = {} as any;
                acc[index][field] = formData.get(key);
            }
            return acc;
        }, [] as any[]);

    const features: Feature[] = featuresData.filter(f => f && f.icon && f.title && f.description);

    const data: HomepageContent = {
        title: formData.get('title') as string,
        subtitle: formData.get('subtitle') as string,
        description: formData.get('description') as string,
        features: features,
    }

    const validatedFields = homepageContentSchema.safeParse(data);

    if (!validatedFields.success) {
        console.error(validatedFields.error.flatten().fieldErrors);
        return {
            error: "Failed to validate settings. Please ensure all fields are filled correctly.",
        };
    }
    
    try {
        await updateHomepageContent(validatedFields.data);
        revalidatePath('/');
        revalidatePath('/dashboard/settings');
        return { success: true, message: "Settings saved successfully!" };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { error: `Failed to save settings: ${errorMessage}` };
    }
}
