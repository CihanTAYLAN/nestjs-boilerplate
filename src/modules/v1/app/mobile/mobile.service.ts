import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MobileService {
  private readonly logger = new Logger(MobileService.name);

  /**
   * Get mobile module info
   * Returns the mobile module name
   */
  async getMobileInfo(): Promise<string> {
    try {
      return 'mobile';
    } catch (error) {
      this.logger.error('Error retrieving mobile info', error.stack);
      throw new Error('Failed to retrieve mobile info');
    }
  }
}
