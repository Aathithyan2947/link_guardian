import prisma from '../config/database.js';
import { AppError } from '../utils/errors.js';
import { generateShortCode, isValidUrl, paginate, buildPaginationResponse, hashPassword } from '../utils/helpers.js';
import { checkUrlHealth } from '../services/healthCheck.js';
import { PLAN_LIMITS } from '../config/rateLimit.js';

export const getLinks = async (req, res) => {
  const { page = 1, limit = 20, search, status, healthStatus, organizationId } = req.query;
  const userId = req.user.id;

  // Build where clause
  const where = {
    OR: [
      { userId },
      ...(organizationId ? [{ organizationId }] : [])
    ]
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { originalUrl: { contains: search, mode: 'insensitive' } },
      { shortCode: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (status) {
    where.isActive = status === 'active';
  }

  if (healthStatus) {
    where.healthStatus = healthStatus;
  }

  const { skip, take } = paginate(page, limit);

  const [links, total] = await Promise.all([
    prisma.link.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        domain: true,
        _count: {
          select: { clicks: true }
        }
      }
    }),
    prisma.link.count({ where })
  ]);

  const response = buildPaginationResponse(
    links.map(link => ({
      id: link.id,
      shortCode: link.shortCode,
      originalUrl: link.originalUrl,
      title: link.title,
      description: link.description,
      tags: link.tags,
      shortUrl: `${link.domain?.domain || process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`,
      isActive: link.isActive,
      healthStatus: link.healthStatus,
      lastHealthCheck: link.lastHealthCheck,
      expiresAt: link.expiresAt,
      maxClicks: link.maxClicks,
      currentClicks: link._count.clicks,
      enableTracking: link.enableTracking,
      hasPassword: !!link.password,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt
    })),
    total,
    page,
    limit
  );

  res.json({
    success: true,
    ...response
  });
};

export const getLinkById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const link = await prisma.link.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { organization: { members: { some: { userId } } } }
      ]
    },
    include: {
      domain: true,
      user: {
        select: { id: true, name: true, email: true }
      },
      organization: {
        select: { id: true, name: true, slug: true }
      },
      _count: {
        select: { clicks: true }
      }
    }
  });

  if (!link) {
    throw new AppError('Link not found', 404);
  }

  res.json({
    success: true,
    data: {
      link: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        description: link.description,
        tags: link.tags,
        shortUrl: `${link.domain?.domain || process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`,
        isActive: link.isActive,
        healthStatus: link.healthStatus,
        lastHealthCheck: link.lastHealthCheck,
        expiresAt: link.expiresAt,
        maxClicks: link.maxClicks,
        currentClicks: link._count.clicks,
        enableTracking: link.enableTracking,
        hasPassword: !!link.password,
        domain: link.domain,
        user: link.user,
        organization: link.organization,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt
      }
    }
  });
};

export const createLink = async (req, res) => {
  const {
    originalUrl,
    shortCode,
    title,
    description,
    tags = [],
    expiresAt,
    maxClicks,
    password,
    enableTracking = true,
    organizationId
  } = req.body;

  const userId = req.user.id;

  // Validate URL
  if (!isValidUrl(originalUrl)) {
    throw new AppError('Invalid URL format', 400);
  }

  // Check plan limits
  const userPlan = req.user.plan || 'FREE';
  const planLimits = PLAN_LIMITS[userPlan];
  
  const userLinkCount = await prisma.link.count({
    where: { userId }
  });

  if (planLimits.links !== -1 && userLinkCount >= planLimits.links) {
    throw new AppError(`Link limit reached for ${userPlan} plan`, 403);
  }

  // Generate or validate short code
  let finalShortCode = shortCode;
  if (!finalShortCode) {
    finalShortCode = generateShortCode();
  }

  // Check if short code is available
  const existingLink = await prisma.link.findUnique({
    where: { shortCode: finalShortCode }
  });

  if (existingLink) {
    throw new AppError('Short code already exists', 409);
  }

  // Hash password if provided
  let hashedPassword = null;
  if (password) {
    hashedPassword = await hashPassword(password);
  }

  // Create link
  const link = await prisma.link.create({
    data: {
      shortCode: finalShortCode,
      originalUrl,
      title,
      description,
      tags,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      maxClicks,
      password: hashedPassword,
      enableTracking,
      userId,
      organizationId
    },
    include: {
      domain: true,
      _count: {
        select: { clicks: true }
      }
    }
  });

  // Perform initial health check
  try {
    await checkUrlHealth(link.id, originalUrl);
  } catch (error) {
    console.error('Initial health check failed:', error);
  }

  res.status(201).json({
    success: true,
    message: 'Link created successfully',
    data: {
      link: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        description: link.description,
        tags: link.tags,
        shortUrl: `${link.domain?.domain || process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`,
        isActive: link.isActive,
        healthStatus: link.healthStatus,
        expiresAt: link.expiresAt,
        maxClicks: link.maxClicks,
        currentClicks: link._count.clicks,
        enableTracking: link.enableTracking,
        hasPassword: !!link.password,
        createdAt: link.createdAt
      }
    }
  });
};

