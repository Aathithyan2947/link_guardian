import prisma from '../config/database.js';
import { AppError } from '../utils/errors.js';
import { anonymizeIP, parseUserAgent, comparePassword } from '../utils/helpers.js';
import { trackClick } from '../services/analytics.js';
import { getLocationFromIP } from '../services/geolocation.js';

export const redirect = async (req, res) => {
  const { shortCode } = req.params;
  const { password } = req.query;

  // Find link
  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      domain: true,
      organization: {
        include: {
          branding: true
        }
      }
    }
  });

  if (!link) {
    throw new AppError('Link not found', 404);
  }

  // Check if link is active
  if (!link.isActive) {
    return renderExpiredPage(res, link, 'This link has been deactivated');
  }

  // Check expiration by date
  if (link.expiresAt && new Date() > link.expiresAt) {
    return renderExpiredPage(res, link, 'This link has expired');
  }

  // Check expiration by click count
  if (link.maxClicks && link.currentClicks >= link.maxClicks) {
    return renderExpiredPage(res, link, 'This link has reached its click limit');
  }

  // Check password protection
  if (link.password) {
    if (!password) {
      return renderPasswordPage(res, link);
    }

    const isValidPassword = await comparePassword(password, link.password);
    if (!isValidPassword) {
      return renderPasswordPage(res, link, 'Incorrect password');
    }
  }

  // Track click if tracking is enabled
  if (link.enableTracking) {
    try {
      await trackClick(link, req);
    } catch (error) {
      console.error('Click tracking failed:', error);
      // Don't fail the redirect if tracking fails
    }
  }

  // Update click count
  await prisma.link.update({
    where: { id: link.id },
    data: {
      currentClicks: {
        increment: 1
      }
    }
  });

  // Redirect to original URL
  res.redirect(302, link.originalUrl);
};

export const preview = async (req, res) => {
  const { shortCode } = req.params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
    include: {
      domain: true,
      user: {
        select: { name: true }
      },
      organization: {
        select: { name: true }
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
        shortCode: link.shortCode,
        originalUrl: link.originalUrl,
        title: link.title,
        description: link.description,
        shortUrl: `${link.domain?.domain || process.env.DEFAULT_SHORT_DOMAIN}/${link.shortCode}`,
        isActive: link.isActive,
        hasPassword: !!link.password,
        expiresAt: link.expiresAt,
        maxClicks: link.maxClicks,
        currentClicks: link._count.clicks,
        createdBy: link.user?.name || link.organization?.name,
        createdAt: link.createdAt
      }
    }
  });
};

// Helper function to render expired page
const renderExpiredPage = (res, link, message) => {
  const branding = link.organization?.branding;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${branding?.redirectTitle || 'Link Expired'} - ${process.env.APP_NAME}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, ${branding?.primaryColor || '#3B82F6'}, ${branding?.secondaryColor || '#8B5CF6'});
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          margin: 1rem;
        }
        .logo {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: ${branding?.primaryColor || '#3B82F6'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        h1 {
          color: #1F2937;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
        p {
          color: #6B7280;
          margin-bottom: 1.5rem;
        }
        .btn {
          background: ${branding?.primaryColor || '#3B82F6'};
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          text-decoration: none;
          display: inline-block;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background: ${branding?.secondaryColor || '#8B5CF6'};
        }
        ${branding?.customCss || ''}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          ${branding?.logo ? `<img src="${branding.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">` : '🔗'}
        </div>
        <h1>${branding?.redirectTitle || 'Link Expired'}</h1>
        <p>${branding?.redirectMessage || message}</p>
        <a href="${process.env.APP_URL}" class="btn">Visit ${process.env.APP_NAME}</a>
      </div>
    </body>
    </html>
  `;

  res.status(410).send(html);
};

// Helper function to render password page
const renderPasswordPage = (res, link, error = null) => {
  const branding = link.organization?.branding;
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Required - ${process.env.APP_NAME}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, ${branding?.primaryColor || '#3B82F6'}, ${branding?.secondaryColor || '#8B5CF6'});
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          margin: 1rem;
        }
        .logo {
          width: 64px;
          height: 64px;
          margin: 0 auto 1rem;
          background: ${branding?.primaryColor || '#3B82F6'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
        }
        h1 {
          color: #1F2937;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
        p {
          color: #6B7280;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1rem;
          text-align: left;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #374151;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #D1D5DB;
          border-radius: 0.5rem;
          font-size: 1rem;
          box-sizing: border-box;
        }
        input:focus {
          outline: none;
          border-color: ${branding?.primaryColor || '#3B82F6'};
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .btn {
          background: ${branding?.primaryColor || '#3B82F6'};
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          font-size: 1rem;
          transition: background-color 0.2s;
        }
        .btn:hover {
          background: ${branding?.secondaryColor || '#8B5CF6'};
        }
        .error {
          color: #EF4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
        ${branding?.customCss || ''}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          ${branding?.logo ? `<img src="${branding.logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;">` : '🔒'}
        </div>
        <h1>Password Required</h1>
        <p>This link is password protected. Please enter the password to continue.</p>
        
        <form method="GET" action="/${link.shortCode}">
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            ${error ? `<div class="error">${error}</div>` : ''}
          </div>
          <button type="submit" class="btn">Access Link</button>
        </form>
      </div>
    </body>
    </html>
  `;

  res.status(403).send(html);
};