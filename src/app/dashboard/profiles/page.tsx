import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getProfiles } from '@/lib/data';
import type { Profile } from '@/lib/types';
import { Eye, MoreHorizontal, Pencil, PlusCircle, QrCode } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { QRCodeDialog } from '@/components/dashboard/qr-code-dialog';
import React from 'react';
import { ProfileActions } from '@/components/dashboard/profile-actions';

export default async function ProfilesPage() {
    const profiles = await getProfiles();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Profiles</h1>
                    <p className="text-muted-foreground">Manage and customize your bio link profiles.</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Bio
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>All Profiles</CardTitle>
                    <CardDescription>A list of all profiles in your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {profiles.map((profile: Profile) => (
                                <TableRow key={profile.id}>
                                    <TableCell className="font-medium">{profile.name}</TableCell>
                                    <TableCell className="text-muted-foreground">/{profile.slug}</TableCell>
                                    <TableCell>
                                        <Badge variant={profile.isPublished ? 'default' : 'secondary'}>
                                            {profile.isPublished ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                       <ProfileActions profile={profile} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
