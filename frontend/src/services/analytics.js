import prisma from '../config/database.js';
import { anonymizeIP, parseUserAgent } from '../utils/helpers.js';
import { getLocationFromIP } from './geolocation.js';

export const trackClick = async (link, req) => {
  try {
    const userAgent = req.get('User-Agent') || '';
    const ip = req.ip || req.connection.remoteAddress;
    const referer = req.get('Referer') || null;

    // Parse user agent
    const { browser, os, device } = parseUserAgent(userAgent);

    // Get location from IP
    const location = await getLocationFromIP(ip);

    // Create click record
    const click = await prisma.click.create({
      data: {
        linkId: link.id,
        ipAddress: anonymizeIP(ip),
        userAgent,
        referer,
        country: location?.country,
        city: location?.city,
        device,
        browser,
        os
      }
    });

    return click;
  } catch (error) {
    console.error('Error tracking click:', error);
    throw error;
  }
};

export const getLinkAnalytics = async (linkId, startDate, endDate, groupBy = 'day') => {
  try {
    const where = {
      linkId,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    };

    // Get total clicks
    const totalClicks = await prisma.click.count({ where });

    // Get unique visitors (based on anonymized IP)
    const uniqueVisitors = await prisma.click.groupBy({
      by: ['ipAddress'],
      where,
      _count: true
    });

    // Get clicks over time
    const clicksOverTime = await getClicksOverTime(where, groupBy);

    // Get top countries
    const topCountries = await prisma.click.groupBy({
      by: ['country'],
      where: {
        ...where,
        country: { not: null }
      },
      _count: true,
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 10
    });

    // Get top devices
    const topDevices = await prisma.click.groupBy({
      by: ['device'],
      where: {
        ...where,
        device: { not: null }
      },
      _count: true,
      orderBy: {
        _count: {
          device: 'desc'
        }
      }
    });

    // Get top browsers
    const topBrowsers = await prisma.click.groupBy({
      by: ['browser'],
      where: {
        ...where,
        browser: { not: null }
      },
      _count: true,
      orderBy: {
        _count: {
          browser: 'desc'
        }
      },
      take: 10
    });

    // Get top referrers
    const topReferrers = await prisma.click.groupBy({
      by: ['referer'],
      where: {
        ...where,
        referer: { not: null }
      },
      _count: true,
      orderBy: {
        _count: {
          referer: 'desc'
        }
      },
      take: 10
    });

    return {
      totalClicks,
      uniqueVisitors: uniqueVisitors.length,
      clicksOverTime,
      topCountries: topCountries.map(item => ({
        country: item.country,
        clicks: item._count
      })),
      topDevices: topDevices.map(item => ({
        device: item.device,
        clicks: item._count
      })),
      topBrowsers: topBrowsers.map(item => ({
        browser: item.browser,
        clicks: item._count
      })),
      topReferrers: topReferrers.map(item => ({
        referer: item.referer,
        clicks: item._count
      }))
    };
  } catch (error) {
    console.error('Error getting link analytics:', error);
    throw error;
  }
};

export const getUserAnalytics = async (userId, startDate, endDate) => {
  try {
    const where = {
      link: { userId },
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    };

    // Get total clicks across all user links
    const totalClicks = await prisma.click.count({ where });

    // Get total links
    const totalLinks = await prisma.link.count({
      where: { userId }
    });

    // Get active links
    const activeLinks = await prisma.link.count({
      where: { 
        userId,
        isActive: true
      }
    });

    // Get top performing links
    const topLinks = await prisma.link.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            clicks: {
              where: {
                timestamp: {
                  gte: startDate,
                  lte: endDate
                }
              }
            }
          }
        }
      },
      orderBy: {
        clicks: {
          _count: 'desc'
        }
      },
      take: 10
    });

    // Get clicks over time
    const clicksOverTime = await getClicksOverTime(where, 'day');

    return {
      totalClicks,
      totalLinks,
      activeLinks,
      topLinks: topLinks.map(link => ({
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        clicks: link._count.clicks
      })),
      clicksOverTime
    };
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};

const getClicksOverTime = async (where, groupBy) => {
  // This is a simplified version. In production, you might want to use raw SQL
  // for more complex time-based grouping
  
  const clicks = await prisma.click.findMany({
    where,
    select: {
      timestamp: true
    },
    orderBy: {
      timestamp: 'asc'
    }
  });

  // Group clicks by time period
  const grouped = {};
  
  clicks.forEach(click => {
    let key;
    const date = new Date(click.timestamp);
    
    switch (groupBy) {
      case 'hour':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    grouped[key] = (grouped[key] || 0) + 1;
  });

  return Object.entries(grouped).map(([period, count]) => ({
    period,
    clicks: count
  }));
};