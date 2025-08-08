import Tesseract from 'tesseract.js';
import { appendFileSync } from 'fs';

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  // Let Tesseract auto-detect the language from the photo
  const { data: { text } } = await Tesseract.recognize(
    imageUrl,
    undefined,
    {
      logger: m => console.log(m),
    }
  );
  const filePath = 'ocr_results.txt';
  appendFileSync(filePath, text.trim() + '\n');
  return text;
}
