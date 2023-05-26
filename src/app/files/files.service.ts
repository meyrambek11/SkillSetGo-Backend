import { Injectable } from '@nestjs/common';
import { GCS_CONFIG } from './gcs.config';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class FilesService {
  private readonly storage: Storage;

  constructor() {
    this.storage = new Storage(GCS_CONFIG);
  }

  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    const bucket = this.storage.bucket('skill-set-go');
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer);

    return {
      url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    };
  }
}
