import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  private s3 = new S3();

  async upload(file: Express.Multer.File): Promise<{ url: string }> {
    const uploadedFile = await this.s3
      .upload({
        Bucket: process.env.BUCKET_NAME,
        Body: file.buffer,
        ACL: 'public-read',
        ContentType: file.mimetype,
        Key: `${uuid()}-${file.originalname}`,
      })
      .promise()
      .then(
        (data: ManagedUpload.SendData) => {
          return data;
        },
        (reason) => {
          console.log(reason);
          throw new ServiceUnavailableException(reason.message);
        },
      );
    return { url: uploadedFile.Location };
  }
}
