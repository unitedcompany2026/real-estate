import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

// Max upload size per file. Modern phone/camera photos routinely exceed the
// previous 5 MB cap, which silently caused admin upload failures.
export const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25 MB

export const multerConfig = (folder: string) => ({
  storage: diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const uploadPath = `public/uploads/${folder}`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const shortUuid = uuidv4().substring(0, 8);
      const timestamp = Date.now();
      const ext = extname(file.originalname);
      cb(null, `${timestamp}-${shortUuid}${ext}`);
    },
  }),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|avif)$/)) {
      cb(null, true);
    } else {
      // Throwing an HttpException here makes Nest return a clean 400 with a
      // readable message instead of an opaque 500. HEIC/HEIF (iPhone default)
      // is intentionally rejected because browsers cannot render it.
      cb(
        new BadRequestException(
          `Unsupported file type "${file.mimetype}". Allowed: JPG, PNG, WEBP, GIF, AVIF. (iPhone HEIC photos must be exported as JPG first.)`,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: MAX_UPLOAD_SIZE,
  },
});
