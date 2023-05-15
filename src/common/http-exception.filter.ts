import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    const validationErrors = Array.isArray(exceptionResponse['message'])
      ? exceptionResponse['message']
      : null;

    response.status(status).json({
      success: false,
      error: exception.message,
      validationErrors: validationErrors,
      data: null,
      meta: null,
    });
  }
}
