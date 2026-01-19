'use server';

import { revalidatePath } from 'next/cache';
import type { Profile } from './types';
import { getDatabase, ObjectId } from './mongodb';

export async function updateProfile(updatedProfile: Profile): Promise<Profile> {
    const db = await getDatabase();
    const collection = db.collection('profiles');

    const profileId = updatedProfile.id;
    if (!profileId) {
        throw new Error("Profile ID is missing.");
    }

    // Check if slug is already in use by another profile
    const existing = await collection.findOne({
        _id: { $ne: new ObjectId(profileId) },
        slug: updatedProfile.slug
    });

    if (existing) {
        throw new Error("Slug is already in use by another profile.");
    }

    // The 'id' and 'createdAt' fields should not be part of the update payload
    const { id, createdAt, ...updateData } = updatedProfile;

    const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(profileId) },
        { $set: updateData },
        { returnDocument: 'after' }
    );

    if (!result) {
        throw new Error(`Failed to update profile: Profile not found`);
    }

    revalidatePath('/dashboard/profiles');
    revalidatePath(`/dashboard/edit/${updatedProfile.slug}`);
    revalidatePath(`/${updatedProfile.slug}`);

    return {
        ...result,
        id: result._id.toString(),
        _id: undefined
    } as Profile;
};

export async function createProfile(newProfileData: Omit<Profile, 'id' | 'createdAt'>): Promise<Profile> {
    const db = await getDatabase();
    const collection = db.collection('profiles');

    // Check if slug is already in use
    const existing = await collection.findOne({ slug: newProfileData.slug });

    if (existing) {
        throw new Error("Slug is already in use.");
    }

    const newProfile = {
        ...newProfileData,
        logoUrl: newProfileData.logoUrl || `https://picsum.photos/seed/${newProfileData.slug}/200/200`,
        coverUrl: newProfileData.coverUrl || `https://picsum.photos/seed/${newProfileData.slug}-cover/800/300`,
        isVerified: newProfileData.isVerified || false,
        createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newProfile);

    if (!result.insertedId) {
        throw new Error(`Failed to create profile`);
    }

    revalidatePath('/dashboard/profiles');

    return {
        ...newProfile,
        id: result.insertedId.toString()
    } as Profile;
}
