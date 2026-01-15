import { JobState } from 'bullmq';

export interface ExampleJob {
  id: string;
  data?: any;
  status: JobState;
  progress?: number;
  failedReason?: string;
}
