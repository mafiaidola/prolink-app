import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllProfilesAnalytics, getGlobalReferrerStats } from '@/lib/analytics-actions';
import { BarChart3, Eye, MousePointer, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function AnalyticsPage() {
    const session = await getSession();
    if (!session) redirect('/login');

    const { profiles, totalViews, totalClicks } = await getAllProfilesAnalytics();
    const referrerStats = await getGlobalReferrerStats();

    // Calculate max for chart scaling
    const maxReferrer = Math.max(...referrerStats.map(r => r.count), 1);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground mt-1">
                    Track views, clicks, and referrer sources across all profiles.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Views</p>
                            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <MousePointer className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Clicks</p>
                            <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-xl p-6 border shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Click Rate</p>
                            <p className="text-3xl font-bold">
                                {totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referrer Sources */}
            <div className="bg-card rounded-xl p-6 border shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">Traffic Sources</h2>
                </div>

                {referrerStats.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No traffic data yet. Views will be tracked as visitors arrive.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {referrerStats.map((stat, index) => (
                            <div key={stat.source} className="flex items-center gap-4">
                                <span className="w-24 text-sm text-muted-foreground truncate capitalize">
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
                                <tr className="border-b">
                                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Profile</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Views</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Clicks</th>
                                    <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">CTR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profiles.map((profile) => (
                                    <tr key={profile.id} className="border-b last:border-0 hover:bg-muted/50">
                                        <td className="py-3 px-2">
                                            <Link
                                                href={`/dashboard/edit/${profile.id}`}
                                                className="font-medium text-foreground hover:text-primary"
                                            >
                                                {profile.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">/{profile.slug}</p>
                                        </td>
                                        <td className="py-3 px-2 text-right font-mono">{profile.views.toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right font-mono">{profile.clicks.toLocaleString()}</td>
                                        <td className="py-3 px-2 text-right font-mono">
                                            {profile.views > 0 ? ((profile.clicks / profile.views) * 100).toFixed(1) : 0}%
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
