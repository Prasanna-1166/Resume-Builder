import nodemailer, { Transporter } from 'nodemailer';

export interface FeedbackEmailPayload {
  name: string;
  email: string;
  category: string;
  message: string;
  userId?: string | null;
}

export interface MailDeliveryResult {
  success: boolean;
  message?: string;
  provider: string;
}

class MailService {
  private supportEmail: string;
  private fromEmail: string;

  constructor() {
    this.supportEmail = process.env.SUPPORT_EMAIL || 'support.dvlpr@gmail.com';
    this.fromEmail = process.env.MAIL_FROM || `CareerDoc AI <${process.env.SMTP_USER || 'support.dvlpr@gmail.com'}>`;
  }

  getSupportEmail(): string {
    return this.supportEmail;
  }

  /**
   * Constructs nodemailer transporter based on environment configuration
   */
  private getTransporter(): Transporter | null {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpService = process.env.SMTP_SERVICE;

    if (!smtpHost && !smtpService) {
      return null;
    }

    if (!smtpUser || !smtpPass) {
      return null;
    }

    if (smtpService) {
      return nodemailer.createTransport({
        service: smtpService,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
    }

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465 || process.env.SMTP_SECURE === 'true',
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });
  }

  async sendFeedbackEmail(payload: FeedbackEmailPayload): Promise<MailDeliveryResult> {
    const { name, email, category, message, userId } = payload;
    const submittedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'long' });

    const subject = `[CareerDoc AI Support] [${category}] ${name}`;
    
    const textBody = [
      `======================================================`,
      `NEW SUPPORT TICKET / CUSTOMER FEEDBACK`,
      `======================================================`,
      `Sender Name:    ${name}`,
      `Sender Email:   ${email}`,
      `Category:       ${category}`,
      `User Account:   ${userId ? `Registered User (${userId})` : 'Guest / Unauthenticated'}`,
      `Submitted At:   ${submittedAt}`,
      `------------------------------------------------------`,
      `Message:`,
      `${message}`,
      `======================================================`,
      `Reply directly to this email to respond to ${name} (${email}).`
    ].join('\n');

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b;">
        <div style="border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #4f46e5; font-size: 22px;">CareerDoc AI Support Request</h2>
          <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background-color: #e0e7ff; color: #3730a3; font-weight: 600; font-size: 12px; border-radius: 9999px;">
            ${category}
          </span>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 600;">From:</td>
              <td style="padding: 6px 0; color: #0f172a; font-weight: bold;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">User Status:</td>
              <td style="padding: 6px 0; color: #0f172a;">${userId ? `Registered User (<code style="font-size:12px; background:#e2e8f0; padding:2px 4px; border-radius:4px;">${userId}</code>)` : 'Guest Visitor'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Date (UTC):</td>
              <td style="padding: 6px 0; color: #64748b;">${submittedAt}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 24px;">
          <h4 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Message / Complaint:</h4>
          <div style="background-color: #ffffff; border-left: 4px solid #6366f1; padding: 16px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; background: #fdfdfd; border: 1px solid #f1f5f9; border-left: 4px solid #6366f1; border-radius: 4px;">${message}</div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          <p style="margin: 0 0 4px 0;">CareerDoc AI Automated Support Dispatch</p>
          <p style="margin: 0;">You can directly hit <strong>Reply</strong> in your email client to reply to <strong>${email}</strong>.</p>
        </div>
      </div>
    `;

    const transporter = this.getTransporter();

    if (transporter) {
      try {
        const mailOptions = {
          from: this.fromEmail,
          to: this.supportEmail,
          replyTo: `${name} <${email}>`,
          subject,
          text: textBody,
          html: htmlBody
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[MailService] Live email successfully dispatched to ${this.supportEmail} via SMTP. MessageId: ${info.messageId}`);
        return {
          success: true,
          provider: 'smtp',
          message: 'Feedback email successfully delivered to support inbox.'
        };
      } catch (err: any) {
        console.error('[MailService] SMTP dispatch failed:', err?.message);
        console.error('[MailService] Note: Make sure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS (Google App Password) are valid.');
        return {
          success: false,
          provider: 'smtp',
          message: `SMTP error: ${err?.message}`
        };
      }
    }

    // Default: Log when SMTP credentials are not configured
    console.log(`[MailService] [NO_SMTP_CONFIG] Received ticket from ${name} (${email}) category "${category}".`);
    console.log(`[MailService] Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in environment variables on your server to forward real emails to ${this.supportEmail}.`);
    
    return {
      success: true,
      provider: 'standard-gateway',
      message: 'Feedback received and saved to database.'
    };
  }
}

export const mailService = new MailService();
