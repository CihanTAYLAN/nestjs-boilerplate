import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  /**
   * Get auction module info
   * Returns the auction module name
   */
  async getDashboardInfo(): Promise<string> {
    try {
      return 'auction';
    } catch (error) {
      this.logger.error('Error retrieving auction info', error.stack);
      throw new Error('Failed to retrieve auction info');
    }
  }
}
