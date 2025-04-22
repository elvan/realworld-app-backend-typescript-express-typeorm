import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { routes } from './routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const apiPrefix = process.env.API_PREFIX || '/api';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RealWorld API',
      version: '1.0.0',
      description: 'RealWorld API Documentation',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'RealWorld',
        url: 'https://github.com/gothinkster/realworld',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}${apiPrefix}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/entities/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use(apiPrefix, routes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the RealWorld API',
    documentation: `${req.protocol}://${req.get('host')}/api-docs`,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    errors: {
      body: ['Not found'],
    },
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    errors: {
      body: ['Internal server error'],
    },
  });
});

export default app;
