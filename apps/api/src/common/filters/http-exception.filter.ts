import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MulterError } from 'multer';

// Global exception filter to handle all exceptions and provide consistent error responses

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MulterError) {
      const isFileTooLarge = exception.code === 'LIMIT_FILE_SIZE';
      const status = isFileTooLarge
        ? HttpStatus.PAYLOAD_TOO_LARGE
        : HttpStatus.BAD_REQUEST;

      response.status(status).json({
        statusCode: status,
        message: isFileTooLarge
          ? 'File too large. Maximum allowed size exceeded.'
          : `Upload error: ${exception.message}`,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Handle string messages
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      }
      // Handle object responses with message property
      else if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const responseObj = exceptionResponse as Record<string, any>;
        message = Array.isArray(responseObj.message)
          ? responseObj.message[0]
          : responseObj.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
