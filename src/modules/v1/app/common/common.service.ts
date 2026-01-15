import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);

  /**
   * Get common module info
   * Returns the common module name
   */
  async getCommonInfo(): Promise<string> {
    try {
      return 'common';
    } catch (error) {
      this.logger.error('Error retrieving common info', error.stack);
      throw new Error('Failed to retrieve common info');
    }
  }
}
