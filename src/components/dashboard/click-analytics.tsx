'use client';

import { MousePointer, Link2, Smartphone, Monitor, Tablet, TrendingUp } from 'lucide-react';

interface ClickAnalyticsProps {
    topLinks: { linkId: string; title: string; clicks: number; ctr: number }[];
    clicksByDevice: { device: string; count: number; percentage: number }[];
    totalClicks: number;
    totalViews: number;
}

// Device icons
function getDeviceIcon(device: string) {
    switch (device.toLowerCase()) {
        case 'mobile': return <Smartphone className="w-4 h-4" />;
        case 'tablet': return <Tablet className="w-4 h-4" />;
        default: return <Monitor className="w-4 h-4" />;
    }
}

// Rank badge colors
function getRankColor(rank: number) {
    switch (rank) {
        case 1: return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
        case 2: return 'bg-gradient-to-r from-gray-300 to-slate-400 text-white';
        case 3: return 'bg-gradient-to-r from-amber-600 to-orange-700 text-white';
        default: return 'bg-muted text-muted-foreground';
    }
}

export function ClickAnalytics({ topLinks, clicksByDevice, totalClicks, totalViews }: ClickAnalyticsProps) {
    const overallCTR = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

    if (totalClicks === 0) {
        return (
            <div className="p-6 rounded-xl bg-card border text-center">
                <MousePointer className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No Click Data Yet</h3>
                <p className="text-sm text-muted-foreground">
                    Click tracking will appear as visitors interact with your links.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Click Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <MousePointer className="w-5 h-5" />
                        <span className="text-sm opacity-90">Total Clicks</span>
                    </div>
                    <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
                </div>
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5" />
                        <span className="text-sm opacity-90">Click Rate</span>
                    </div>
                    <p className="text-3xl font-bold">{overallCTR}%</p>
                </div>
            </div>

            {/* Top Links Table */}
            <div className="rounded-xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Link2 className="h-4 w-4" />
                        Top Clicked Links
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/20">
                                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">#</th>
                                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Link</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">Clicks</th>
                                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground">CTR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topLinks.map((link, index) => (
                                <tr key={link.linkId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${getRankColor(index + 1)}`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <p className="font-medium truncate max-w-[200px]">{link.title}</p>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="font-mono font-semibold">{link.clicks.toLocaleString()}</span>
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            {link.ctr}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Clicks by Device */}
            {clicksByDevice.length > 0 && (
                <div className="rounded-xl bg-card border p-4">
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Clicks by Device
                    </h4>
                    <div className="flex gap-4">
                        {clicksByDevice.map((d) => (
                            <div key={d.device} className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-muted">
                                    {getDeviceIcon(d.device)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium capitalize">{d.device}</p>
                                    <p className="text-xs text-muted-foreground">{d.percentage}% ({d.count})</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
