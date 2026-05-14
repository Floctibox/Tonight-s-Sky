import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

let transporter;

// Initialize email transporter
export function initEmailService() {
  if (config.emailService === 'gmail' && config.emailUser && config.emailPassword) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });
  } else if (config.sendgridApiKey) {
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: config.sendgridApiKey,
      },
    });
  } else {
    console.warn('⚠ Email service not configured. Reminders will not be sent.');
  }
}

export async function sendReminderEmail(user, event) {
  if (!transporter) {
    console.warn('Email service not initialized');
    return false;
  }

  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; padding: 20px; border-radius: 8px; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .event-details { background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌙 Event Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>This is a reminder about an astronomical event you saved:</p>
            <div class="event-details">
              <h2>${event.title}</h2>
              <p><strong>Type:</strong> ${event.eventType.replace('_', ' ').toUpperCase()}</p>
              <p><strong>Date & Time:</strong> ${formattedDate}</p>
              ${event.location ? `<p><strong>Location:</strong> ${event.location.name || 'Global'}</p>` : ''}
              ${event.description ? `<p><strong>Details:</strong> ${event.description}</p>` : ''}
              ${event.notes ? `<p><strong>Your Notes:</strong> ${event.notes}</p>` : ''}
            </div>
            <p>Don't miss this astronomical event!</p>
            <a href="${config.frontendUrl}" class="button">View in Tonight's Sky</a>
          </div>
          <div class="footer">
            <p>You're receiving this email because you saved this event in Tonight's Sky.</p>
            <p>If you don't want to receive these reminders, you can disable them in your account settings.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to: user.email,
      subject: `Reminder: ${event.title} tomorrow!`,
      html: htmlContent,
    });
    console.log(`✓ Reminder email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send reminder email: ${error.message}`);
    return false;
  }
}

export async function sendWelcomeEmail(user) {
  if (!transporter) {
    console.warn('Email service not initialized');
    return false;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #fff; padding: 20px; border-radius: 8px; }
          .content { padding: 20px; border: 1px solid #e5e7eb; border-top: none; }
          .features { list-style: none; padding: 0; }
          .features li { padding: 10px 0; padding-left: 25px; position: relative; }
          .features li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Welcome to Tonight's Sky!</h1>
          </div>
          <div class="content">
            <p>Hi ${user.username},</p>
            <p>Thank you for joining us! Your account has been created successfully.</p>
            <p>Here's what you can now do:</p>
            <ul class="features">
              <li>Save your favorite observation locations</li>
              <li>Track upcoming astronomical events</li>
              <li>Get email reminders for saved events</li>
              <li>Access your data across all devices</li>
            </ul>
            <p>Ready to explore tonight's sky?</p>
            <a href="${config.frontendUrl}" class="button">Start Exploring</a>
          </div>
          <div class="footer">
            <p>Questions? Contact us anytime!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.emailFrom,
      to: user.email,
      subject: 'Welcome to Tonight\'s Sky!',
      html: htmlContent,
    });
    console.log(`✓ Welcome email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to send welcome email: ${error.message}`);
    return false;
  }
}
