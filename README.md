# ![RealWorld Example App](https://raw.githubusercontent.com/gothinkster/realworld/master/media/realworld.png)

> ### Express/TypeScript/TypeORM codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

[![RealWorld Backend](https://img.shields.io/badge/realworld-backend-%23783578.svg)](http://realworld.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange)](https://typeorm.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)

### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Express.js, TypeScript, and TypeORM** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Express.js** community styleguides & best practices.

For more information on how this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

This is a backend implementation of the RealWorld spec using:

- **TypeScript** for type safety and enhanced developer experience
- **Express.js** as the web framework for handling HTTP requests
- **TypeORM** for database operations and model management
- **MySQL** as the database engine
- **JWT** for secure authentication

The application follows a structured architecture:

```
├── src/
│   ├── config/            # Environment variables and configuration
│   ├── controllers/       # Route controllers
│   ├── entities/          # TypeORM entities/models
│   ├── migrations/        # Database migrations
│   ├── middleware/        # Express middleware
│   ├── routes/            # Express routes
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions and helpers
│   ├── validation/        # Request validation schemas
│   ├── app.ts             # Express app setup
│   └── index.ts           # Application entry point
├── test/                  # Tests
└── scripts/               # Build and deployment scripts
```

# Getting started

## Prerequisites

- Node.js (v18+ recommended)
- MySQL (v8.0+ recommended)
- npm or yarn

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/realworld-app-backend-typescript-express-typeorm.git
cd realworld-app-backend-typescript-express-typeorm

# Install dependencies
npm install

# Copy environment variables file
cp .env.example .env

# Update the .env file with your MySQL connection details and JWT secret

# Run database migrations
npm run migration:run

# Start the development server
npm run dev
```

The API will be available at `http://localhost:8000/api`.

# API Overview

This API implements the RealWorld specification providing all the required endpoints:

## Authentication

- `POST /api/users/login` - Login for existing user
- `POST /api/users` - Register a new user
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user

## Profiles

- `GET /api/profiles/:username` - Get a profile
- `POST /api/profiles/:username/follow` - Follow a user
- `DELETE /api/profiles/:username/follow` - Unfollow a user

## Articles

- `GET /api/articles` - Get recent articles
- `GET /api/articles/feed` - Get articles from followed users
- `GET /api/articles/:slug` - Get an article
- `POST /api/articles` - Create an article
- `PUT /api/articles/:slug` - Update an article
- `DELETE /api/articles/:slug` - Delete an article

## Comments

- `GET /api/articles/:slug/comments` - Get comments for an article
- `POST /api/articles/:slug/comments` - Add comment to an article
- `DELETE /api/articles/:slug/comments/:id` - Delete a comment

## Favorites

- `POST /api/articles/:slug/favorite` - Favorite an article
- `DELETE /api/articles/:slug/favorite` - Unfavorite an article

## Tags

- `GET /api/tags` - Get all tags

# Development Scripts

```bash
# Build the project
npm run build

# Start the server in production mode
npm start

# Start development server with hot-reloading
npm run dev

# Run tests
npm test

# Lint the code
npm run lint

# Database migrations
npm run migration:generate # Generate new migrations
npm run migration:run     # Run migrations
npm run migration:revert  # Revert the latest migration
```

# Documentation

API documentation is available via Swagger at `/api-docs` when the server is running.

# License

This project is licensed under the MIT License - see the LICENSE file for details.
