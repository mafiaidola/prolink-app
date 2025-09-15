'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slug: string;
  name: string;
};

export function QRCodeDialog({ open, onOpenChange, slug, name }: Props) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open && slug) {
      setIsLoading(true);
      const profileUrl = `${window.location.origin}/${slug}`;
      const googleChartsUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(profileUrl)}&choe=UTF-8`;
      
      // Use fetch to get the QR code as a blob URL to enable direct download
      fetch(googleChartsUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          setQrCodeUrl(blobUrl);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch QR code", error);
          setIsLoading(false);
        });

      // Cleanup blob URL on component unmount or when dialog closes
      return () => {
        if (qrCodeUrl) {
          window.URL.revokeObjectURL(qrCodeUrl);
        }
      };
    }
  }, [open, slug]);

  const handleDownload = () => {
    if (anchorRef.current) {
        anchorRef.current.click();
    }
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
        <div className="flex justify-center items-center p-4 min-h-[256px]">
          {isLoading ? (
            <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
            </div>
          ) : qrCodeUrl ? (
            <img src={qrCodeUrl} alt={`QR Code for ${name}`} className="w-64 h-64" />
          ) : (
            <p className="text-destructive">Failed to load QR code.</p>
          )}
        </div>
        <div className="flex justify-end">
           <a
            ref={anchorRef}
            href={qrCodeUrl}
            download={`${slug}-qrcode.png`}
            className="hidden"
            />
          <Button onClick={handleDownload} disabled={isLoading || !qrCodeUrl}>
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
