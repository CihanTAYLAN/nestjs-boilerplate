import { Prisma } from '@prisma/client';

export type PrismaModels = keyof Prisma.TypeMap['model'];
