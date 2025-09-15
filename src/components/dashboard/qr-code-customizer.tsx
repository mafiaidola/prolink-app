'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Image as ImageIcon, Settings2 } from 'lucide-react';

export type QrCodeCustomization = {
  foregroundColor: string;
  backgroundColor: string;
  gradient: boolean;
  logoUrl?: string;
  qrStyle: 'squares' | 'dots';
  eyeStyle: 'squares' | 'dots' | 'rounded';
};

interface QRCodeCustomizerProps {
  options: QrCodeCustomization;
  setOptions: (options: QrCodeCustomization) => void;
}

export function QRCodeCustomizer({ options, setOptions }: QRCodeCustomizerProps) {
  const handleColorChange = (key: 'foregroundColor' | 'backgroundColor', value: string) => {
    setOptions({ ...options, [key]: value });
  };

  return (
    <div className="w-full">
      <Accordion type="multiple" defaultValue={['colors']} className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              <span className="font-semibold">Colors</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={options.backgroundColor}
                    className="p-1 h-10 w-10"
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                  />
                   <Input
                    type="text"
                    value={options.backgroundColor}
                    onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fgColor">Foreground</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="fgColor"
                    type="color"
                    value={options.foregroundColor}
                    className="p-1 h-10 w-10"
                    onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                  />
                   <Input
                    type="text"
                    value={options.foregroundColor}
                    onChange={(e) => handleColorChange('foregroundColor', e.target.value)}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="gradient-switch" className="flex items-center gap-2">
                Gradient
              </Label>
              <Switch
                id="gradient-switch"
                checked={options.gradient}
                onCheckedChange={(checked) => setOptions({ ...options, gradient: checked })}
                disabled // Note: qrcode library doesn't support this out of box
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="logo">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              <span className="font-semibold">Logo Image</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Label htmlFor="logoUrl">Logo URL (optional)</Label>
            <Input
              id="logoUrl"
              placeholder="https://example.com/logo.png"
              value={options.logoUrl || ''}
              onChange={(e) => setOptions({ ...options, logoUrl: e.target.value })}
              disabled // Note: qrcode library doesn't support this out of box
            />
            <p className="text-xs text-muted-foreground">
              Note: A high QR code error correction level is required. This feature is currently disabled.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="style">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <span className="font-semibold">Style</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>QR Style</Label>
                    <Select 
                        value={options.qrStyle} 
                        onValueChange={(value: 'squares' | 'dots') => setOptions({...options, qrStyle: value})}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="squares">Squares</SelectItem>
                            <SelectItem value="dots">Dots</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Eye Style</Label>
                    <Select 
                        value={options.eyeStyle} 
                        onValueChange={(value: 'squares' | 'dots' | 'rounded') => setOptions({...options, eyeStyle: value})}
                        disabled
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Style" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="squares">Squares</SelectItem>
                             <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="rounded">Rounded</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
             </div>
             <p className="text-xs text-muted-foreground">
              Note: Advanced styling is currently disabled.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
