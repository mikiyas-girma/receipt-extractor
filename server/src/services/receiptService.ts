// src/services/receiptService.ts
import { prisma } from '../prisma.js';
import { extractTextFromImage } from './ocrService.js';
import { parseReceiptText } from './receiptParser.js';
import { CloudinaryUploader } from './cloudinaryService.js';
import { GraphQLError } from 'graphql';

const cloudinaryUploader = new CloudinaryUploader();

export async function processReceipt(buffer: Buffer) {
  try {
    // 1. OCR
    const rawText = await extractTextFromImage(buffer);

    // 2. Parse
    const parsed = parseReceiptText(rawText);

    // Validate parsed data
    if (!parsed.storeName || parsed.storeName === 'Unknown Store' || 
        !parsed.totalAmount || parsed.items.length === 0) {
      throw new GraphQLError('Could not extract meaningful data from the receipt image');
    }

    // 3. Upload to Cloudinary only if OCR and parsing were successful
    const imageUrl = await cloudinaryUploader.uploadImageBuffer(buffer, {
      folder: 'receipts',
    });

    // 4. Save to DB
    const receipt = await prisma.receipt.create({
      data: {
        storeName: parsed.storeName,
        purchaseDate: parsed.purchaseDate,
        totalAmount: parsed.totalAmount,
        imageUrl,
        items: {
          create: parsed.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return receipt;
  } catch (error) {
    // Ensure any error is properly propagated
    if (error instanceof GraphQLError) {
      throw error;
    }
    throw new GraphQLError(error instanceof Error ? error.message : 'Failed to process receipt');
  }
}
