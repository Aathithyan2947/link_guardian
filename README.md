# LinkGuardian - Smart Link Management Platform

A comprehensive full-stack SaaS platform for smart link management with advanced analytics, health monitoring, and white-labeling capabilities.

## 🏗️ Architecture

This project is structured as a full-stack application:

- **Backend**: Express.js API server with PostgreSQL database
- **Frontend**: React.js application with Vite
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for rate limiting and caching
- **Authentication**: Firebase Auth integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis server (optional)
- Firebase project for authentication

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd linkguardian
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up the database**
```bash
cd backend
npm run db:generate
npm run db:push
npm run db:seed
```

5. **Start the development servers**
```bash
# From the root directory
npm run dev
```

This will start:
- Backend API server on http://localhost:5000
- Frontend development server on http://localhost:3000

## 📁 Project Structure

```
linkguardian/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Application entry point
│   ├── prisma/             # Database schema and migrations
│   ├── .env.example        # Environment variables template
│   └── package.json
├── frontend/               # React.js application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── config/         # Configuration
│   ├── public/             # Static assets
│   └── package.json
└── package.json            # Root package.json with scripts
```

## 🔧 Development

### Available Scripts

From the root directory:

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run backend:dev` - Start only the backend server
- `npm run frontend:dev` - Start only the frontend server

### Backend Scripts

From the `backend/` directory:

- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio

### Frontend Scripts

From the `frontend/` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🌐 API Integration

The frontend communicates with the backend through:

1. **Development**: Vite proxy configuration routes `/api/*` requests to `http://localhost:5000`
2. **Production**: Configure `API_BASE_URL` in `frontend/src/config/api.js`

### API Service

The frontend includes a centralized API service (`frontend/src/services/api.js`) that handles:

- Authentication headers
- Error handling
- Request/response formatting
- Token management

## 🔐 Environment Variables

All environment variables are stored in `backend/.env`. The frontend doesn't require a separate `.env` file.

Key variables to configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkguardian"

# Firebase Authentication
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Server
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Run database migrations: `npm run db:push`
3. Start the server: `npm start`

### Frontend Deployment

1. Update `API_BASE_URL` in `frontend/src/config/api.js`
2. Build the application: `npm run build`
3. Deploy the `dist/` folder to your hosting platform

### Full-Stack Deployment

For platforms like Railway, Render, or Heroku:

1. Set the root directory build command: `npm run install:all && npm run frontend:build`
2. Set the start command: `npm run backend:start`
3. Configure environment variables in the platform dashboard

## 📚 API Documentation

When the backend is running, visit:
- **Swagger UI**: http://localhost:5000/docs
- **OpenAPI JSON**: http://localhost:5000/docs/openapi.json

## 🔍 Health Monitoring

Health check endpoints:
- **General Health**: http://localhost:5000/health
- **Readiness**: http://localhost:5000/health/ready
- **Liveness**: http://localhost:5000/health/live

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Visit `/docs` endpoint when server is running
- **Issues**: GitHub Issues
- **Email**: support@linkguardian.com

## 🎯 Next Steps

1. Copy `backend/.env.example` to `backend/.env` and configure your environment variables
2. Set up your PostgreSQL database and update `DATABASE_URL`
3. Configure Firebase authentication
4. Run `npm run install:all` to install dependencies
5. Run `npm run dev` to start development servers
6. Visit http://localhost:3000 to see the application

The application will be fully functional with just the backend `.env` configuration!