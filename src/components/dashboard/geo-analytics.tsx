'use client';

import { Globe, MapPin, Flag, TrendingUp } from 'lucide-react';

// Country flag emoji mapping
function getCountryFlag(code: string): string {
    if (!code || code.length !== 2) return '🌍';
    const codePoints = code
        .toUpperCase()
        .split('')
        .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

interface GeoAnalyticsProps {
    countries: { code: string; name: string; count: number; percentage: number }[];
    totalWithGeo: number;
}

export function GeoAnalytics({ countries, totalWithGeo }: GeoAnalyticsProps) {
    if (countries.length === 0) {
        return (
            <div className="p-6 rounded-xl bg-card border text-center">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-1">No Geo Data Yet</h3>
                <p className="text-sm text-muted-foreground">
                    Geographic data will appear here as visitors access your profiles.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold">Visitor Locations</h3>
                    <p className="text-sm text-muted-foreground">
                        {totalWithGeo.toLocaleString()} visitors with location data
                    </p>
                </div>
            </div>

            {/* Top Countries */}
            <div className="rounded-xl bg-card border overflow-hidden">
                <div className="p-4 border-b bg-muted/30">
                    <h4 className="font-medium flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Top Countries
                    </h4>
                </div>
                <div className="divide-y">
                    {countries.slice(0, 10).map((country, index) => (
                        <div
                            key={country.code}
                            className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-center text-muted-foreground font-mono text-sm">
                                    {index + 1}
                                </span>
                                <span className="text-2xl">{getCountryFlag(country.code)}</span>
                                <div>
                                    <p className="font-medium">{country.name}</p>
                                    <p className="text-xs text-muted-foreground">{country.code}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{country.count.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{country.percentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distribution Bar Chart */}
            {countries.length > 0 && (
                <div className="rounded-xl bg-card border p-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Distribution
                    </h4>
                    <div className="space-y-3">
                        {countries.slice(0, 5).map((country) => (
                            <div key={country.code} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <span>{getCountryFlag(country.code)}</span>
                                        <span>{country.name}</span>
                                    </span>
                                    <span className="text-muted-foreground">{country.percentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${country.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Country Grid (small flags for remaining countries) */}
            {countries.length > 5 && (
                <div className="rounded-xl bg-card border p-4">
                    <h4 className="font-medium mb-3 text-sm text-muted-foreground">
                        Other Countries ({countries.length - 5} more)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {countries.slice(5).map((country) => (
                            <div
                                key={country.code}
                                className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                                title={`${country.name}: ${country.count} visitors`}
                            >
                                <span>{getCountryFlag(country.code)}</span>
                                <span className="text-muted-foreground">{country.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
