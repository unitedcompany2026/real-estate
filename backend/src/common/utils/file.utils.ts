import { promises as fs } from 'fs';
import path from 'path';

export class FileUtils {
  static generateImageUrl(
    file: Express.Multer.File | undefined,
    folder: string,
  ): string | null {
    if (!file || !file.filename) {
      return null;
    }

    return `uploads/${folder}/${file.filename}`;
  }

  static async deleteFile(relativePath: string) {
    if (!relativePath) return;

    // Handle both formats: with or without leading slash
    const cleanPath = relativePath.startsWith('/')
      ? relativePath.substring(1)
      : relativePath;

    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    try {
      await fs.unlink(fullPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.warn(`⚠️ Failed to delete file: ${fullPath}`, err.message);
      }
    }
  }
}
