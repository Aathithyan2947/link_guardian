import axios from 'axios';
import cron from 'cron';
import prisma from '../config/database.js';
import { sendNotification } from './notifications.js';

export const checkUrlHealth = async (linkId, url) => {
  try {
    const startTime = Date.now();
    
    const response = await axios.get(url, {
      timeout: parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 10000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept 4xx as valid responses
    });

    const responseTime = Date.now() - startTime;
    const statusCode = response.status;
    
    let healthStatus = 'HEALTHY';
    let error = null;

    // Determine health status
    if (statusCode >= 400 && statusCode < 500) {
      healthStatus = 'WARNING';
      error = `HTTP ${statusCode}`;
    } else if (statusCode >= 500) {
      healthStatus = 'ERROR';
      error = `HTTP ${statusCode}`;
    } else if (responseTime > 5000) {
      healthStatus = 'WARNING';
      error = 'Slow response time';
    }

    // Update link health status
    await prisma.link.update({
      where: { id: linkId },
      data: {
        healthStatus,
        lastHealthCheck: new Date()
      }
    });

    // Record health check
    const healthCheck = await prisma.healthCheck.create({
      data: {
        url,
        status: healthStatus,
        statusCode,
        responseTime,
        error
      }
    });

    // Send notification if health status changed to error
    if (healthStatus === 'ERROR') {
      await sendHealthAlert(linkId, url, error);
    }

    return {
      status: healthStatus,
      statusCode,
      responseTime,
      error,
      checkedAt: healthCheck.checkedAt
    };
  } catch (error) {
    console.error('Health check failed:', error);

    // Update link as unhealthy
    await prisma.link.update({
      where: { id: linkId },
      data: {
        healthStatus: 'ERROR',
        lastHealthCheck: new Date()
      }
    });

    // Record failed health check
    await prisma.healthCheck.create({
      data: {
        url,
        status: 'ERROR',
        error: error.message
      }
    });

    // Send notification
    await sendHealthAlert(linkId, url, error.message);

    return {
      status: 'ERROR',
      error: error.message,
      checkedAt: new Date()
    };
  }
};

export const startHealthCheckCron = () => {
  const interval = process.env.HEALTH_CHECK_INTERVAL || 300000; // 5 minutes default
  
  const job = new cron.CronJob('*/5 * * * *', async () => {
    console.log('Starting scheduled health checks...');
    
    try {
      // Get all active links that need health checking
      const links = await prisma.link.findMany({
        where: {
          isActive: true,
          OR: [
            { lastHealthCheck: null },
            { 
              lastHealthCheck: {
                lt: new Date(Date.now() - interval)
              }
            }
          ]
        },
        take: 100 // Limit to prevent overwhelming
      });

      console.log(`Checking health for ${links.length} links...`);

      // Check health for each link
      const promises = links.map(link => 
        checkUrlHealth(link.id, link.originalUrl).catch(error => {
          console.error(`Health check failed for link ${link.id}:`, error);
        })
      );

      await Promise.allSettled(promises);
      
      console.log('Health checks completed');
    } catch (error) {
      console.error('Health check cron job failed:', error);
    }
  });

  job.start();
  console.log('Health check cron job started');
  
  return job;
};

const sendHealthAlert = async (linkId, url, error) => {
  try {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: {
        user: true,
        organization: {
          include: {
            members: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!link) return;

    const recipients = [];
    
    // Add link owner
    if (link.user) {
      recipients.push(link.user);
    }

    // Add organization members with appropriate roles
    if (link.organization) {
      const orgMembers = link.organization.members
        .filter(member => ['OWNER', 'ADMIN'].includes(member.role))
        .map(member => member.user);
      recipients.push(...orgMembers);
    }

    // Send notifications
    for (const recipient of recipients) {
      await sendNotification({
        userId: recipient.id,
        type: 'LINK_HEALTH_ISSUE',
        title: 'Link Health Alert',
        message: `Link ${link.shortCode} is experiencing issues: ${error}`,
        data: {
          linkId: link.id,
          shortCode: link.shortCode,
          originalUrl: url,
          error
        }
      });
    }
  } catch (error) {
    console.error('Failed to send health alert:', error);
  }
};