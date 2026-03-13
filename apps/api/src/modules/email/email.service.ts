import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Verify your email - CargoConnect',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Reset your password - CargoConnect',
      html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
  }
}
