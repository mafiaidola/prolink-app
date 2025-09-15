'use client';

import { useState, ChangeEvent, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  recommendedSize: string;
  className?: string;
  isAvatar?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  recommendedSize,
  className,
  isAvatar = false,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        onChange(result); // Pass base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onChange('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed border-border rounded-md p-4 flex justify-center items-center cursor-pointer hover:border-primary transition-all ${
          isAvatar ? 'w-32 h-32 rounded-full' : 'w-full aspect-[16/6]'
        }`}
        onClick={triggerFileSelect}
      >
        {previewUrl ? (
          <>
            {isAvatar ? (
              <Avatar className="w-full h-full">
                <AvatarImage src={previewUrl} alt="Preview" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            ) : (
              <Image
                src={previewUrl}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            <UploadCloud className="mx-auto h-8 w-8 mb-2" />
            <p className="text-sm font-semibold">Click to upload image</p>
            <p className="text-xs">Recommended size: {recommendedSize}</p>
          </div>
        )}
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
}
