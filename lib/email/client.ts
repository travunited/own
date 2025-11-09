/**
 * Email Client - Resend Integration
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const from = options.from || process.env.EMAIL_FROM || 'Travunited <noreply@travunited.com>';

    const { data, error } = await resend.emails.send({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (error) {
      console.error('Email send error:', error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Send email error:', error);
    throw error;
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const subject = 'Welcome to Travunited!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Travunited!</h1>
      </div>
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Hi ${name},</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Thank you for joining Travunited! We're excited to help you with your visa applications and travel planning.
        </p>
        <p style="color: #4b5563; line-height: 1.6;">
          Here's what you can do:
        </p>
        <ul style="color: #4b5563; line-height: 1.8;">
          <li>Apply for visas to 45+ countries</li>
          <li>Book curated tour packages</li>
          <li>Track your applications in real-time</li>
          <li>Upload and manage documents securely</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Need help? Contact us at support@travunited.com
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(to: string, verificationLink: string) {
  const subject = 'Verify Your Email - Travunited';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Verify Your Email</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Please verify your email address to complete your registration.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send application submitted confirmation
 */
export async function sendApplicationSubmittedEmail(
  to: string,
  applicationNumber: string,
  visaType: string,
  country: string
) {
  const subject = `Application Submitted - ${applicationNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #1f2937;">✅ Application Submitted Successfully!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your visa application has been submitted and is now under review.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Application Number:</strong> ${applicationNumber}</p>
          <p style="margin: 5px 0;"><strong>Visa Type:</strong> ${visaType}</p>
          <p style="margin: 5px 0;"><strong>Country:</strong> ${country}</p>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">
          We'll notify you as soon as there's an update on your application.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Track Application
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send payment success email
 */
export async function sendPaymentSuccessEmail(
  to: string,
  amount: number,
  applicationNumber: string,
  invoiceUrl: string
) {
  const subject = `Payment Received - ${applicationNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #10b981;">✅ Payment Received!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your payment of <strong>₹${amount.toLocaleString('en-IN')}</strong> has been received successfully.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Application:</strong> ${applicationNumber}</p>
          <p style="margin: 5px 0;"><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981;">Paid</span></p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invoiceUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Download Invoice
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send document verification status
 */
export async function sendDocumentStatusEmail(
  to: string,
  applicationNumber: string,
  documentName: string,
  status: 'verified' | 'rejected',
  reason?: string
) {
  const isApproved = status === 'verified';
  const subject = `Document ${isApproved ? 'Verified' : 'Rejected'} - ${applicationNumber}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: ${isApproved ? '#10b981' : '#ef4444'};">
          ${isApproved ? '✅' : '❌'} Document ${isApproved ? 'Verified' : 'Rejected'}
        </h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Your document <strong>${documentName}</strong> for application ${applicationNumber} has been ${status}.
        </p>
        ${reason ? `
          <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; color: #991b1b;"><strong>Reason:</strong> ${reason}</p>
          </div>
        ` : ''}
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Application
          </a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send application approved email
 */
export async function sendApplicationApprovedEmail(
  to: string,
  applicationNumber: string,
  visaType: string,
  country: string
) {
  const subject = `🎉 Visa Approved - ${applicationNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px;">🎉 Congratulations!</h1>
      </div>
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #1f2937;">Your Visa Has Been Approved!</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          Great news! Your ${visaType} for ${country} has been approved.
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Application:</strong> ${applicationNumber}</p>
          <p style="margin: 5px 0;"><strong>Visa Type:</strong> ${visaType}</p>
          <p style="margin: 5px 0;"><strong>Country:</strong> ${country}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">APPROVED</span></p>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">
          You can now download your visa documents from your dashboard.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications/${applicationNumber}" style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Visa
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Have a great trip! 🎒✈️
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * Send application rejected email
 */
export async function sendApplicationRejectedEmail(
  to: string,
  applicationNumber: string,
  reason: string
) {
  const subject = `Application Update - ${applicationNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="padding: 40px; background: #f9fafb;">
        <h2 style="color: #ef4444;">Application Status Update</h2>
        <p style="color: #4b5563; line-height: 1.6;">
          We regret to inform you that your application ${applicationNumber} could not be approved at this time.
        </p>
        <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #991b1b;"><strong>Reason:</strong> ${reason}</p>
        </div>
        <p style="color: #4b5563; line-height: 1.6;">
          You can review the details and reapply if you wish to address the concerns.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/applications" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
            View Details
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Need help? Contact support@travunited.com
        </p>
      </div>
    </div>
  `;

  return sendEmail({ to, subject, html });
}

