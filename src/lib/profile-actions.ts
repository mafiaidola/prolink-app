'use server';

import { revalidatePath } from 'next/cache';
import type { Profile } from './types';
import { createClient } from './supabase';

export async function updateProfile(updatedProfile: Profile): Promise<Profile> {
    const supabase = createClient();
    if (!supabase) throw new Error("Supabase client is not initialized.");

    const profileId = updatedProfile.id;
    if (!profileId) {
        throw new Error("Profile ID is missing.");
    }
    
    // Check if slug is already in use by another profile
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', updatedProfile.slug)
        .neq('id', profileId)
        .single();
        
    if (existing) {
        throw new Error("Slug is already in use by another profile.");
    }
    
    // The 'id' and 'createdAt' fields should not be part of the update payload
    // as they are managed by the database.
    const { id, createdAt, ...updateData } = updatedProfile;

    const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profileId)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error.message);
        throw new Error(`Failed to update profile: ${error.message}`);
    }
    
    revalidatePath('/dashboard/profiles');
    revalidatePath(`/dashboard/edit/${updatedProfile.slug}`);
    revalidatePath(`/${updatedProfile.slug}`);
    
    return data as Profile;
};

export async function createProfile(newProfileData: Omit<Profile, 'id' | 'createdAt'>): Promise<Profile> {
    const supabase = createClient();
    if (!supabase) throw new Error("Supabase client is not initialized.");

    // Check if slug is already in use
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('slug', newProfileData.slug)
        .single();

    if (existing) {
        throw new Error("Slug is already in use.");
    }

    const newProfile: Omit<Profile, 'id' | 'createdAt'> = {
        ...newProfileData,
        logoUrl: newProfileData.logoUrl || `https://picsum.photos/seed/${newProfileData.slug}/200/200`,
        coverUrl: newProfileData.coverUrl || `https://picsum.photos/seed/${newProfileData.slug}-cover/800/300`,
    };

    const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

    if (error) {
        console.error('Error creating profile:', error.message);
        throw new Error(`Failed to create profile: ${error.message}`);
    }

    revalidatePath('/dashboard/profiles');
    
    return data as Profile;
}
