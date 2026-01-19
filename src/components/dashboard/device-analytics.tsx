'use client';

import { Smartphone, Monitor, Tablet, Chrome, Globe, Apple } from 'lucide-react';

interface DeviceAnalyticsProps {
    devices: { device: string; count: number; percentage: number }[];
    browsers: { browser: string; count: number; percentage: number }[];
    os: { os: string; count: number; percentage: number }[];
    totalViews: number;
}

// Device icons
function getDeviceIcon(device: string) {
    switch (device.toLowerCase()) {
        case 'mobile': return <Smartphone className="w-5 h-5" />;
        case 'tablet': return <Tablet className="w-5 h-5" />;
        default: return <Monitor className="w-5 h-5" />;
    }
}

// Browser icons  
function getBrowserIcon(browser: string) {
    const b = browser.toLowerCase();
    if (b.includes('chrome')) return '🌐';
    if (b.includes('safari')) return '🧭';
    if (b.includes('firefox')) return '🦊';
    if (b.includes('edge')) return '🔷';
    if (b.includes('opera')) return '🔴';
    if (b.includes('samsung')) return '📱';
    return '🌐';
}

// OS icons
function getOSIcon(os: string) {
    const o = os.toLowerCase();
    if (o.includes('windows')) return '🪟';
    if (o.includes('macos') || o.includes('mac')) return '🍎';
    if (o.includes('ios')) return '📱';
    if (o.includes('android')) return '🤖';
    if (o.includes('linux')) return '🐧';
    return '💻';
}

// Device colors
function getDeviceColor(device: string) {
    switch (device.toLowerCase()) {
        case 'mobile': return 'from-pink-500 to-rose-500';
        case 'tablet': return 'from-purple-500 to-indigo-500';
        default: return 'from-blue-500 to-cyan-500';
    }
}

export function DeviceAnalytics({ devices, browsers, os, totalViews }: DeviceAnalyticsProps) {
    if (totalViews === 0) {
        return (
            <div className="p-6 rounded-xl bg-card border text-center">
                <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No Device Data Yet</h3>
                <p className="text-sm text-muted-foreground">
                    Device analytics will appear as visitors access your profiles.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Device Type Breakdown */}
            <div className="rounded-xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h4 className="font-semibold flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Device Type
                    </h4>
                </div>
                <div className="p-4">
                    {/* Visual pie-chart-like representation */}
                    <div className="flex gap-2 mb-4 h-4 rounded-full overflow-hidden">
                        {devices.map((d) => (
                            <div
                                key={d.device}
                                className={`bg-gradient-to-r ${getDeviceColor(d.device)} transition-all`}
                                style={{ width: `${d.percentage}%` }}
                                title={`${d.device}: ${d.percentage}%`}
                            />
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-4">
                        {devices.map((d) => (
                            <div key={d.device} className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${getDeviceColor(d.device)} text-white`}>
                                    {getDeviceIcon(d.device)}
                                </div>
                                <div>
                                    <p className="font-medium capitalize">{d.device}</p>
                                    <p className="text-sm text-muted-foreground">{d.percentage}% ({d.count})</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Two-column layout for browsers and OS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Browser Breakdown */}
                <div className="rounded-xl bg-card border overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Chrome className="h-4 w-4" />
                            Browsers
                        </h4>
                    </div>
                    <div className="p-4 space-y-3">
                        {browsers.slice(0, 5).map((b) => (
                            <div key={b.browser} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span>{getBrowserIcon(b.browser)}</span>
                                        <span>{b.browser}</span>
                                    </span>
                                    <span className="text-muted-foreground">{b.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                                        style={{ width: `${b.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OS Breakdown */}
                <div className="rounded-xl bg-card border overflow-hidden">
                    <div className="p-4 border-b bg-muted/30">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Operating Systems
                        </h4>
                    </div>
                    <div className="p-4 space-y-3">
                        {os.slice(0, 5).map((o) => (
                            <div key={o.os} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span>{getOSIcon(o.os)}</span>
                                        <span>{o.os}</span>
                                    </span>
                                    <span className="text-muted-foreground">{o.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                                        style={{ width: `${o.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