export const updateLink = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const updateData = req.body;

  // Find link
  const existingLink = await prisma.link.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { organization: { members: { some: { userId, role: { in: ['OWNER', 'ADMIN'] } } } } }
      ]
    }
  });

  if (!existingLink) {
    throw new AppError('Link not found or access denied', 404);
  }

  // Validate URL if provided
  if (updateData.originalUrl && !isValidUrl(updateData.originalUrl)) {
    throw new AppError('Invalid URL format', 400);
  }

  // Hash password if provided
  if (updateData.password) {
    updateData.password = await hashPassword(updateData.password);
  }

  // Handle date conversion
  if (updateData.expiresAt) {
    updateData.expiresAt = new Date(updateData.expiresAt);
  }

  // Update link
  const link = await prisma.link.update({
    where: { id },
    data: updateData,
    include: {
      domain: true,
      _count: {
        select: { clicks: true }
      }
    }
  });

  res.json({
    success: true,
    message: 'Link updated successfully',
    data: {
      link: {
        id: link.id,
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        description: link.description,
        tags: link.tags,
        shortUrl: `${link.domain?.domain || process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`,
        isActive: link.isActive,
        healthStatus: link.healthStatus,
        lastHealthCheck: link.lastHealthCheck,
        expiresAt: link.expiresAt,
        maxClicks: link.maxClicks,
        currentClicks: link._count.clicks,
        enableTracking: link.enableTracking,
        hasPassword: !!link.password,
        updatedAt: link.updatedAt
      }
    }
  });
};

export const deleteLink = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Find link
  const link = await prisma.link.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { organization: { members: { some: { userId, role: { in: ['OWNER', 'ADMIN'] } } } } }
      ]
    }
  });

  if (!link) {
    throw new AppError('Link not found or access denied', 404);
  }

  // Delete link (cascade delete will handle related records)
  await prisma.link.delete({
    where: { id }
  });

  res.json({
    success: true,
    message: 'Link deleted successfully'
  });
};

export const checkLinkHealth = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Find link
  const link = await prisma.link.findFirst({
    where: {
      id,
      OR: [
        { userId },
        { organization: { members: { some: { userId } } } }
      ]
    }
  });

  if (!link) {
    throw new AppError('Link not found', 404);
  }

  // Perform health check
  const healthResult = await checkUrlHealth(link.id, link.originalUrl);

  res.json({
    success: true,
    message: 'Health check completed',
    data: {
      health: healthResult
    }
  });
};

export const createBulkLinks = async (req, res) => {
  const { links } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(links) || links.length === 0) {
    throw new AppError('Links array is required', 400);
  }

  if (links.length > 100) {
    throw new AppError('Maximum 100 links can be created at once', 400);
  }

  // Check plan limits
  const userPlan = req.user.plan || 'FREE';
  const planLimits = PLAN_LIMITS[userPlan];
  
  const userLinkCount = await prisma.link.count({
    where: { userId }
  });

  if (planLimits.links !== -1 && (userLinkCount + links.length) > planLimits.links) {
    throw new AppError(`Link limit would be exceeded for ${userPlan} plan`, 403);
  }

  const results = [];
  const errors = [];

  for (let i = 0; i < links.length; i++) {
    try {
      const linkData = links[i];
      
      // Validate URL
      if (!isValidUrl(linkData.originalUrl)) {
        throw new Error('Invalid URL format');
      }

      // Generate short code
      let shortCode = linkData.shortCode || generateShortCode();
      
      // Ensure unique short code
      let attempts = 0;
      while (attempts < 5) {
        const existing = await prisma.link.findUnique({
          where: { shortCode }
        });
        
        if (!existing) break;
        
        shortCode = generateShortCode();
        attempts++;
      }

      if (attempts >= 5) {
        throw new Error('Could not generate unique short code');
      }

      // Create link
      const link = await prisma.link.create({
        data: {
          shortCode,
          originalUrl: linkData.originalUrl,
          title: linkData.title,
          description: linkData.description,
          tags: linkData.tags || [],
          userId
        }
      });

      results.push({
        index: i,
        success: true,
        link: {
          id: link.id,
          shortCode: link.shortCode,
          originalUrl: link.originalUrl,
          shortUrl: `${process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`
        }
      });
    } catch (error) {
      errors.push({
        index: i,
        error: error.message
      });
    }
  }

  res.status(201).json({
    success: true,
    message: `Bulk creation completed. ${results.length} links created, ${errors.length} errors.`,
    data: {
      results,
      errors,
      summary: {
        total: links.length,
        successful: results.length,
        failed: errors.length
      }
    }
  });
};