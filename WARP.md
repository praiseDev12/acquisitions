# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API server for an "acquisitions" system with authentication capabilities. The application uses modern ES modules, PostgreSQL with Drizzle ORM, and follows a layered architecture pattern.

**Key Technologies:**

- **Runtime**: Node.js with ES modules (`"type": "module"`)
- **Framework**: Express.js v5
- **Database**: PostgreSQL via Neon serverless with Drizzle ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Security**: Helmet, CORS, bcrypt password hashing, Arcjet protection
- **Validation**: Zod schemas
- **Logging**: Winston with file and console transports
- **Testing**: Jest with Supertest (configured but tests not implemented)

## Architecture

The codebase follows a clean layered architecture with clear separation of concerns:

### Import Path Mapping

The project uses Node.js `imports` field for clean import paths:

- `#src/*` → `./src/*`
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Application Structure

**Entry Point Flow:**

1. `src/index.js` - Loads environment variables and starts server
2. `src/server.js` - Creates server instance and listens on PORT
3. `src/app.js` - Express app configuration with middleware and routes

**Core Layers:**

- **Routes** (`src/routes/`): Express route handlers, currently only auth routes
- **Controllers** (`src/controllers/`): Request/response handling, validation, and business logic orchestration
- **Services** (`src/services/`): Business logic and data access operations
- **Models** (`src/models/`): Drizzle ORM schema definitions
- **Validations** (`src/validations/`): Zod validation schemas
- **Utils** (`src/utils/`): Reusable utilities for JWT, cookies, formatting
- **Config** (`src/config/`): Database connection and Winston logger configuration

### Database Architecture

- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL
- **Migrations**: Located in `./drizzle/` directory
- **Schema**: Currently has `users` table with roles (user/admin)

### Security Features

- JWT authentication with HTTP-only cookies (15min expiration)
- Password hashing with bcrypt (10 rounds)
- Helmet for security headers
- CORS configuration
- Arcjet protection (configured but usage not visible in current code)

## Development Commands

### Core Development

```bash
# Start development server with auto-reload
npm run dev

# Database operations
npm run db:generate    # Generate Drizzle migrations
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio (database GUI)
```

### Code Quality

```bash
# Linting
npm run lint           # Check for linting errors
npm run lint:fix       # Fix auto-fixable linting errors

# Formatting
npm run format         # Format code with Prettier
npm run format:check   # Check if code is properly formatted
```

### Testing

The project has Jest and Supertest configured but no test files exist yet. Create test files in a `tests/` or `__tests__/` directory.

### Environment Setup

Create a `.env` file with these required variables:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level (defaults to 'info')

## API Endpoints

### Health & Status

- `GET /` - Basic API greeting
- `GET /health` - Health check with uptime
- `GET /api` - API status message

### Authentication (`/api/auth`)

- `POST /api/auth/sign-up` - User registration (implemented)
- `POST /api/auth/sign-in` - User login (placeholder)
- `POST /api/auth/sign-out` - User logout (placeholder)

## Development Notes

### Current Implementation Status

- ✅ User registration with validation and JWT tokens
- ❌ User login implementation missing
- ❌ User logout implementation missing
- ❌ Authentication middleware not implemented
- ❌ Protected routes not implemented
- ❌ Tests not written

### Authentication Flow

1. User registers via `/api/auth/sign-up`
2. Password is hashed with bcrypt
3. User record created in database
4. JWT token generated and set as HTTP-only cookie
5. User data returned (excluding password)

### Error Handling

- Validation errors return 400 with formatted Zod error messages
- Duplicate email registration returns 409
- Unhandled errors are passed to Express error handler
- All errors are logged via Winston

### Logging

- File logging: `logs/combined.log` (all levels), `logs/error.lg` (errors only)
- Console logging: Development only with colorized output
- Request logging: Morgan middleware logs all requests

### Database Schema

The `users` table includes:

- `id` (serial, primary key)
- `name` (varchar, required)
- `email` (varchar, unique, required)
- `password` (varchar, hashed)
- `role` (enum: 'user'/'admin', defaults to 'user')
- `created_at`, `updated_at` (timestamps)
