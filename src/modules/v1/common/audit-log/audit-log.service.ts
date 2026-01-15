import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma.service';

export interface CreateAuditLogData {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  requestData?: any;
  responseData?: any;
  statusCode?: number;
  errorMessage?: string;
  duration?: number;
  metadata?: any;
}

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAuditLogData): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: data?.userId,
          action: data.action,
          ipAddress: data?.ipAddress,
          userAgent: data?.userAgent,
          requestData:
            data?.requestData && JSON.parse(JSON.stringify(data.requestData)),
          responseData:
            data?.responseData && JSON.parse(JSON.stringify(data.responseData)),
          statusCode: data?.statusCode,
          errorMessage: data?.errorMessage,
          duration: data?.duration,
          metadata: data?.metadata && JSON.parse(JSON.stringify(data.metadata)),
        },
      });
    } catch (error) {
      // Don't let audit log errors affect the main operation
      console.error('Failed to create audit log:', error);
    }
  }

  async logApiRequest(
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
  ): Promise<void> {
    const action = `${method} ${url}`;

    await this.create({
      userId: userId,
      action: action,
      ipAddress: ipAddress,
      userAgent: userAgent,
      requestData: requestData,
      responseData: responseData,
      statusCode: statusCode,
      duration: duration,
      errorMessage: errorMessage,
    });
  }
}
