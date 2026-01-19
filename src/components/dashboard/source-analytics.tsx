'use client';

import { QrCode, Share2, Search, Link2, ExternalLink } from 'lucide-react';

interface SourceAnalyticsProps {
    sources: { source: string; count: number; percentage: number; icon: string }[];
    qrScans: number;
    totalViews: number;
}

// Get gradient colors for sources
function getSourceColor(source: string) {
    const s = source.toLowerCase();
    if (s.includes('qr')) return 'from-violet-500 to-purple-600';
    if (s.includes('social')) return 'from-pink-500 to-rose-500';
    if (s.includes('search')) return 'from-blue-500 to-cyan-500';
    if (s.includes('direct')) return 'from-green-500 to-emerald-500';
    if (s.includes('referral')) return 'from-orange-500 to-amber-500';
    return 'from-gray-500 to-slate-500';
}

// Get icons for sources
function getSourceIcon(source: string) {
    const s = source.toLowerCase();
    if (s.includes('qr')) return <QrCode className="w-5 h-5" />;
    if (s.includes('social')) return <Share2 className="w-5 h-5" />;
    if (s.includes('search')) return <Search className="w-5 h-5" />;
    if (s.includes('direct')) return <Link2 className="w-5 h-5" />;
    if (s.includes('referral')) return <ExternalLink className="w-5 h-5" />;
    return <Link2 className="w-5 h-5" />;
}

export function SourceAnalytics({ sources, qrScans, totalViews }: SourceAnalyticsProps) {
    if (totalViews === 0 || sources.length === 0) {
        return (
            <div className="p-6 rounded-xl bg-card border text-center">
                <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No Source Data Yet</h3>
                <p className="text-sm text-muted-foreground">
                    Traffic source data will appear as visitors access your profiles.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* QR Scan Highlight Card */}
            {qrScans > 0 && (
                <div className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm opacity-90">QR Code Scans</p>
                                <p className="text-2xl font-bold">{qrScans.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">
                                {totalViews > 0 ? Math.round((qrScans / totalViews) * 100) : 0}%
                            </p>
                            <p className="text-sm opacity-90">of traffic</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Source Breakdown */}
            <div className="rounded-xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Share2 className="h-4 w-4" />
                        Traffic Sources
                    </h4>
                </div>
                <div className="p-4 space-y-4">
                    {sources.map((s, index) => (
                        <div key={s.source} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getSourceColor(s.source)} text-white`}>
                                        {getSourceIcon(s.source)}
                                    </div>
                                    <div>
                                        <p className="font-medium">{s.source}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {s.count.toLocaleString()} visits
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">{s.percentage}%</p>
                                </div>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${getSourceColor(s.source)} rounded-full transition-all duration-500`}
                                    style={{ width: `${s.percentage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Source Pie Visual */}
            <div className="rounded-xl bg-card border p-4">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Source Distribution</h4>
                <div className="flex gap-1 h-6 rounded-full overflow-hidden">
                    {sources.map((s) => (
                        <div
                            key={s.source}
                            className={`bg-gradient-to-r ${getSourceColor(s.source)} transition-all cursor-pointer hover:opacity-80`}
                            style={{ width: `${s.percentage}%` }}
                            title={`${s.source}: ${s.percentage}%`}
                        />
                    ))}
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                    {sources.map((s) => (
                        <div key={s.source} className="flex items-center gap-1 text-xs">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getSourceColor(s.source)}`} />
                            <span>{s.source}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
