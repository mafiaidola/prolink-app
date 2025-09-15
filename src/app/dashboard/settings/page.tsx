import { getHomepageContent } from "@/lib/data";
import { SettingsForm } from "./settings-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
    const content = await getHomepageContent();

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your application settings.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                    <CardDescription>Customize the text and features displayed on your landing page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm content={content} />
                </CardContent>
            </Card>
        </div>
    );
}
