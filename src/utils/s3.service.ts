import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;
  // private expirationInSeconds: number = 1800;
  private mimeTypeMap: Map<string, string> = new Map([
    ['jpg', 'image/jpeg'],
    ['jpeg', 'image/jpeg'],
    ['png', 'image/png'],
    ['gif', 'image/gif'],
    ['bmp', 'image/bmp'],
    ['tiff', 'image/tiff'],
    ['webp', 'image/webp'],
    ['pdf', 'application/pdf'],
    ['doc', 'application/msword'],
    [
      'docx',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    ['xls', 'application/vnd.ms-excel'],
    [
      'xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    ['ppt', 'application/vnd.ms-powerpoint'],
    [
      'pptx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
    ['txt', 'text/plain'],
    ['csv', 'text/csv'],
    ['zip', 'application/zip'],
    ['rar', 'application/x-rar-compressed'],
  ]);

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.bucketName = this.configService.get('AWS_S3_BUCKET');
  }

  async uploadFile(file: Express.Multer.File): Promise<{ key: string }> {
    // Generate unique filename
    const key = `${uuidv4()}-${file.originalname}`;

    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await this.s3.send(new PutObjectCommand(params));
    return { key };
  }

  async getPreSignedURL(key: string): Promise<{
    fileUrl: string;
    mimeType: string;
    key: string;
    newFileName: string;
  }> {
    const contentType = this.getContentTypeFromMap(key);
    const newFileName = `${uuidv4()}-${key}`;

    // Generate PUT URL for upload
    const putParams = {
      Bucket: this.bucketName,
      Key: newFileName,
      ContentType: contentType,
    };

    const fileUrl = await getSignedUrl(
      this.s3,
      new PutObjectCommand(putParams),
      { expiresIn: 360000 },
    );

    return {
      fileUrl,
      mimeType: contentType,
      key,
      newFileName,
    };
  }

  getContentTypeFromMap(fileName: string): string {
    const ext = fileName
      .slice(Math.max(0, fileName.lastIndexOf('.') + 1))
      .toLowerCase();
    return this.mimeTypeMap.get(ext) || 'application/octet-stream';
  }

  async getFileUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 3600,
    });

    return signedUrl;
  }
}
