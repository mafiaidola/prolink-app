import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
    getAllProfilesAnalytics,
    getGlobalReferrerStats,
    getGeoAnalytics,
    getDeviceAnalytics,
    getSourceAnalytics,
    getClickAnalytics
} from '@/lib/analytics-actions';
import { GeoAnalytics } from '@/components/dashboard/geo-analytics';
import { DeviceAnalytics } from '@/components/dashboard/device-analytics';
import { SourceAnalytics } from '@/components/dashboard/source-analytics';
import { ClickAnalytics } from '@/components/dashboard/click-analytics';
import { BarChart3, Eye, MousePointer, TrendingUp, Users, QrCode } from 'lucide-react';
import Link from 'next/link';

export default async function AnalyticsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    // Fetch all analytics data in parallel
    const [
        { profiles, totalViews, totalClicks },
        referrerStats,
        geoData,
        deviceData,
        sourceData,
        clickData
    ] = await Promise.all([
        getAllProfilesAnalytics(),
        getGlobalReferrerStats(),
        getGeoAnalytics(),
        getDeviceAnalytics(),
        getSourceAnalytics(),
        getClickAnalytics()
    ]);

    // Calculate max for chart scaling
    const maxReferrer = Math.max(...referrerStats.map(r => r.count), 1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Comprehensive insights into your profile traffic, visitors, and engagement.
                </p>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Eye className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-90">Total Views</p>
                            <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <MousePointer className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-90">Total Clicks</p>
                            <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-90">Click Rate</p>
                            <p className="text-2xl font-bold">
                                {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <QrCode className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm opacity-90">QR Scans</p>
                            <p className="text-2xl font-bold">{sourceData.qrScans.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Traffic Sources & Geo Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Source Analytics - QR, Social, Search, etc */}
                <SourceAnalytics
                    sources={sourceData.sources}
                    qrScans={sourceData.qrScans}
                    totalViews={sourceData.totalViews}
                />

                {/* Geo Analytics - Countries with flags */}
                <GeoAnalytics
                    countries={geoData.countries}
                    totalWithGeo={geoData.totalWithGeo}
                />
            </div>

            {/* Device & Browser Analytics */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    Visitor Devices
                </h2>
                <DeviceAnalytics
                    devices={deviceData.devices}
                    browsers={deviceData.browsers}
                    os={deviceData.os}
                    totalViews={deviceData.totalViews}
                />
            </div>

            {/* Click Analytics */}
            <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MousePointer className="h-5 w-5 text-muted-foreground" />
                    Click Performance
                </h2>
                <ClickAnalytics
                    topLinks={clickData.topLinks}
                    clicksByDevice={clickData.clicksByDevice}
                    totalClicks={clickData.totalClicks}
                    totalViews={clickData.totalViews}
                />
            </div>

            {/* Traditional Referrer Stats */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Referrer Breakdown</h2>
                </div>

                {referrerStats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No referrer data yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {referrerStats.map((stat) => (
                            <div key={stat.source} className="flex items-center gap-4">
                                <span className="w-28 text-sm text-muted-foreground truncate capitalize">
                                    {stat.source}
                                </span>
                                <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-2"
                                        style={{ width: `${(stat.count / maxReferrer) * 100}%`, minWidth: '40px' }}
                                    >
                                        <span className="text-xs font-medium text-white">{stat.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Per-Profile Stats */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Profile Performance</h2>

                {profiles.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No profiles yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Profile</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Clicks</th>
                                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile, index) => (
                                    <tr key={profile.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                        <td className="py-3 px-4">
                                            <Link
                                                href={`/dashboard/edit/${profile.id}`}
                                                className="font-medium text-foreground hover:text-primary transition-colors"
                                            >
                                                {profile.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">/{profile.slug}</p>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="font-mono font-semibold">{profile.views.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="font-mono">{profile.clicks.toLocaleString()}</span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${profile.views > 0 && (profile.clicks / profile.views) > 0.1
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}>
                                                {profile.views > 0 ? ((profile.clicks / profile.views) * 100).toFixed(1) : 0}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
