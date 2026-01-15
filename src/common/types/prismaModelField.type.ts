import { Prisma } from '@prisma/client';
import { PrismaModels } from './prismaModel.type';

export type ModelFields<T extends PrismaModels> =
  keyof Prisma.TypeMap['model'][T]['fields'];
