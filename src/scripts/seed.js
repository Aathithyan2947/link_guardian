import { PrismaClient } from '@prisma/client';
import { generateShortCode, hashPassword } from '../utils/helpers.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default domain
  const defaultDomain = await prisma.domain.upsert({
    where: { domain: process.env.DEFAULT_SHORT_DOMAIN || 'lg.co' },
    update: {},
    create: {
      domain: process.env.DEFAULT_SHORT_DOMAIN || 'lg.co',
      isDefault: true,
      isVerified: true,
      sslEnabled: true
    }
  });

  console.log('✅ Default domain created');

  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@linkguardian.com' },
    update: {},
    create: {
      firebaseUid: 'demo-firebase-uid',
      email: 'demo@linkguardian.com',
      name: 'Demo User',
      emailVerified: true,
      plan: 'PRO'
    }
  });

  console.log('✅ Demo user created');

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      description: 'A demo organization for testing',
      plan: 'PRO',
      ownerId: demoUser.id
    }
  });

  console.log('✅ Demo organization created');

  // Add user to organization
  await prisma.organizationMember.upsert({
    where: {
      userId_organizationId: {
        userId: demoUser.id,
        organizationId: demoOrg.id
      }
    },
    update: {},
    create: {
      userId: demoUser.id,
      organizationId: demoOrg.id,
      role: 'OWNER',
      joinedAt: new Date()
    }
  });

  // Create demo branding
  await prisma.branding.upsert({
    where: { organizationId: demoOrg.id },
    update: {},
    create: {
      organizationId: demoOrg.id,
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      redirectTitle: 'Demo Organization',
      redirectMessage: 'This link is managed by Demo Organization'
    }
  });

  console.log('✅ Demo branding created');

  // Create demo links
  const demoLinks = [
    {
      originalUrl: 'https://github.com',
      title: 'GitHub',
      description: 'The world\'s leading software development platform',
      tags: ['development', 'git', 'code']
    },
    {
      originalUrl: 'https://stackoverflow.com',
      title: 'Stack Overflow',
      description: 'Where developers learn, share, & build careers',
      tags: ['development', 'help', 'community']
    },
    {
      originalUrl: 'https://developer.mozilla.org',
      title: 'MDN Web Docs',
      description: 'Resources for developers, by developers',
      tags: ['documentation', 'web', 'reference']
    },
    {
      originalUrl: 'https://nodejs.org',
      title: 'Node.js',
      description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
      tags: ['javascript', 'runtime', 'backend']
    },
    {
      originalUrl: 'https://reactjs.org',
      title: 'React',
      description: 'A JavaScript library for building user interfaces',
      tags: ['javascript', 'frontend', 'library']
    }
  ];

  for (const linkData of demoLinks) {
    const shortCode = generateShortCode();
    
    await prisma.link.create({
      data: {
        shortCode,
        originalUrl: linkData.originalUrl,
        title: linkData.title,
        description: linkData.description,
        tags: linkData.tags,
        userId: demoUser.id,
        organizationId: demoOrg.id,
        domainId: defaultDomain.id,
        healthStatus: 'HEALTHY',
        enableTracking: true
      }
    });
  }

  console.log('✅ Demo links created');

  // Create demo API token
  await prisma.apiToken.create({
    data: {
      name: 'Demo API Token',
      token: 'lg_demo_token_12345',
      scopes: ['read', 'write'],
      userId: demoUser.id,
      organizationId: demoOrg.id
    }
  });

  console.log('✅ Demo API token created');

  // Create some demo clicks for analytics
  const links = await prisma.link.findMany({
    where: { userId: demoUser.id }
  });

  for (const link of links) {
    // Create clicks for the last 30 days
    for (let i = 0; i < 30; i++) {
      const clicksPerDay = Math.floor(Math.random() * 20) + 1;
      
      for (let j = 0; j < clicksPerDay; j++) {
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - i);
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        await prisma.click.create({
          data: {
            linkId: link.id,
            timestamp,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            referer: Math.random() > 0.5 ? 'https://google.com' : null,
            country: ['US', 'UK', 'CA', 'DE', 'FR'][Math.floor(Math.random() * 5)],
            city: ['New York', 'London', 'Toronto', 'Berlin', 'Paris'][Math.floor(Math.random() * 5)],
            device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)],
            browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
            os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)]
          }
        });
      }
    }

    // Update link click count
    const clickCount = await prisma.click.count({
      where: { linkId: link.id }
    });

    await prisma.link.update({
      where: { id: link.id },
      data: { currentClicks: clickCount }
    });
  }

  console.log('✅ Demo analytics data created');

  console.log('🎉 Database seed completed successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('Email: demo@linkguardian.com');
  console.log('API Token: lg_demo_token_12345');
  console.log('\n🔗 Demo links created with analytics data');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });