'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Eye, MoreHorizontal, Pencil, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { QRCodeDialog } from './qr-code-dialog';
import type { Profile } from '@/lib/types';

export function ProfileActions({ profile }: { profile: Profile }) {
  const [showQrCode, setShowQrCode] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/edit/${profile.slug}`}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${profile.slug}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              <span>View Public Page</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowQrCode(true)}>
            <QrCode className="mr-2 h-4 w-4" />
            <span>Show QR Code</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <QRCodeDialog
        open={showQrCode}
        onOpenChange={setShowQrCode}
        profile={profile}
      />
    </>
  );
}
