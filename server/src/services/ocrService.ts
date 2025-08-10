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
      // Wait for initialization to complete
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

  public async extractText(imageUrl: string): Promise<string> {
    try {
      const worker = await this.initializeWorker();

      console.log('Starting OCR recognition...');
      const { data: { text } } = await worker.recognize(imageUrl);

      console.log('OCR completed successfully, text length:', text.length);
      return text;

    } catch (error) {
      console.error('OCR processing failed:', error);
      // If worker failed, reset it for next attempt
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

// Export the singleton function that matches your current interface
export async function extractTextFromImage(imageUrl: string): Promise<string> {
  const ocrService = OCRService.getInstance();
  return ocrService.extractText(imageUrl);
}

// Export function to manually clean up resources (call this on app shutdown)
export async function terminateOCRService(): Promise<void> {
  const ocrService = OCRService.getInstance();
  await ocrService.terminate();
}
