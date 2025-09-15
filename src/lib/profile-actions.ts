'use server';

import { revalidatePath } from 'next/cache';
import type { Profile } from './types';
import { readProfiles, writeProfiles } from './data';

export async function updateProfile(updatedProfile: Profile): Promise<Profile> {
    const profiles = await readProfiles();
    const profileId = updatedProfile.id;
    const exists = profiles.some(p => p.id === profileId);
    if (!exists) {
        throw new Error("Profile not found");
    }
    const slugInUse = profiles.some(p => p.slug === updatedProfile.slug && p.id !== profileId);
    if (slugInUse) {
        throw new Error("Slug is already in use by another profile.");
    }

    const updatedProfiles = profiles.map((p) =>
        p.id === profileId ? updatedProfile : p
    );
    await writeProfiles(updatedProfiles);
    revalidatePath('/dashboard/profiles');
    revalidatePath(`/dashboard/edit/${updatedProfile.slug}`);
    revalidatePath(`/${updatedProfile.slug}`);
    return updatedProfile;
};

export async function createProfile(newProfileData: Omit<Profile, 'id'>): Promise<Profile> {
    const profiles = await readProfiles();
    const slugInUse = profiles.some(p => p.slug === newProfileData.slug);
    if (slugInUse) {
        throw new Error("Slug is already in use.");
    }

    const newProfile: Profile = {
        ...newProfileData,
        id: (Date.now() + Math.random()).toString(), // Generate a more unique ID
        logoUrl: newProfileData.logoUrl || `https://picsum.photos/seed/${newProfileData.slug}/200/200`,
        coverUrl: newProfileData.coverUrl || `https://picsum.photos/seed/${newProfileData.slug}-cover/800/300`,
    };

    profiles.push(newProfile);
    await writeProfiles(profiles);
    revalidatePath('/dashboard/profiles');
    return newProfile;
}
