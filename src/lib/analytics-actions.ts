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

// Geo lookup using free ip-api.com service
type GeoData = { country?: string; countryName?: string };

async function getGeoFromIP(ip: string): Promise<GeoData> {
    // Skip local/private IPs
    if (ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {};
    }

    try {
        // Using ip-api.com free tier (45 requests/minute for non-commercial use)
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode,country`, {
            // Short timeout to avoid blocking
            signal: AbortSignal.timeout(2000)
        });

        if (!response.ok) return {};

        const data = await response.json();
        if (data.countryCode) {
            return {
                country: data.countryCode,
                countryName: data.country
            };
        }
    } catch {
        // Fail silently - geo is optional
    }
    return {};
}

// Device detection from user agent
type DeviceInfo = {
    device: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
};

function parseUserAgent(userAgent: string): DeviceInfo {
    const ua = userAgent.toLowerCase();

    // Device detection
    let device: 'mobile' | 'desktop' | 'tablet' = 'desktop';
    if (/ipad|tablet|playbook|silk/.test(ua)) {
        device = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/.test(ua)) {
        device = 'mobile';
    }

    // Browser detection
    let browser = 'Other';
    if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';
    else if (ua.includes('samsung')) browser = 'Samsung';
    else if (ua.includes('msie') || ua.includes('trident')) browser = 'IE';

    // OS detection
    let os = 'Other';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os') || ua.includes('macintosh')) os = 'macOS';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('chrome os')) os = 'ChromeOS';

    return { device, browser, os };
}

// Traffic source classification
type SourceInfo = {
    source: 'qr' | 'social' | 'search' | 'direct' | 'referral';
    isQrScan: boolean;
};

function detectSource(referrer: string, queryParams?: string, device?: string): SourceInfo {
    const ref = referrer.toLowerCase();

    // Check for QR code indicators
    // UTM source=qr or no referrer on mobile = likely QR scan
    if (queryParams?.includes('source=qr') || queryParams?.includes('utm_source=qr')) {
        return { source: 'qr', isQrScan: true };
    }

    // No referrer + mobile device = likely QR code scan
    if ((!referrer || referrer === 'direct') && device === 'mobile') {
        return { source: 'qr', isQrScan: true };
    }

    // Direct traffic
    if (!referrer || referrer === '' || referrer === 'direct') {
        return { source: 'direct', isQrScan: false };
    }

    // Social media sources
    const socialPatterns = ['facebook', 'fb.com', 'instagram', 'twitter', 't.co', 'linkedin',
        'tiktok', 'snapchat', 'pinterest', 'reddit', 'telegram', 'whatsapp',
        'youtube', 'discord', 'threads'];
    if (socialPatterns.some(p => ref.includes(p))) {
        return { source: 'social', isQrScan: false };
    }

    // Search engines
    const searchPatterns = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex', 'ecosia'];
    if (searchPatterns.some(p => ref.includes(p))) {
        return { source: 'search', isQrScan: false };
    }

    // Everything else is a referral
    return { source: 'referral', isQrScan: false };
}

// Track a page view with enhanced data
export async function trackPageView(
    profileId: string,
    referrer: string,
    userAgent: string,
    ip: string,
    queryParams?: string  // Optional query string for QR detection
): Promise<void> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Get geo data (non-blocking, will use cached or default if slow)
        const geoData = await getGeoFromIP(ip);

        // Parse user agent for device info
        const deviceInfo = parseUserAgent(userAgent || '');

        // Detect traffic source
        const sourceInfo = detectSource(referrer, queryParams, deviceInfo.device);

        const event = {
            profileId,
            type: 'view',
            referrer: parseReferrer(referrer),
            userAgent: userAgent || 'unknown',
            ipHash: hashIP(ip),
            // Geo data
            country: geoData.country,
            countryName: geoData.countryName,
            // Device data
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            // Source data
            source: sourceInfo.source,
            isQrScan: sourceInfo.isQrScan,
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

// Track a link click with enhanced data
export async function trackLinkClick(
    profileId: string,
    linkId: string,
    linkTitle: string,
    referrer: string,
    userAgent: string,
    ip: string
): Promise<void> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Parse user agent for device info
        const deviceInfo = parseUserAgent(userAgent || '');

        const event = {
            profileId,
            type: 'click',
            linkId,
            linkTitle,
            referrer: parseReferrer(referrer),
            userAgent: userAgent || 'unknown',
            ipHash: hashIP(ip),
            // Device data
            device: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
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

        // Unique visitors (by IP hash)
        const uniqueVisitorsAgg = await analyticsCollection.aggregate([
            { $match: { profileId, type: 'view' } },
            { $group: { _id: '$ipHash' } },
            { $count: 'count' }
        ]).toArray();
        const uniqueVisitors = uniqueVisitorsAgg[0]?.count || 0;

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
            uniqueVisitors,
            clicksByLink,
            referrerBreakdown,
            viewsOverTime
        };
    } catch (error) {
        console.error('Failed to get profile analytics:', error);
        return {
            totalViews: 0,
            totalClicks: 0,
            uniqueVisitors: 0,
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

// Get geo analytics - country breakdown (admin only)
export async function getGeoAnalytics(): Promise<{
    countries: { code: string; name: string; count: number; percentage: number }[];
    totalWithGeo: number;
}> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Get country breakdown
        const geoAgg = await collection.aggregate([
            { $match: { type: 'view', country: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: { code: '$country', name: '$countryName' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]).toArray();

        // Get total with geo data
        const totalWithGeo = await collection.countDocuments({
            type: 'view',
            country: { $exists: true, $ne: null }
        });

        const countries = geoAgg.map((item: Document) => ({
            code: (item._id as { code: string }).code,
            name: (item._id as { name: string }).name || (item._id as { code: string }).code,
            count: item.count as number,
            percentage: totalWithGeo > 0 ? Math.round(((item.count as number) / totalWithGeo) * 100) : 0
        }));

        return { countries, totalWithGeo };
    } catch (error) {
        console.error('Failed to get geo analytics:', error);
        return { countries: [], totalWithGeo: 0 };
    }
}

// Get device, browser, and OS analytics
export async function getDeviceAnalytics(): Promise<{
    devices: { device: string; count: number; percentage: number }[];
    browsers: { browser: string; count: number; percentage: number }[];
    os: { os: string; count: number; percentage: number }[];
    totalViews: number;
}> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Total views with device data
        const totalViews = await collection.countDocuments({
            type: 'view',
            device: { $exists: true }
        });

        // Device breakdown
        const deviceAgg = await collection.aggregate([
            { $match: { type: 'view', device: { $exists: true, $ne: null } } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        const devices = deviceAgg.map((item: Document) => ({
            device: (item._id as string) || 'unknown',
            count: item.count as number,
            percentage: totalViews > 0 ? Math.round(((item.count as number) / totalViews) * 100) : 0
        }));

        // Browser breakdown
        const browserAgg = await collection.aggregate([
            { $match: { type: 'view', browser: { $exists: true, $ne: null } } },
            { $group: { _id: '$browser', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        const browsers = browserAgg.map((item: Document) => ({
            browser: (item._id as string) || 'Other',
            count: item.count as number,
            percentage: totalViews > 0 ? Math.round(((item.count as number) / totalViews) * 100) : 0
        }));

        // OS breakdown
        const osAgg = await collection.aggregate([
            { $match: { type: 'view', os: { $exists: true, $ne: null } } },
            { $group: { _id: '$os', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]).toArray();

        const os = osAgg.map((item: Document) => ({
            os: (item._id as string) || 'Other',
            count: item.count as number,
            percentage: totalViews > 0 ? Math.round(((item.count as number) / totalViews) * 100) : 0
        }));

        return { devices, browsers, os, totalViews };
    } catch (error) {
        console.error('Failed to get device analytics:', error);
        return { devices: [], browsers: [], os: [], totalViews: 0 };
    }
}

// Get traffic source analytics (QR, Social, Search, Direct, Referral)
export async function getSourceAnalytics(): Promise<{
    sources: { source: string; count: number; percentage: number; icon: string }[];
    qrScans: number;
    totalViews: number;
}> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Total views
        const totalViews = await collection.countDocuments({ type: 'view' });

        // Source breakdown
        const sourceAgg = await collection.aggregate([
            { $match: { type: 'view', source: { $exists: true, $ne: null } } },
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        // Map sources to friendly names and icons
        const sourceIcons: Record<string, string> = {
            'qr': '📱',
            'social': '👥',
            'search': '🔍',
            'direct': '🔗',
            'referral': '↗️'
        };

        const sourceNames: Record<string, string> = {
            'qr': 'QR Code Scan',
            'social': 'Social Media',
            'search': 'Search Engine',
            'direct': 'Direct Visit',
            'referral': 'Referral Link'
        };

        const sources = sourceAgg.map((item: Document) => ({
            source: sourceNames[(item._id as string)] || (item._id as string),
            count: item.count as number,
            percentage: totalViews > 0 ? Math.round(((item.count as number) / totalViews) * 100) : 0,
            icon: sourceIcons[(item._id as string)] || '🌐'
        }));

        // QR scans count
        const qrScans = await collection.countDocuments({
            type: 'view',
            isQrScan: true
        });

        return { sources, qrScans, totalViews };
    } catch (error) {
        console.error('Failed to get source analytics:', error);
        return { sources: [], qrScans: 0, totalViews: 0 };
    }
}

// Get detailed click analytics
export async function getClickAnalytics(): Promise<{
    topLinks: { linkId: string; title: string; clicks: number; ctr: number }[];
    clicksByDevice: { device: string; count: number; percentage: number }[];
    totalClicks: number;
    totalViews: number;
}> {
    try {
        const db = await getDatabase();
        const collection = db.collection(ANALYTICS_COLLECTION);

        // Totals
        const totalViews = await collection.countDocuments({ type: 'view' });
        const totalClicks = await collection.countDocuments({ type: 'click' });

        // Top clicked links
        const clicksAgg = await collection.aggregate([
            { $match: { type: 'click' } },
            {
                $group: {
                    _id: '$linkId',
                    title: { $first: '$linkTitle' },
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { clicks: -1 } },
            { $limit: 10 }
        ]).toArray();

        const topLinks = clicksAgg.map((item: Document) => ({
            linkId: (item._id as string) || '',
            title: (item.title as string) || 'Unknown Link',
            clicks: item.clicks as number,
            ctr: totalViews > 0 ? Math.round(((item.clicks as number) / totalViews) * 100) : 0
        }));

        // Clicks by device
        const deviceClicksAgg = await collection.aggregate([
            { $match: { type: 'click', device: { $exists: true } } },
            { $group: { _id: '$device', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        const clicksByDevice = deviceClicksAgg.map((item: Document) => ({
            device: (item._id as string) || 'unknown',
            count: item.count as number,
            percentage: totalClicks > 0 ? Math.round(((item.count as number) / totalClicks) * 100) : 0
        }));

        return { topLinks, clicksByDevice, totalClicks, totalViews };
    } catch (error) {
        console.error('Failed to get click analytics:', error);
        return { topLinks: [], clicksByDevice: [], totalClicks: 0, totalViews: 0 };
    }
}
