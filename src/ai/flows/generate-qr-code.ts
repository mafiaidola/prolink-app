'use server';

/**
 * @fileOverview Generates a customizable QR code.
 *
 * - generateQrCode - A function that generates a QR code as a data URI.
 * - GenerateQrCodeInput - The input type for the generateQrCode function.
 * - GenerateQrCodeOutput - The return type for the generateQrCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import QRCode from 'qrcode';

export const GenerateQrCodeInputSchema = z.object({
  text: z.string().describe('The text or URL to encode in the QR code.'),
  foregroundColor: z.string().optional().default('#000000').describe('The foreground color of the QR code (hex).'),
  backgroundColor: z.string().optional().default('#ffffff').describe('The background color of the QR code (hex).'),
  gradient: z.boolean().optional().default(false).describe('Whether to apply a gradient.'),
  logoUrl: z.string().optional().describe('URL of a logo to embed in the QR code.'),
  qrStyle: z.enum(['squares', 'dots']).optional().default('squares').describe('The style of the QR code modules.'),
  eyeStyle: z.enum(['squares', 'dots', 'rounded']).optional().default('squares').describe('The style of the QR code eye frames.'),
});

export type GenerateQrCodeInput = z.infer<typeof GenerateQrCodeInputSchema>;

export const GenerateQrCodeOutputSchema = z.object({
  qrCodeDataUrl: z.string().describe('The generated QR code as a base64 data URI.'),
});

export type GenerateQrCodeOutput = z.infer<typeof GenerateQrCodeOutputSchema>;

async function generate(input: GenerateQrCodeInput): Promise<GenerateQrCodeOutput> {
    const options: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H', // High correction level for logo embedding
        margin: 2,
        width: 300,
        color: {
            dark: input.foregroundColor,
            light: input.backgroundColor,
        },
    };
    
    const qrCodeDataUrl = await QRCode.toDataURL(input.text, options);
    
    // NOTE: The 'qrcode' library does not support advanced customizations like gradients,
    // logo embedding, or different dot/eye styles out-of-the-box.
    // The schema includes these for future enhancement with a more advanced library.
    // For now, we return the basic, colored QR code.
    
    return { qrCodeDataUrl };
}


export const generateQrCode = ai.defineFlow(
  {
    name: 'generateQrCodeFlow',
    inputSchema: GenerateQrCodeInputSchema,
    outputSchema: GenerateQrCodeOutputSchema,
  },
  async (input) => {
    return await generate(input);
  }
);
