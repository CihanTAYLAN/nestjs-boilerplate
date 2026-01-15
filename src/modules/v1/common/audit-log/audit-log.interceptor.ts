import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    const userId = request.user?.sub;
    const method = request.method;
    const url = request.url;
    const ipAddress = this.getClientIp(request);
    const userAgent = request.get('User-Agent');

    let requestData: any = null;
    let responseData: any = null;
    let statusCode: number = 200;
    let errorMessage: string | undefined;

    // Safely copy request body
    if (request.body && Object.keys(request.body).length > 0) {
      requestData = this.sanitizeData(request.body);
    }

    // Add query params
    if (request.query && Object.keys(request.query).length > 0) {
      requestData = {
        ...requestData,
        query: this.sanitizeData(request.query),
      };
    }

    // Add params
    if (request.params && Object.keys(request.params).length > 0) {
      requestData = {
        ...requestData,
        params: this.sanitizeData(request.params),
      };
    }

    return next.handle().pipe(
      tap({
        next: (data) => {
          statusCode = response.statusCode || 200;
          responseData = this.sanitizeData(data);

          this.logRequest(
            userId,
            method,
            url,
            ipAddress,
            userAgent,
            requestData,
            responseData,
            statusCode,
            Date.now() - startTime,
          );
        },
        error: (error) => {
          statusCode = error.status || 500;
          errorMessage = error.message || 'Unknown error';

          this.logRequest(
            userId,
            method,
            url,
            ipAddress,
            userAgent,
            requestData,
            null,
            statusCode,
            Date.now() - startTime,
            errorMessage,
          );

          throw error;
        },
      }),
    );
  }

  private logRequest(
    userId: string | undefined,
    method: string,
    url: string,
    ipAddress: string | undefined,
    userAgent: string | undefined,
    requestData: any,
    responseData: any,
    statusCode: number,
    duration: number,
    errorMessage?: string,
  ): void {
    // Run audit log asynchronously to avoid blocking the main operation
    setImmediate(() => {
      this.auditLogService.logApiRequest(
        userId,
        method,
        url,
        ipAddress,
        userAgent,
        requestData || undefined,
        responseData || undefined,
        statusCode,
        duration,
        errorMessage,
      );
    });
  }

  private getClientIp(request: any): string | undefined {
    return (
      request.ip ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.connection?.socket?.remoteAddress ||
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return null;

    const sanitized = { ...data };

    // Remove sensitive information
    const sensitiveFields = [
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'accessToken',
      'authorization',
      'cookie',
      'session',
    ];

    function removeSensitive(obj: any): any {
      if (typeof obj !== 'object' || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(removeSensitive);
      }

      const result = { ...obj };
      for (const key of Object.keys(result)) {
        if (
          sensitiveFields.some((field) => key.toLowerCase().includes(field))
        ) {
          result[key] = '[REDACTED]';
        } else {
          result[key] = removeSensitive(result[key]);
        }
      }
      return result;
    }

    return removeSensitive(sanitized);
  }
}
