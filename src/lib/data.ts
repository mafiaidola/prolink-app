import type { Profile, HomepageContent } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Use path.join to create a platform-independent file path
const profilesFilePath = path.join(process.cwd(), 'src', 'lib', 'database', 'profiles.json');
const homepageContentFilePath = path.join(process.cwd(), 'src', 'lib', 'database', 'homepage.json');

// Helper function to read profiles from the JSON file
export const readProfiles = async (): Promise<Profile[]> => {
    try {
        const data = await fs.readFile(profilesFilePath, 'utf-8');
        return JSON.parse(data) as Profile[];
    } catch (error) {
        // If the file doesn't exist, return an empty array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Helper function to write profiles to the JSON file
export const writeProfiles = async (profiles: Profile[]): Promise<void> => {
    await fs.writeFile(profilesFilePath, JSON.stringify(profiles, null, 2), 'utf-8');
};

// Helper function to read homepage content from the JSON file
const readHomepageContent = async (): Promise<HomepageContent> => {
    try {
        const data = await fs.readFile(homepageContentFilePath, 'utf-8');
        return JSON.parse(data) as HomepageContent;
    } catch (error) {
         if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // This is a fallback if the file is ever deleted.
            const defaultData = {
                title: 'ProLink',
                subtitle: 'Your Ultimate Digital Profile Builder.',
                description: 'Create, manage, and share a stunning, professional bio link page that brings all your content together.',
                features: [],
            };
            await fs.writeFile(homepageContentFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
            return defaultData;
        }
        throw error;
    }
};

export const getProfiles = async (): Promise<Profile[]> => {
    return await readProfiles();
};

export const getProfileBySlug = async (slug: string): Promise<Profile | undefined> => {
    const profiles = await readProfiles();
    return profiles.find((p) => p.slug === slug);
};

export const getHomepageContent = async (): Promise<HomepageContent> => {
  return await readHomepageContent();
};
