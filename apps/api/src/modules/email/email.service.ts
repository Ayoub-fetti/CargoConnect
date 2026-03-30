import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Role } from '../../database/schemas/user.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  private normalizeMobileVerifyUrl(url: string | undefined): string {
    const value = (url || '').trim();

    if (!value) return 'mobile:///verify-email';

    // Accept common variants and keep a single canonical deep-link.
    if (/^mobile:\/\/\/?verify-email\/?$/i.test(value)) {
      return 'mobile:///verify-email';
    }

    return value;
  }

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      requireTLS: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string, role: Role) {
    const webVerifyUrl =
      this.configService.get('WEB_VERIFY_URL') ||
      `${this.configService.get('FRONTEND_URL1')}/verify-email`;

    const driverVerifyUrl =
      this.configService.get('DRIVER_VERIFY_URL') ||
      `${this.configService.get('FRONTEND_URL1')}/mobile-only/verify-email`;

    const mobileVerifyUrl = this.normalizeMobileVerifyUrl(
      this.configService.get<string>('MOBILE_VERIFY_URL'),
    );

    const baseUrl = role === Role.DRIVER ? driverVerifyUrl : webVerifyUrl;
    const url = `${baseUrl}?token=${encodeURIComponent(token)}`;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Verify your email - CargoConnect',
      text: `Verify your email by opening this link: ${url}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
          <p style="margin:0 0 12px">Welcome to CargoConnect.</p>
          <p style="margin:0 0 12px">Click the button below to verify your email:</p>
          <p style="margin:16px 0">
            <a href="${url}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-weight:600">
              Verify Email
            </a>
          </p>
          <p style="margin:0 0 8px">If the button does not work, copy and open this link:</p>
          <p style="word-break:break-all;margin:0"><a href="${url}">${url}</a></p>
          ${
            role === Role.DRIVER
              ? `<p style="margin:12px 0 0">Direct app link: <a href="${mobileVerifyUrl}?token=${encodeURIComponent(token)}">${mobileVerifyUrl}?token=${encodeURIComponent(token)}</a></p>`
              : ''
          }
        </div>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL1')}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Reset your password - CargoConnect',
      html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
  }
}
