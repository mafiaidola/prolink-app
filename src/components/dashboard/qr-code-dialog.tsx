'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  name: string;
};

export function QRCodeDialog({ open, onOpenChange, slug, name }: Props) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (open && slug) {
      const profileUrl = `${window.location.origin}/${slug}`;
      const googleChartsUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(profileUrl)}&choe=UTF-8`;
      setQrCodeUrl(googleChartsUrl);
    }
  }, [open, slug]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${slug}-qrcode.png`;
    document.body.appendChild(link);
    // We need to fetch the image and convert it to a blob to download it
    // as Google Charts URL is not a direct download link.
    fetch(qrCodeUrl)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            link.href = blobUrl;
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code for {name}</DialogTitle>
          <DialogDescription>
            Scan this QR code to view the profile. You can also download it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center p-4">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt={`QR Code for ${name}`} className="w-64 h-64" />
          ) : (
            <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-md" />
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleDownload} disabled={!qrCodeUrl}>
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
