'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { Loader2, Download } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { generateQrCode, GenerateQrCodeInput } from '@/ai/flows/generate-qr-code';
import { QRCodeCustomizer, QrCodeCustomization } from './qr-code-customizer';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
};

const OFFICIAL_DOMAIN = "bio.ep-eg.com";

export function QRCodeDialog({ open, onOpenChange, profile }: Props) {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customization, setCustomization] = useState<QrCodeCustomization>({
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    gradient: false,
    qrStyle: 'squares',
    eyeStyle: 'squares',
  });
  
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (open && profile?.slug) {
      setIsLoading(true);
      setError(null);
      
      const profileUrl = `https://${OFFICIAL_DOMAIN}/${profile.slug}`;
      const input: GenerateQrCodeInput = {
        text: profileUrl,
        foregroundColor: customization.foregroundColor,
        backgroundColor: customization.backgroundColor,
        gradient: customization.gradient,
        qrStyle: customization.qrStyle,
        eyeStyle: customization.eyeStyle,
        logoUrl: customization.logoUrl,
      };

      generateQrCode(input)
        .then(result => {
          setQrCodeUrl(result.qrCodeDataUrl);
        })
        .catch(err => {
          console.error("Failed to generate QR code", err);
          setError('Could not generate QR code. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [open, profile, customization]);

  const handleDownload = () => {
    if (anchorRef.current && qrCodeUrl) {
        anchorRef.current.href = qrCodeUrl;
        anchorRef.current.download = `${profile.slug}-qrcode.png`;
        anchorRef.current.click();
    }
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col">
            <DialogHeader>
                <DialogTitle>QR Code for {profile.name}</DialogTitle>
                <DialogDescription>
                    Customize and download the QR code for your profile. It will link to `https://{OFFICIAL_DOMAIN}/{profile.slug}`
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow flex justify-center items-center p-4 min-h-[320px]">
                {isLoading ? (
                    <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-md flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    </div>
                ) : error ? (
                    <p className="text-destructive text-center">{error}</p>
                ) : qrCodeUrl ? (
                    <img src={qrCodeUrl} alt={`QR Code for ${profile.name}`} className="w-64 h-64 rounded-lg shadow-md" />
                ) : (
                    <p className="text-destructive">Failed to load QR code.</p>
                )}
            </div>
            <DialogFooter className="mt-auto">
                <a
                    ref={anchorRef}
                    href="#"
                    className="hidden"
                />
                <Button onClick={handleDownload} disabled={isLoading || !qrCodeUrl} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                </Button>
            </DialogFooter>
        </div>
        <div className="md:border-l md:pl-6">
           <h3 className="text-lg font-semibold mb-4">Customize</h3>
           <QRCodeCustomizer options={customization} setOptions={setCustomization} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
