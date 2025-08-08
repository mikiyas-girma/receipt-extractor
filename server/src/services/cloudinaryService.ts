import multer, { Multer } from "multer";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

export interface UploadOptions {
  folder?: string;
  resize?: {
    width: number;
    height: number;
  };
  transformation?: any[];
}

export class CloudinaryUploader {
  private storage: multer.StorageEngine;

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_SECRET!,
    });
    this.storage = multer.memoryStorage();
  }

  public imageUpload(fieldName = 'images', maxCount = 10): Multer {
    return multer({
      storage: this.storage,
      fileFilter: (req, file, cb: any) => {
        if (!file.mimetype.startsWith("image/")) {
          return cb(new Error("Please upload an image file"), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 15 * 1024 * 1024,
      }
    });
  }

  private uploadBuffer(buffer: Buffer, options: UploadOptions = {}): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadOptions = {
        folder: options.folder || "default",
        transformation: options.transformation || []
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          if (result && result.secure_url) return resolve(result.secure_url);
          return reject(new Error("Upload failed"));
        }
      );
      uploadStream.end(buffer);
    });
  }

  public async uploadImageBuffer(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<string> {
    let processedBuffer = buffer;
    if (options.resize) {
      processedBuffer = await sharp(buffer)
        .resize(options.resize.width, options.resize.height)
        .toBuffer();
    }
    return await this.uploadBuffer(processedBuffer, options);
  }

  public async deleteFile(publicId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: Error | undefined, result: { result?: string } | undefined) => {
        if (error) return reject(error);
        resolve(result?.result === 'ok');
      });
    });
  }
}
