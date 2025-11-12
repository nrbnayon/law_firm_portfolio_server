// src/shared/emailTemplate.ts

import {
  INewsletterSubscriber,
  IResetPassword,
  ICreateAccount,
} from "../types/email";

/**
 * Base email template with simple and clean styling
 */
const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff; border-radius:6px; padding:20px; text-align:left;">
          <tr>
            <td>
              ${content}
              <hr style="border:none; border-top:1px solid #e2e8f0; margin:30px 0;">
              <p style="color:#999; font-size:12px; text-align:center; margin:0;">
                This is an automated message. Please do not reply directly.<br>
                © ${new Date().getFullYear()} CW White Law. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

/**
 * Create account verification email template
 */
const createAccount = (values: ICreateAccount) => {
  const content = `
    <h2 style="color:#333;">Account Verification</h2>
    <p style="color:#555; font-size:15px;">Hello ${values.name},</p>
    <p style="color:#555; font-size:15px;">
      Please use the verification code below to complete your account setup.
    </p>
    <div style="background:#f0f0f0; padding:15px; text-align:center; border-radius:4px; margin:20px 0;">
      <strong style="font-size:22px; letter-spacing:3px;">${values.otp}</strong>
    </div>
    <p style="color:#666; font-size:14px;">This code will expire in 5 minutes for your security.</p>
    <p style="color:#666; font-size:13px;">
      If you didn’t create an account, please ignore this email.
    </p>
    <p style="color:#999; font-size:12px;">For support, contact victor.info@cwwhitelaw.com</p>
  `;

  return {
    to: values.email,
    subject: "Verify Your Account",
    html: getBaseTemplate(content),
  };
};

/**
 * Password reset email template
 */
const resetPassword = (values: IResetPassword) => {
  const content = `
    <h2 style="color:#333;">Password Reset Request</h2>
    <p style="color:#555; font-size:15px;">
      We received a request to reset your password. Use the code below to continue.
    </p>
    <div style="background:#f0f0f0; padding:15px; text-align:center; border-radius:4px; margin:20px 0;">
      <strong style="font-size:22px; letter-spacing:3px;">${values.otp}</strong>
    </div>
    <p style="color:#666; font-size:14px;">
      This code is valid for 5 minutes. After that, you’ll need to request a new one.
    </p>
    <p style="color:#666; font-size:13px;">
      If you didn’t request this password reset, you can safely ignore this message.
    </p>
    <p style="color:#999; font-size:12px;">Questions? Contact info@cwwhitelaw.com</p>
  `;

  return {
    to: values.email,
    subject: "Password Reset Code",
    html: getBaseTemplate(content),
  };
};

/**
 * Newsletter subscription welcome email
 */
const newsLetter = (values: INewsletterSubscriber) => {
  const content = `
    <h2 style="color:#333;">Welcome to Our Newsletter</h2>
    <p style="color:#555; font-size:15px;">Hello ${values.name},</p>
    <p style="color:#555; font-size:15px;">
      Thank you for subscribing to our newsletter! We’re glad to have you with us.
    </p>
    <p style="color:#555; font-size:14px; margin-top:20px;">
      <strong>Email:</strong> ${values.email}<br>
      <strong>Subscribed on:</strong> ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </p>
    <p style="color:#666; font-size:13px;">
      You’ll start receiving updates and helpful content from us soon.
    </p>
    <p style="color:#999; font-size:12px;">If you wish to unsubscribe, you can do so anytime.</p>
  `;

  return {
    to: values.email,
    subject: "Welcome to Our Newsletter",
    html: getBaseTemplate(content),
  };
};

/**
 * Export the email template functions
 */
export const emailTemplate = {
  createAccount,
  resetPassword,
  newsLetter,
};
