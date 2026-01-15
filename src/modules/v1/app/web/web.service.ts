import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebService {
  private readonly logger = new Logger(WebService.name);

  /**
   * Get web module info
   * Returns the web module name
   */
  async getWebInfo(): Promise<string> {
    try {
      return 'web';
    } catch (error) {
      this.logger.error('Error retrieving web info', error.stack);
      throw new Error('Failed to retrieve web info');
    }
  }
}
