import Tesseract from 'tesseract.js';

export async function extractTextFromImage(imageUrl: string): Promise<string> {
  const { data: { text } } = await Tesseract.recognize(
    imageUrl,
    undefined,
    {
      logger: m => console.log(m),
    }
  );
  return text;
}
