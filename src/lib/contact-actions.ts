'use server';

import { getDatabase } from './mongodb';
import { ContactSubmission } from './types';
import { ObjectId, Document } from 'mongodb';
import { z } from 'zod';

const SUBMISSIONS_COLLECTION = 'contact_submissions';
const PROFILES_COLLECTION = 'profiles';

// Validation schema for contact form
const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Valid email is required'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
    phone: z.string().max(30).optional(),
    subject: z.string().max(200).optional(),
    company: z.string().max(100).optional(),
});

// Submit a contact form
export async function submitContactForm(
    profileId: string,
    formData: {
        name: string;
        email: string;
        message: string;
        phone?: string;
        subject?: string;
        company?: string;
    }
): Promise<{ success: boolean; error?: string }> {
    try {
        // Validate input
        const validated = contactFormSchema.safeParse(formData);
        if (!validated.success) {
            return { success: false, error: validated.error.errors[0].message };
        }

        const db = await getDatabase();

        // Get profile name for admin display
        const profile = await db.collection(PROFILES_COLLECTION).findOne({
            _id: new ObjectId(profileId)
        });

        if (!profile) {
            return { success: false, error: 'Profile not found' };
        }

        // Check if contact form is enabled
        const enabledBlocks = profile.enabledBlocks as Record<string, boolean> | undefined;
        if (!enabledBlocks?.contactForm) {
            return { success: false, error: 'Contact form is not enabled for this profile' };
        }

        const submission: Record<string, unknown> = {
            profileId,
            profileName: profile.name as string,
            name: validated.data.name,
            email: validated.data.email,
            message: validated.data.message,
            isRead: false,
            createdAt: new Date(),
        };

        // Add optional fields only if they have values
        if (validated.data.phone) {
            submission.phone = validated.data.phone;
        }
        if (validated.data.subject) {
            submission.subject = validated.data.subject;
        }
        if (validated.data.company) {
            submission.company = validated.data.company;
        }

        await db.collection(SUBMISSIONS_COLLECTION).insertOne(submission);

        return { success: true };
    } catch (error) {
        console.error('Failed to submit contact form:', error);
        return { success: false, error: 'Failed to submit form. Please try again.' };
    }
}

// Get all contact submissions (admin only)
export async function getContactSubmissions(options?: {
    profileId?: string;
    unreadOnly?: boolean;
    limit?: number;
}): Promise<ContactSubmission[]> {
    try {
        const db = await getDatabase();
        const collection = db.collection(SUBMISSIONS_COLLECTION);

        const query: Record<string, unknown> = {};

        if (options?.profileId) {
            query.profileId = options.profileId;
        }

        if (options?.unreadOnly) {
            query.isRead = false;
        }

        const docs = await collection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(options?.limit || 100)
            .toArray();

        return docs.map((doc: Document) => ({
            id: doc._id.toString(),
            profileId: doc.profileId as string,
            profileName: doc.profileName as string,
            name: doc.name as string,
            email: doc.email as string,
            phone: doc.phone as string | undefined,
            subject: doc.subject as string | undefined,
            company: doc.company as string | undefined,
            message: doc.message as string,
            isRead: doc.isRead as boolean,
            createdAt: doc.createdAt as Date,
        }));
    } catch (error) {
        console.error('Failed to get contact submissions:', error);
        return [];
    }
}

// Mark submission as read
export async function markSubmissionAsRead(submissionId: string): Promise<boolean> {
    try {
        const db = await getDatabase();

        await db.collection(SUBMISSIONS_COLLECTION).updateOne(
            { _id: new ObjectId(submissionId) },
            { $set: { isRead: true } }
        );

        return true;
    } catch (error) {
        console.error('Failed to mark submission as read:', error);
        return false;
    }
}

// Mark submission as unread
export async function markSubmissionAsUnread(submissionId: string): Promise<boolean> {
    try {
        const db = await getDatabase();

        await db.collection(SUBMISSIONS_COLLECTION).updateOne(
            { _id: new ObjectId(submissionId) },
            { $set: { isRead: false } }
        );

        return true;
    } catch (error) {
        console.error('Failed to mark submission as unread:', error);
        return false;
    }
}

// Delete a submission
export async function deleteSubmission(submissionId: string): Promise<boolean> {
    try {
        const db = await getDatabase();

        await db.collection(SUBMISSIONS_COLLECTION).deleteOne({
            _id: new ObjectId(submissionId)
        });

        return true;
    } catch (error) {
        console.error('Failed to delete submission:', error);
        return false;
    }
}

// Get unread submission count (for badge display)
export async function getUnreadCount(): Promise<number> {
    try {
        const db = await getDatabase();

        return await db.collection(SUBMISSIONS_COLLECTION).countDocuments({ isRead: false });
    } catch (error) {
        console.error('Failed to get unread count:', error);
        return 0;
    }
}
