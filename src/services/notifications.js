import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import axios from 'axios';
import prisma from '../config/database.js';

// Initialize email service
let emailService;

if (process.env.RESEND_API_KEY) {
  emailService = new Resend(process.env.RESEND_API_KEY);
} else if (process.env.SMTP_HOST) {
  emailService = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

export const sendNotification = async (notificationData) => {
  try {
    // Create notification record
    const notification = await prisma.notification.create({
      data: notificationData
    });

    // Get user preferences and contact info
    const user = await prisma.user.findUnique({
      where: { id: notificationData.userId }
    });

    if (!user) return;

    // Send email notification
    await sendEmailNotification(user, notification);

    // Send Slack notification if configured
    await sendSlackNotification(notification);

    // Mark notification as sent
    await prisma.notification.update({
      where: { id: notification.id },
      data: { sentAt: new Date() }
    });

    return notification;
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
};

const sendEmailNotification = async (user, notification) => {
  try {
    if (!emailService || !user.email) return;

    const emailData = {
      to: user.email,
      from: process.env.SUPPORT_EMAIL || 'noreply@linkguardian.com',
      subject: `${process.env.APP_NAME} - ${notification.title}`,
      html: generateEmailTemplate(user, notification)
    };

    if (process.env.RESEND_API_KEY) {
      // Using Resend
      await emailService.emails.send(emailData);
    } else {
      // Using SMTP
      await emailService.sendMail(emailData);
    }

    console.log(`Email notification sent to ${user.email}`);
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
};

const sendSlackNotification = async (notification) => {
  try {
    if (!process.env.SLACK_WEBHOOK_URL) return;

    const slackMessage = {
      text: notification.title,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: notification.title
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: notification.message
          }
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Time:* ${new Date(notification.createdAt).toLocaleString()}`
            }
          ]
        }
      ]
    };

    // Add additional context based on notification type
    if (notification.data) {
      const data = typeof notification.data === 'string' 
        ? JSON.parse(notification.data) 
        : notification.data;

      if (data.linkId) {
        slackMessage.blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Link:* ${data.shortCode || 'N/A'}\n*URL:* ${data.originalUrl || 'N/A'}`
          }
        });
      }
    }

    await axios.post(process.env.SLACK_WEBHOOK_URL, slackMessage);
    console.log('Slack notification sent');
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
};

const generateEmailTemplate = (user, notification) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${notification.title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .notification-type {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .type-error { background: #fee2e2; color: #dc2626; }
        .type-warning { background: #fef3c7; color: #d97706; }
        .type-info { background: #dbeafe; color: #2563eb; }
        .type-success { background: #d1fae5; color: #059669; }
        .button {
          display: inline-block;
          background: #3B82F6;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${process.env.APP_NAME}</h1>
        <p>Smart Link Management Platform</p>
      </div>
      
      <div class="content">
        <div class="notification-type type-${getNotificationTypeClass(notification.type)}">
          ${notification.type.replace(/_/g, ' ')}
        </div>
        
        <h2>${notification.title}</h2>
        <p>${notification.message}</p>
        
        ${notification.data ? generateNotificationDetails(notification.data) : ''}
        
        <a href="${process.env.APP_URL}/dashboard" class="button">
          View Dashboard
        </a>
      </div>
      
      <div class="footer">
        <p>
          You received this email because you have notifications enabled for your ${process.env.APP_NAME} account.
          <br>
          <a href="${process.env.APP_URL}/settings">Manage notification preferences</a>
        </p>
      </div>
    </body>
    </html>
  `;
};

const getNotificationTypeClass = (type) => {
  switch (type) {
    case 'LINK_HEALTH_ISSUE':
      return  'error';
    case 'HIGH_TRAFFIC':
      return 'warning';
    case 'LINK_EXPIRED':
      return 'warning';
    case 'PLAN_LIMIT_REACHED':
      return 'warning';
    case 'SUBSCRIPTION_UPDATED':
      return 'info';
    case 'TEAM_MEMBER_ADDED':
      return 'success';
    default:
      return 'info';
  }
};

const generateNotificationDetails = (data) => {
  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  
  let details = '<div style="background: white; padding: 15px; border-radius: 6px; margin: 15px 0;">';
  
  if (parsedData.shortCode) {
    details += `<p><strong>Short Code:</strong> ${parsedData.shortCode}</p>`;
  }
  
  if (parsedData.originalUrl) {
    details += `<p><strong>Original URL:</strong> <a href="${parsedData.originalUrl}">${parsedData.originalUrl}</a></p>`;
  }
  
  if (parsedData.error) {
    details += `<p><strong>Error:</strong> ${parsedData.error}</p>`;
  }
  
  details += '</div>';
  
  return details;
};

// Bulk notification functions
export const sendBulkNotification = async (userIds, notificationData) => {
  const promises = userIds.map(userId => 
    sendNotification({
      ...notificationData,
      userId
    }).catch(error => {
      console.error(`Failed to send notification to user ${userId}:`, error);
    })
  );

  await Promise.allSettled(promises);
};

export const sendOrganizationNotification = async (organizationId, notificationData, roles = ['OWNER', 'ADMIN']) => {
  try {
    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId,
        role: { in: roles },
        isActive: true
      },
      include: {
        user: true
      }
    });

    const userIds = members.map(member => member.userId);
    await sendBulkNotification(userIds, notificationData);
  } catch (error) {
    console.error('Failed to send organization notification:', error);
  }
};