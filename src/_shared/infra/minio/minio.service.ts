import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;

  constructor() {
    this.client = new Minio.Client({
      endPoint: 'minio-fcwkwk0k8c44ccccscw4ckok.ragde.app',
      useSSL: true,
      accessKey: 'ODGZiX0AeOuxBtHQ',
      secretKey: 'DBu4Np5nYdoNxEI2KfUpw4cUvtl5M398',
    });
  }

  async upload(
    bucket: string,
    fileName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    return this.client.putObject(bucket, fileName, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
  }

  async getFile(bucket: string, fileName: string) {
    return this.client.getObject(bucket, fileName);
  }

  async delete(bucket: string, fileName: string) {
    return this.client.removeObject(bucket, fileName);
  }
}
