import { ProfileForm } from "@/components/dashboard/profile-form";
import { getProfileBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
    params: { slug: string };
};

export default async function EditProfilePage({ params }: Props) {
    const profile = await getProfileBySlug(params.slug);

    if (!profile) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <Button variant="ghost" asChild className="-ml-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Profiles
                    </Link>
                </Button>
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Edit Profile</h1>
                    <p className="text-muted-foreground">Editing profile for <span className="font-semibold text-primary">{profile.name}</span></p>
                </div>
            </div>
            <ProfileForm profile={profile} />
        </div>
    );
}
