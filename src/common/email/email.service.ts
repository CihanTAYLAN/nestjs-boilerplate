import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import configuration from '../../config/configuration';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(
    email: string,
    code: string,
    expiresIn: number,
  ): Promise<boolean> {
    return this.sendMail({
      to: email,
      subject: 'Your Verification Code',
      template: './verification-code',
      context: {
        code,
        expiresIn,
      },
    });
  }

  async sendPasswordReset(
    email: string,
    resetToken: string,
    expiresIn: number,
  ): Promise<boolean> {
    const resetUrl = `${configuration().app.frontendUrl}/auth/reset-password?token=${resetToken}`;

    return this.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: './reset-password',
      context: {
        resetUrl,
        expiresIn,
      },
    });
  }

  private async sendMail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }): Promise<boolean> {
    try {
      const config = configuration();
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: {
          ...options.context,
          appName: config.app.name,
          frontendUrl: config.app.frontendUrl,
          currentYear: new Date().getFullYear(),
          subject: options.subject,
        },
      });

      this.logger.log(
        `Email sent to ${options.to} with subject: ${options.subject}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${options.to}:`,
        error.message,
      );
      this.logger.debug('Error details:', error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}
