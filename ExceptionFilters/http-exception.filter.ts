import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ConflictException, BadRequestException, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { error, timeStamp } from 'console';
import { Request, Response } from 'express';
import path from 'path';
import { NotFoundError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if(exception instanceof ConflictException) {
      this.setErrorResponse(response, `Conflict ${exception.message}`,409,request.url);
      return;
    }
    else if(exception instanceof BadRequestException) {
      this.setErrorResponse(response,`BadRequest ${exception.message}`,400,request.url);
      return;
    }
    else if(exception instanceof UnauthorizedException) {
      this.setErrorResponse(response, `Unauthorized ${exception.message}`,401,request.url);
      return;
    }
    else if(exception instanceof ForbiddenException) {
      this.setErrorResponse(response, `Forbidden ${exception.message}`,403,request.url);
      return;
    }
    else if(exception instanceof NotFoundException) {
      this.setErrorResponse(response, `NotFount ${exception.message}`,404,request.url);
      return;
    }
    else {
      this.setErrorResponse(response, `Unknown Error`,500,request.url)
    }

  }

  private setErrorResponse(
    response: Response,
    message: string,
    statusCode: number,
    path: string
  ){
    response.status(statusCode).json({
      statusCode,
      message,
      timeStamp: new Date().toISOString(),
      path,
    })

  }
}