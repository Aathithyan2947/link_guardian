import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LinkGuardian API',
      version: '1.0.0',
      description: 'Smart Link Management Platform API',
      contact: {
        name: 'LinkGuardian Support',
        email: process.env.SUPPORT_EMAIL || 'support@linkguardian.com',
        url: process.env.APP_URL || 'https://linkguardian.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.APP_URL || 'http://localhost:3000',
        description: 'Production server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase JWT token'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Error message'
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            path: {
              type: 'string',
              example: '/api/v1/links'
            },
            method: {
              type: 'string',
              example: 'GET'
            }
          }
        },
        Link: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            shortCode: {
              type: 'string',
              example: 'abc123'
            },
            originalUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://example.com'
            },
            title: {
              type: 'string',
              example: 'Example Website'
            },
            description: {
              type: 'string',
              example: 'This is an example website'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['example', 'website']
            },
            shortUrl: {
              type: 'string',
              format: 'uri',
              example: 'https://lg.co/abc123'
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            healthStatus: {
              type: 'string',
              enum: ['HEALTHY', 'WARNING', 'ERROR', 'UNKNOWN'],
              example: 'HEALTHY'
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              nullable: true
            },
            maxClicks: {
              type: 'integer',
              nullable: true,
              example: 1000
            },
            currentClicks: {
              type: 'integer',
              example: 42
            },
            enableTracking: {
              type: 'boolean',
              example: true
            },
            hasPassword: {
              type: 'boolean',
              example: false
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            avatar: {
              type: 'string',
              format: 'uri',
              nullable: true
            },
            plan: {
              type: 'string',
              enum: ['FREE', 'STARTER', 'PRO', 'ENTERPRISE'],
              example: 'PRO'
            },
            emailVerified: {
              type: 'boolean',
              example: true
            },
            isActive: {
              type: 'boolean',
              example: true
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and profile management'
      },
      {
        name: 'Links',
        description: 'Link management operations'
      },
      {
        name: 'Analytics',
        description: 'Analytics and reporting'
      },
      {
        name: 'Organizations',
        description: 'Organization and team management'
      },
      {
        name: 'Domains',
        description: 'Custom domain management'
      },
      {
        name: 'Health',
        description: 'Service health checks'
      },
      {
        name: 'Redirect',
        description: 'Link redirection'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'LinkGuardian API Documentation',
  customfavIcon: '/favicon.ico'
}));

// Serve OpenAPI JSON
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

export default router;