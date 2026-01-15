import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { DecoratorContextHost } from './config/decoratorContextHost';

@Injectable()
export class MainService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    // Initialize DecoratorContextHost with ModuleRef for validators
    DecoratorContextHost.setModuleRef(this.moduleRef);
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: this.configService.get('app.name'),
    };
  }

  getInfo() {
    return {
      name: this.configService.get('app.name'),
      description: this.configService.get('app.description'),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
