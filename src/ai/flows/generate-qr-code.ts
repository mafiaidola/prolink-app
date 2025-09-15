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

const GenerateQrCodeInputSchema = z.object({
  text: z.string().describe('The text or URL to encode in the QR code.'),
  foregroundColor: z.string().optional().default('#000000').describe('The foreground color of the QR code (hex).'),
  backgroundColor: z.string().optional().default('#ffffff').describe('The background color of the QR code (hex).'),
  // The following fields are for future extension and not fully supported by the 'qrcode' library out of the box.
  gradient: z.boolean().optional().default(false).describe('Whether to apply a gradient.'),
  logoUrl: z.string().optional().describe('URL of a logo to embed in the QR code.'),
  qrStyle: z.enum(['squares', 'dots']).optional().default('squares').describe('The style of the QR code modules.'),
  eyeStyle: z.enum(['squares', 'dots', 'rounded']).optional().default('squares').describe('The style of the QR code eye frames.'),
});

export type GenerateQrCodeInput = z.infer<typeof GenerateQrCodeInputSchema>;

const GenerateQrCodeOutputSchema = z.object({
  qrCodeDataUrl: z.string().describe('The generated QR code as a base64 data URI.'),
});

export type GenerateQrCodeOutput = z.infer<typeof GenerateQrCodeOutputSchema>;


const generateQrCodeFlow = ai.defineFlow(
  {
    name: 'generateQrCodeFlow',
    inputSchema: GenerateQrCodeInputSchema,
    outputSchema: GenerateQrCodeOutputSchema,
  },
  async (input) => {
    // The 'qrcode' library has limited styling options.
    // We will use the primary color options and keep the schema for future enhancements.
    const options: QRCode.QRCodeToDataURLOptions = {
        errorCorrectionLevel: 'H', // High correction level for better readability, especially if a logo is overlaid manually.
        margin: 2,
        width: 300,
        color: {
            dark: input.foregroundColor,
            light: input.backgroundColor,
        },
    };
    
    // The `qrcode` library does not natively support gradients, custom module/eye styles, or logo embedding.
    // These would require a more advanced library or manual canvas manipulation.
    // For now, we generate a solid-color QR code.
    const qrCodeDataUrl = await QRCode.toDataURL(input.text, options);
    
    return { qrCodeDataUrl };
  }
);

export async function generateQrCode(input: GenerateQrCodeInput): Promise<GenerateQrCodeOutput> {
    return generateQrCodeFlow(input);
}
