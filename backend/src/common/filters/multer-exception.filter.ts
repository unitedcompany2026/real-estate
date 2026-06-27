import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';
import { MAX_UPLOAD_SIZE } from '../config/multer.config';

/**
 * Translates raw multer errors (which otherwise surface as opaque 500s) into
 * clear, actionable HTTP responses for the admin panel.
 */
@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const maxMb = Math.round(MAX_UPLOAD_SIZE / (1024 * 1024));
    let status = HttpStatus.BAD_REQUEST;
    let message = exception.message;

    switch (exception.code) {
      case 'LIMIT_FILE_SIZE':
        status = HttpStatus.PAYLOAD_TOO_LARGE; // 413
        message = `One of the images is too large. Maximum size is ${maxMb} MB per image.`;
        break;
      case 'LIMIT_FILE_COUNT':
      case 'LIMIT_UNEXPECTED_FILE':
        status = HttpStatus.BAD_REQUEST; // 400
        message =
          'Too many images uploaded at once. Please reduce the number of images and try again.';
        break;
      default:
        message = `Upload failed: ${exception.message}`;
    }

    response.status(status).json({
      statusCode: status,
      error: 'Upload Error',
      message,
    });
  }
}
