// src/services/receiptService.ts
import { prisma } from '../prisma.js';
import { extractTextFromImage } from './ocrService.js';
import { parseReceiptText } from './receiptParser.js';
import { CloudinaryUploader } from './cloudinaryService.js';

const cloudinaryUploader = new CloudinaryUploader();

export async function processReceipt(buffer: Buffer) {
  // 1. Upload to Cloudinary
  const imageUrl = await cloudinaryUploader.uploadImageBuffer(buffer, {
    folder: 'receipts',
  });

  // 2. OCR
  const rawText = await extractTextFromImage(imageUrl);

  // 3. Parse
  const parsed = parseReceiptText(rawText);

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
}
