import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { ExampleJob } from './interfaces/example.interface';

@Processor('example-processing')
export class ExampleWorkerService extends WorkerHost {
  private readonly logger = new Logger(ExampleWorkerService.name);

  async process(job: Job<ExampleJob>): Promise<ExampleJob> {
    this.logger.log(`Processing job ${job.id}: ${JSON.stringify(job.data)}`);

    // Simple logging implementation as requested
    const result: ExampleJob = {
      id: job.id || 'unknown',
      data: job.data,
      status: 'completed',
      progress: 100,
    };

    this.logger.log(`Job ${job.id} completed successfully`);
    return result;
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ExampleJob>) {
    this.logger.log(`Job ${job.id} has been completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ExampleJob>) {
    this.logger.error(`Job ${job.id} has failed`);
  }
}
