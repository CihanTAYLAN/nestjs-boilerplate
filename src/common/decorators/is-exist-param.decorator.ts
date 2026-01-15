import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { DecoratorContextHost } from 'src/config/decoratorContextHost';
import { PrismaModels } from '../types/prismaModel.type';
import { ModelFields } from '../types/prismaModelField.type';

export function IsExistParam<T extends PrismaModels>(
  model: T,
  field: ModelFields<T>,
  paramKey: string,
) {
  return createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.params[paramKey];
    if (!value) return null;

    const prisma = DecoratorContextHost.getPrismaService();
    const client = prisma[model as string];
    if (!client) {
      throw new Error(`Invalid model: ${model}`);
    }

    const record = await client.findUnique({ where: { [field]: value } });
    if (!record) {
      throw new NotFoundException(
        `Record not found for ${field as string}: ${value}`,
      );
    }

    return value;
  })();
}
