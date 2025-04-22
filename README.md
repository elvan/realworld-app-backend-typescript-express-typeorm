# RealWorld API Backend - TypeScript, Express, TypeORM

[![RealWorld Backend](https://img.shields.io/badge/realworld-backend-%23783578.svg)](http://realworld.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange)](https://typeorm.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)](https://www.mysql.com/)

A backend implementation of the [RealWorld](https://github.com/gothinkster/realworld) spec using TypeScript, Express.js, TypeORM, and MySQL.

## Overview

This project is a production-ready backend implementation of the RealWorld "Conduit" blog application. It adheres to the [RealWorld API spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction) and features:

- RESTful API with Express.js
- Strong typing with TypeScript
- MySQL database integration with TypeORM
- JWT authentication
- Article management with CRUD operations
- User profiles, comments, and follows
- Tagging and article favoriting

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL (v8.0+ recommended)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/realworld-app-backend-typescript-express-typeorm.git
cd realworld-app-backend-typescript-express-typeorm
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Configure environment variables

Copy the `.env.example` file to `.env` and update the variables:

```bash
cp .env.example .env
```

Update the `.env` file with your MySQL connection details and JWT secret.

4. Run database migrations

```bash
npm run migration:run
# or
yarn migration:run
```

5. Start the development server

```bash
npm run dev
# or
yarn dev
```

The API will be available at `http://localhost:8000/api`.

## API Endpoints

The API implements all endpoints defined in the [RealWorld API spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/endpoints):

### Authentication

- `POST /api/users/login` - Login for existing user
- `POST /api/users` - Register a new user
- `GET /api/user` - Get current user
- `PUT /api/user` - Update user

### Profiles

- `GET /api/profiles/:username` - Get a profile
- `POST /api/profiles/:username/follow` - Follow a user
- `DELETE /api/profiles/:username/follow` - Unfollow a user

### Articles

- `GET /api/articles` - Get recent articles
- `GET /api/articles/feed` - Get articles from followed users
- `GET /api/articles/:slug` - Get an article
- `POST /api/articles` - Create an article
- `PUT /api/articles/:slug` - Update an article
- `DELETE /api/articles/:slug` - Delete an article

### Comments

- `GET /api/articles/:slug/comments` - Get comments for an article
- `POST /api/articles/:slug/comments` - Add comment to an article
- `DELETE /api/articles/:slug/comments/:id` - Delete a comment

### Favorites

- `POST /api/articles/:slug/favorite` - Favorite an article
- `DELETE /api/articles/:slug/favorite` - Unfavorite an article

### Tags

- `GET /api/tags` - Get all tags

## Project Structure

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

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reloading
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run migration:generate` - Generate new migrations
- `npm run migration:run` - Run migrations
- `npm run migration:revert` - Revert the latest migration

## Documentation

API documentation is available via Swagger at `/api-docs` when the server is running.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [RealWorld](https://github.com/gothinkster/realworld) for the application specification
- [TypeORM](https://typeorm.io/) for the ORM framework
- [Express.js](https://expressjs.com/) for the web framework
