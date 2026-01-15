import { ModuleRef } from '@nestjs/core';
import { PrismaService } from 'src/database/prisma.service';
export class DecoratorContextHost {
  private static moduleRef: ModuleRef;
  private static prismaService: PrismaService;

  static setModuleRef(ref: ModuleRef) {
    DecoratorContextHost.moduleRef = ref;
    // Get PrismaService instance immediately when ModuleRef is set
    DecoratorContextHost.prismaService = DecoratorContextHost.moduleRef.get(
      PrismaService,
      { strict: false },
    );
  }

  static getPrismaService(): PrismaService {
    if (!DecoratorContextHost.prismaService) {
      throw new Error(
        'PrismaService not initialized. Make sure DecoratorContextHost.setModuleRef is called in your AppModule.',
      );
    }
    return DecoratorContextHost.prismaService;
  }
}
