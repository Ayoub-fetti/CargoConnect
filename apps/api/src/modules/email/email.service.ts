import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Role } from '../../database/schemas/user.schema';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

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

  private normalizeMobileVerifyUrl(url: string | undefined): string {
    const value = (url || '').trim();

    if (!value) return 'mobile:///verify-email';

    if (/^mobile:\/\/\/?verify-email\/?$/i.test(value)) {
      return 'mobile:///verify-email';
    }

    return value;
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
      html: this.getVerificationTemplate(url, role, token, mobileVerifyUrl),
    });
  }

  private getVerificationTemplate(
    url: string,
    role: Role,
    token: string,
    mobileVerifyUrl: string,
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;background-color:#f4f6f8;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">CargoConnect</h1>
              <p style="color:#e0e7ff;margin-top:8px;font-size:14px;">
                Verify your email to get started
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;color:#333;">
              <h2 style="margin-top:0;font-size:20px;">Welcome</h2>
              
              <p style="margin:16px 0;">
                Thanks for joining <strong>CargoConnect</strong>.  
                Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${url}" 
                  style="background:#4f46e5;color:#ffffff;text-decoration:none;
                         padding:14px 24px;border-radius:8px;font-weight:bold;
                         display:inline-block;">
                  Verify Email
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#888;">
              <p style="margin:0;">© ${new Date().getFullYear()} CargoConnect</p>
              <p style="margin:5px 0 0;">
                Need help? Contact support anytime.
              </p>
            </td>
          </tr>

        </table>

        <p style="font-size:12px;color:#aaa;margin-top:20px;">
          CargoConnect Team • Secure logistics platform
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL1')}/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Reset your password - CargoConnect',
      html: this.getResetTemplate(url),
    });
  }

  private getResetTemplate(url: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;background-color:#f4f6f8;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#111;padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;">Password Reset</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;color:#333;">
              <p>You requested to reset your password.</p>

              <div style="text-align:center;margin:30px 0;">
                <a href="${url}" 
                  style="background:#111;color:#fff;text-decoration:none;
                         padding:14px 24px;border-radius:8px;font-weight:bold;">
                  Reset Password
                </a>
              </div>

              <p style="font-size:14px;color:#666;">
                This link will expire in 1 hour.
              </p>

              <p style="word-break:break-all;font-size:13px;">
                <a href="${url}">${url}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#888;">
              © ${new Date().getFullYear()} CargoConnect
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
}
