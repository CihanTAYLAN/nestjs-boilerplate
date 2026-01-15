import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import basicAuth from 'express-basic-auth';
import configuration from '../../../../config/configuration';
import { QueueName } from './interfaces/queue.interface';
import { QueueService } from './queue.service';
import { ExampleWorkerService } from './workers/example-worker/example-worker.service';

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        return {
          connection: {
            host: configuration().redis.host,
            port: Number(configuration().redis.port),
            password: configuration().redis.password,
            db: Number(configuration().redis.redisDatabase),
            maxRetriesPerRequest: null,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: QueueName.EXAMPLE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    }),
    BullBoardModule.forRoot({
      route: '/bullmq',
      adapter: ExpressAdapter,
      middleware: basicAuth({
        users: {
          [configuration().documentation.user]:
            configuration().documentation.password,
        },
        challenge: true,
      }),
    }),
    BullBoardModule.forFeature({
      name: QueueName.EXAMPLE,
      adapter: BullMQAdapter,
    }),
  ],
  providers: [QueueService, ExampleWorkerService],
  exports: [QueueService],
})
export class QueueCoreModule {}
