import Tesseract from 'tesseract.js';

class OCRService {
  private static instance: OCRService;
  private worker: Tesseract.Worker | null = null;
  private isInitializing = false;

  private constructor() { }

  public static getInstance(): OCRService {
    if (!OCRService.instance) {
      OCRService.instance = new OCRService();
    }
    return OCRService.instance;
  }

  private async initializeWorker(): Promise<Tesseract.Worker> {
    if (this.worker) {
      return this.worker;
    }

    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.worker!;
    }

    try {
      this.isInitializing = true;
      console.log('Initializing OCR worker...');

      this.worker = await Tesseract.createWorker('eng', 1, {
        logger: m => console.log(m),
        cacheMethod: 'write',
      });

      await this.worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
        tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,:/()-$%',
        preserve_interword_spaces: '1',
      });

      console.log('OCR worker initialized successfully');
      return this.worker;

    } finally {
      this.isInitializing = false;
    }
  }

  public async extractText(input: Buffer | string): Promise<string> {
    try {
      const worker = await this.initializeWorker();

      console.log('Starting OCR recognition...');
      const { data: { text } } = await worker.recognize(input);
      console.log('OCR completed successfully, text length:', text.length);

      // Validate that we got meaningful text
      if (!text || text.trim().length < 10) {
        throw new Error('OCR produced insufficient text content');
      }

      return text;

    } catch (error) {
      console.error('OCR processing failed:', error);
      if (this.worker) {
        try {
          await this.worker.terminate();
        } catch (e) {
          console.error('Error terminating failed worker:', e);
        }
        this.worker = null;
      }
      throw new Error('Failed to extract text from image');
    }
  }

  public async terminate(): Promise<void> {
    if (this.worker) {
      try {
        await this.worker.terminate();
        console.log('OCR worker terminated successfully');
      } catch (error) {
        console.error('Error terminating OCR worker:', error);
      } finally {
        this.worker = null;
      }
    }
  }
}

export async function extractTextFromImage(input: Buffer | string): Promise<string> {
  const ocrService = OCRService.getInstance();
  return ocrService.extractText(input);
}

export async function terminateOCRService(): Promise<void> {
  const ocrService = OCRService.getInstance();
  await ocrService.terminate();
}
