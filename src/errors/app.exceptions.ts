import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

//* global error Handling class
@Catch()
export class AppExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    //* get status code of error
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //*send error message to client
    const sendErrorResponse = (type: string, message: string) => {
      response.status(status).json({
        status: 'failed',
        path: request.url,
        errorType: type,
        message: message,
      });
    };

    //* check if error was ocurred in class-validation
    if (exception.response)
      sendErrorResponse(exception.name, exception.response.message);
    else sendErrorResponse(exception.name, exception.message);
  }
}
