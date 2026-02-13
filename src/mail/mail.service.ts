import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: parseInt(this.configService.get('MAIL_PORT'), 10),
            secure: this.configService.get('MAIL_SECURE') === 'true',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async sendVerificationEmail(to: string, token: string) {
        const url = `${this.configService.get('FRONTEND_URL')}/verify?token=${token}`;

        await this.transporter.sendMail({
            from: `"CrudLLM Support" <${this.configService.get('MAIL_FROM')}>`,
            to,
            subject: 'E-posta Doğrulama - CrudLLM',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">CrudLLM'e Hoş Geldiniz!</h2>
          <p>Kayıt olduğunuz için teşekkürler. Hesabınızı doğrulamak için aşağıdaki kodu kullanabilir veya bağlantıya tıklayabilirsiniz:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${token}
          </div>
          <p>Veya şu bağlantıya tıklayın:</p>
          <a href="${url}" style="color: #059669; font-weight: bold;">E-postamı Doğrula</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Eğer bu kaydı siz yapmadıysanız bu e-postayı dikkate almayınız.</p>
        </div>
      `,
        });
    }

    async sendPasswordResetEmail(to: string, token: string) {
        const url = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

        await this.transporter.sendMail({
            from: `"CrudLLM Support" <${this.configService.get('MAIL_FROM')}>`,
            to,
            subject: 'Şifre Sıfırlama - CrudLLM',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #059669;">Şifre Sıfırlama İsteği</h2>
          <p>Şifrenizi sıfırlamak için aşağıdaki kodu kullanabilir veya bağlantıya tıklayabilirsiniz:</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0;">
            ${token}
          </div>
          <p>Veya şu bağlantıya tıklayın:</p>
          <a href="${url}" style="color: #059669; font-weight: bold;">Şifremi Sıfırla</a>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">Eğer bu isteği siz yapmadıysanız lütfen şifrenizi güvence altına alınız.</p>
        </div>
      `,
        });
    }
}
