import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Único punto donde se traduce cualquier excepción a la forma
 * de respuesta de error estándar de la API (ver docs/api/).
 *
 * Los controllers y services NUNCA formatean errores manualmente:
 * lanzan excepciones (HttpException o de negocio) y este filtro
 * se encarga del resto.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message =
      (typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        (exceptionResponse as Record<string, unknown>).message) ||
      (exception as Error)?.message ||
      'Error interno del servidor';

    if (!isHttpException) {
      // Solo se loguea con stack completo lo que NO es un error de negocio esperado.
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
