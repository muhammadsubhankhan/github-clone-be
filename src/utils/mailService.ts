import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailTemplate {
  content: string;
  subject: string;
  senderName?: string;
  replyTo?: string;
}

interface SendEmailParams {
  emailTemplate: EmailTemplate;
  email: string;
}
@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('HOST'),
      port: this.configService.get<number>('EMAILPORT'),
      auth: {
        user: this.configService.get<string>('USER_EMAIL'),
        pass: this.configService.get<string>('PASS'),
      },
    });
  }

  async sendEmail({ emailTemplate, email }: SendEmailParams) {
    const { content, subject, senderName, replyTo } = emailTemplate;

    const mailOptions = {
      from: {
        name: senderName || this.configService.get<string>('USER_NAME'),
        address: this.configService.get<string>('USER_EMAIL'),
      },
      to: email,
      replyTo,
      subject,
      html: content,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
