'use server';

import { getDatabase } from './mongodb';
import { AnalyticsSummary, Profile, Link } from './types';
import { ObjectId, Document } from 'mongodb';
import crypto from 'crypto';

const ANALYTICS_COLLECTION = 'analytics';
const PROFILES_COLLECTION = 'profiles';

// Hash IP for privacy
function hashIP(ip: string): string {
    return crypto.createHash('sha256').update(ip + process.env.SESSION_SECRET_KEY).digest('hex').slice(0, 16);
}

// Parse referrer to get source name
function parseReferrer(referrer: string): string {
    if (!referrer || referrer === '') return 'direct';

    try {
        const url = new URL(referrer);
        const hostname = url.hostname.toLowerCase();

        // Map common referrers to friendly names
        if (hostname.includes('google')) return 'google';
        if (hostname.includes('facebook') || hostname.includes('fb.com')) return 'facebook';
        if (hostname.includes('instagram')) return 'instagram';
        if (hostname.includes('twitter') || hostname.includes('t.co')) return 'twitter';
        if (hostname.includes('linkedin')) return 'linkedin';
        if (hostname.includes('tiktok')) return 'tiktok';
        if (hostname.includes('youtube')) return 'youtube';
        if (hostname.includes('reddit')) return 'reddit';
        if (hostname.includes('pinterest')) return 'pinterest';
        if (hostname.includes('telegram')) return 'telegram';
        if (hostname.includes('whatsapp')) return 'whatsapp';

        // Return the domain for other sources
        return hostname.replace('www.', '');
    } catch {
        return 'direct';
    }
}

// Track a page view
export async function trackPageView(
    profileId: string,
    referrer: string,
    userAgent: string,
    ip: string
): Promise<void> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        const event = {
            profileId,
            type: 'view',
            referrer: parseReferrer(referrer),
            userAgent: userAgent || 'unknown',
            ipHash: hashIP(ip),
            timestamp: new Date(),
        };

        await collection.insertOne(event);

        // Update cached view count on profile
        await db.collection(PROFILES_COLLECTION).updateOne(
            { _id: new ObjectId(profileId) },
            { $inc: { viewCount: 1 } }
        );
    } catch (error) {
        console.error('Failed to track page view:', error);
    }
}

// Track a link click
export async function trackLinkClick(
    profileId: string,
    linkId: string,
    referrer: string,
    userAgent: string,
    ip: string
): Promise<void> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        const event = {
            profileId,
            type: 'click',
            linkId,
            referrer: parseReferrer(referrer),
            userAgent: userAgent || 'unknown',
            ipHash: hashIP(ip),
            timestamp: new Date(),
        };

        await collection.insertOne(event);
    } catch (error) {
        console.error('Failed to track link click:', error);
    }
}

// Get analytics summary for a profile (admin only)
export async function getProfileAnalytics(profileId: string): Promise<AnalyticsSummary> {
    try {
        const db = await getDatabase();
        const analyticsCollection = db.collection(ANALYTICS_COLLECTION);
        const profilesCollection = db.collection(PROFILES_COLLECTION);

        // Get profile for link titles
        const profile = await profilesCollection.findOne({ _id: new ObjectId(profileId) }) as (Document & Profile) | null;
        const links: Link[] = profile?.links || [];

        // Total views
        const totalViews = await analyticsCollection.countDocuments({
            profileId,
            type: 'view'
        });

        // Total clicks
        const totalClicks = await analyticsCollection.countDocuments({
            profileId,
            type: 'click'
        });

        // Clicks by link
        const clicksByLinkAgg = await analyticsCollection.aggregate([
            { $match: { profileId, type: 'click' } },
            { $group: { _id: '$linkId', clicks: { $sum: 1 } } },
            { $sort: { clicks: -1 } }
        ]).toArray();

        const clicksByLink = clicksByLinkAgg.map((item: Document) => {
            const link = links.find((l: Link) => l.id === item._id);
            return {
                linkId: item._id as string,
                linkTitle: link?.title || 'Unknown Link',
                clicks: item.clicks as number
            };
        });

        // Referrer breakdown
        const referrerAgg = await analyticsCollection.aggregate([
            { $match: { profileId, type: 'view' } },
            { $group: { _id: '$referrer', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        const referrerBreakdown = referrerAgg.map((item: Document) => ({
            source: item._id as string,
            count: item.count as number
        }));

        // Views over last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const viewsOverTimeAgg = await analyticsCollection.aggregate([
            {
                $match: {
                    profileId,
                    type: 'view',
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    views: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();

        const viewsOverTime = viewsOverTimeAgg.map((item: Document) => ({
            date: item._id as string,
            views: item.views as number
        }));

        return {
            totalViews,
            totalClicks,
            clicksByLink,
            referrerBreakdown,
            viewsOverTime
        };
    } catch (error) {
        console.error('Failed to get profile analytics:', error);
        return {
            totalViews: 0,
            totalClicks: 0,
            clicksByLink: [],
            referrerBreakdown: [],
            viewsOverTime: []
        };
    }
}

// Get all profiles with their analytics (admin dashboard)
export async function getAllProfilesAnalytics(): Promise<{
    profiles: { id: string; name: string; slug: string; views: number; clicks: number }[];
    totalViews: number;
    totalClicks: number;
}> {
    try {
        const db = await getDatabase();
        const analyticsCollection = db.collection(ANALYTICS_COLLECTION);
        const profilesCollection = db.collection(PROFILES_COLLECTION);

        // Get all profiles
        const profileDocs = await profilesCollection.find({}).toArray();

        // Get view counts per profile
        const viewsAgg = await analyticsCollection.aggregate([
            { $match: { type: 'view' } },
            { $group: { _id: '$profileId', views: { $sum: 1 } } }
        ]).toArray();

        const viewsMap = new Map<string, number>(viewsAgg.map((v: Document) => [v._id as string, v.views as number]));

        // Get click counts per profile
        const clicksAgg = await analyticsCollection.aggregate([
            { $match: { type: 'click' } },
            { $group: { _id: '$profileId', clicks: { $sum: 1 } } }
        ]).toArray();

        const clicksMap = new Map<string, number>(clicksAgg.map((c: Document) => [c._id as string, c.clicks as number]));

        const profiles = profileDocs.map((p: Document) => ({
            id: p._id.toString(),
            name: p.name as string,
            slug: p.slug as string,
            views: viewsMap.get(p._id.toString()) || 0,
            clicks: clicksMap.get(p._id.toString()) || 0
        }));

        const totalViews = profiles.reduce((sum: number, p) => sum + p.views, 0);
        const totalClicks = profiles.reduce((sum: number, p) => sum + p.clicks, 0);

        return { profiles, totalViews, totalClicks };
    } catch (error) {
        console.error('Failed to get all profiles analytics:', error);
        return { profiles: [], totalViews: 0, totalClicks: 0 };
    }
}

// Get global referrer stats (admin only)
export async function getGlobalReferrerStats(): Promise<{ source: string; count: number }[]> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        const referrerAgg = await collection.aggregate([
            { $match: { type: 'view' } },
            { $group: { _id: '$referrer', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 }
        ]).toArray();

        return referrerAgg.map((item: Document) => ({
            source: item._id as string,
            count: item.count as number
        }));
    } catch (error) {
        console.error('Failed to get global referrer stats:', error);
        return [];
    }
}
