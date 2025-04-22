import 'reflect-metadata';
import { AppDataSource } from './data-source';
import app from './app';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 8000;

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API is available at http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`);
    });
  })
  .catch((error) => console.error('Error during Data Source initialization:', error));

// Handle application shutdown gracefully
process.on('SIGINT', () => {
  console.log('Application is shutting down...');
  process.exit(0);
});
