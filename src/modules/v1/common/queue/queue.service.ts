import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, JobsOptions, Queue, QueueEvents } from 'bullmq';
import { QueueName } from './interfaces/queue.interface';
import { ExampleJob } from './workers/example-worker/interfaces/example.interface';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QueueName.EXAMPLE)
    private exampleQueue: Queue<ExampleJob>,
  ) {
    this.initializeQueueEvents();
  }

  /**
   * Initialize queue events
   */
  private initializeQueueEvents() {
    // Queue Events
    new QueueEvents(QueueName.EXAMPLE, {
      connection: this.exampleQueue.opts.connection,
    })
      .on('completed', ({ jobId }) => {
        this.logger.log(`Example job ${jobId} completed`);
      })
      .on('failed', ({ jobId, failedReason }) => {
        this.logger.error(`Example job ${jobId} failed: ${failedReason}`);
      });
  }

  /**
   *
   * @param data job data
   * @param options job options
   * @returns Job
   */
  async addJob(queueName: QueueName, data: ExampleJob, options?: JobsOptions) {
    try {
      switch (queueName) {
        case QueueName.EXAMPLE: {
          const job = await this.exampleQueue.add(queueName, data, {
            ...options,
          });
          return job;
        }
        default:
          throw new Error('Invalid queue type');
      }
    } catch (error) {
      this.logger.error(`Failed to add example job to queue: ${error.message}`);
      throw error;
    }
  }

  /**
   *
   * @param queueName queue name
   * @param jobId job id
   * @returns Job
   */
  async getJobStatus(queueName: QueueName, jobId?: string): Promise<Job> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }
    try {
      switch (queueName) {
        case QueueName.EXAMPLE: {
          const job = await this.exampleQueue.getJob(jobId);

          if (!job) {
            this.logger.error('Job not found');
            throw new Error('Job not found');
          }
          return job;
        }
        default:
          throw new Error('Invalid queue type');
      }
    } catch (error) {
      this.logger.error(`Failed to get job status: ${error.message}`);
      throw error;
    }
  }
}
