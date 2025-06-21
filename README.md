# LinkGuardian Backend

A comprehensive, production-ready Express.js backend for the LinkGuardian SaaS platform - Smart Link Management with advanced analytics, health monitoring, and white-labeling capabilities.

## 🚀 Features

### Core Features
- **Link Management**: Create, update, delete short links with custom slugs
- **Advanced Analytics**: Track clicks with geolocation, device, browser data
- **Health Monitoring**: Automated link health checks with notifications
- **White-Labeling**: Custom domains and branding for organizations
- **Team Management**: Multi-user organizations with role-based access
- **API Access**: RESTful API with token-based authentication
- **Notifications**: Email and Slack notifications for important events
- **Payments**: LemonSqueezy integration for subscription management

### Security Features
- Firebase Authentication integration
- JWT token validation
- Rate limiting with Redis
- Input validation and sanitization
- CORS protection
- Security headers with Helmet
- IP anonymization for privacy

### Technical Features
- PostgreSQL with Prisma ORM
- Redis for caching and rate limiting
- Comprehensive error handling
- Request logging and monitoring
- Health check endpoints
- Swagger API documentation
- Docker support
- Automated testing setup

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: Firebase Auth
- **Email**: Resend / SMTP
- **Payments**: LemonSqueezy
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server
- Firebase project
- Environment variables (see `.env.example`)

### Quick Start

1. **Clone and install dependencies**
```bash
git clone <repository>
cd linkguardian-backend
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Set up database**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

### Docker Setup

1. **Start with Docker Compose**
```bash
docker-compose up -d
```

2. **Run database migrations**
```bash
docker-compose exec app npm run db:push
docker-compose exec app npm run db:seed
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkguardian"

# Redis
REDIS_URL="redis://localhost:6379"

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Email
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# LemonSqueezy
LEMONSQUEEZY_API_KEY=your-api-key
LEMONSQUEEZY_WEBHOOK_SECRET=your-webhook-secret
```

### Firebase Setup

1. Create a Firebase project
2. Enable Authentication
3. Generate a service account key
4. Add the credentials to your environment variables

## 📚 API Documentation

### Endpoints Overview

- **Authentication**: `/api/v1/auth/*`
- **Links**: `/api/v1/links/*`
- **Analytics**: `/api/v1/analytics/*`
- **Organizations**: `/api/v1/organizations/*`
- **Domains**: `/api/v1/domains/*`
- **API Tokens**: `/api/v1/api-tokens/*`
- **Admin**: `/api/v1/admin/*`

### Interactive Documentation

Visit `/docs` when the server is running to access the Swagger UI documentation.

### Authentication

The API supports two authentication methods:

1. **Firebase JWT** (for web/mobile apps)
```bash
Authorization: Bearer <firebase-jwt-token>
```

2. **API Keys** (for server-to-server)
```bash
X-API-Key: lg_your_api_key_here
```

### Example Requests

**Create a link:**
```bash
curl -X POST http://localhost:3000/api/v1/links \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "originalUrl": "https://example.com",
    "title": "Example Site",
    "tags": ["example", "demo"]
  }'
```

**Get analytics:**
```bash
curl -X GET "http://localhost:3000/api/v1/analytics/links/abc123?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer <token>"
```

## 🔍 Monitoring & Health Checks

### Health Endpoints

- `/health` - Overall health status
- `/health/ready` - Readiness check
- `/health/live` - Liveness check

### Monitoring Features

- Request logging with unique IDs
- Error tracking and reporting
- Performance metrics
- Database connection monitoring
- Redis connection monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Set up Redis cluster
- [ ] Configure email service
- [ ] Set up monitoring
- [ ] Configure SSL/TLS
- [ ] Set up backup strategy
- [ ] Configure log aggregation

### Docker Deployment

```bash
# Build production image
docker build -t linkguardian-backend .

# Run container
docker run -d \
  --name linkguardian-api \
  -p 3000:3000 \
  --env-file .env.production \
  linkguardian-backend
```

## 📊 Database Schema

The application uses Prisma ORM with PostgreSQL. Key entities:

- **Users**: User accounts and profiles
- **Organizations**: Team/organization management
- **Links**: Short links with metadata
- **Clicks**: Analytics data for link clicks
- **Domains**: Custom domain management
- **ApiTokens**: API access tokens
- **Notifications**: System notifications

## 🔐 Security

### Security Measures

- Firebase Authentication integration
- JWT token validation
- Rate limiting (100 requests/15min by default)
- Input validation with Joi
- XSS protection
- SQL injection prevention
- CORS configuration
- Security headers with Helmet
- IP address anonymization

### Rate Limiting

Plan-based rate limits:
- **Free**: 100 requests/hour, 10 links
- **Starter**: 1,000 requests/hour, 100 links
- **Pro**: 10,000 requests/hour, 1,000 links
- **Enterprise**: 100,000 requests/hour, unlimited links

## 🔧 Development

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── scripts/         # Database seeds, etc.
└── server.js        # Application entry point
```

### Code Style

- ESLint with Standard config
- Prettier for formatting
- Conventional commits
- JSDoc for documentation

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: `/docs` endpoint
- **Issues**: GitHub Issues
- **Email**: support@linkguardian.com

## 🎯 Roadmap

- [ ] GraphQL API
- [ ] Real-time analytics
- [ ] Advanced A/B testing
- [ ] Mobile SDKs
- [ ] Advanced fraud detection
- [ ] Multi-region deployment
- [ ] Advanced reporting
- [ ] Webhook system