# Acquisitions API - Dockerized Setup

A Node.js/Express API application using Neon Database with Docker support for both development and production environments.

## 📋 Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Neon Account](https://neon.tech/) with a project set up
- [Neon API Key](https://console.neon.tech/app/settings/api-keys)

## 🏗️ Architecture Overview

This application uses different database setups for development and production:

- **Development**: Uses [Neon Local](https://neon.com/docs/local/neon-local) via Docker for local development with ephemeral branches
- **Production**: Connects directly to Neon Cloud Database

## 🚀 Quick Start

### Development Environment

#### 1. Set Up Environment Variables

First, copy the development environment template and configure it:

```bash
cp .env.development .env.development.local
```

Edit `.env.development.local` and add your Neon credentials:

```bash
# Get these from your Neon Console: https://console.neon.tech
NEON_API_KEY=your_neon_api_key_here
NEON_PROJECT_ID=your_neon_project_id_here
PARENT_BRANCH_ID=your_parent_branch_id_here  # Usually 'main' or your default branch
```

#### 2. Start Development Environment

```bash
# Start with Neon Local (creates ephemeral branches automatically)
docker-compose --env-file .env.development.local -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose --env-file .env.development.local -f docker-compose.dev.yml up -d --build
```

#### 3. Access Your Application

- **Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Database**: localhost:5432 (accessible via any PostgreSQL client)

#### 4. Database Operations

```bash
# Run database migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Generate new migrations
docker-compose -f docker-compose.dev.yml exec app npm run db:generate

# Access Drizzle Studio
docker-compose -f docker-compose.dev.yml exec app npm run db:studio
```

### Production Environment

#### 1. Set Up Environment Variables

Create your production environment file:

```bash
cp .env.production .env.production.local
```

Edit `.env.production.local` with your production values:

```bash
# Use your actual Neon Cloud connection string
DATABASE_URL=postgres://username:password@ep-xyz.region.aws.neon.tech/dbname?sslmode=require

# Production secrets
ARCJET_KEY=your_production_arcjet_key
JWT_SECRET=your_strong_production_jwt_secret
```

#### 2. Deploy Production

```bash
# Build and start production environment
docker-compose --env-file .env.production.local -f docker-compose.prod.yml up --build -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f app
```

## 🐳 Docker Commands Reference

### Development Commands

```bash
# Start development environment
docker-compose --env-file .env.development.local -f docker-compose.dev.yml up

# Rebuild and start
docker-compose --env-file .env.development.local -f docker-compose.dev.yml up --build

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Execute commands in running container
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
```

### Production Commands

```bash
# Start production environment
docker-compose --env-file .env.production.local -f docker-compose.prod.yml up -d

# Scale application (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Update production deployment
docker-compose --env-file .env.production.local -f docker-compose.prod.yml up --build -d

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## 🗄️ Database Configuration

### Neon Local (Development)

Neon Local automatically:
- Creates ephemeral database branches when the container starts
- Deletes branches when the container stops
- Provides a local PostgreSQL-compatible endpoint at `localhost:5432`

**Connection String**: `postgres://neon:npg@neon-local:5432/neondb?sslmode=require`

### Neon Cloud (Production)

Production uses your actual Neon Cloud database:
- Direct connection to Neon Cloud
- No local proxy required
- Full production database features

**Connection String**: Your actual Neon Cloud URL

## 🔧 Environment Variables

### Required for Development

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEON_API_KEY` | Your Neon API key | [Neon Console → Settings → API Keys](https://console.neon.tech/app/settings/api-keys) |
| `NEON_PROJECT_ID` | Your Neon project ID | Neon Console → Project Settings → General |
| `PARENT_BRANCH_ID` | Parent branch for ephemeral branches | Usually `main` or your default branch ID |

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Full Neon Cloud connection string | `postgres://user:pass@ep-xyz.region.aws.neon.tech/db?sslmode=require` |
| `ARCJET_KEY` | Production Arcjet key | `ajkey_...` |
| `JWT_SECRET` | Strong JWT secret | Use a strong, unique string |

## 🔍 Troubleshooting

### Common Issues

#### Development Environment

**Issue**: Neon Local container fails to start
```bash
# Check if you have the correct environment variables
docker-compose -f docker-compose.dev.yml config

# View detailed logs
docker-compose -f docker-compose.dev.yml logs neon-local
```

**Issue**: Application can't connect to database
```bash
# Ensure Neon Local is healthy
docker-compose -f docker-compose.dev.yml ps

# Check network connectivity
docker-compose -f docker-compose.dev.yml exec app ping neon-local
```

#### Production Environment

**Issue**: Application fails to connect to Neon Cloud
- Verify your `DATABASE_URL` is correct
- Ensure your Neon database is not paused
- Check firewall/network restrictions

### Useful Commands

```bash
# Check container health
docker-compose -f docker-compose.dev.yml ps

# View all logs
docker-compose -f docker-compose.dev.yml logs

# Access container shell
docker-compose -f docker-compose.dev.yml exec app sh

# Clean up everything
docker-compose -f docker-compose.dev.yml down -v --remove-orphans
docker system prune -f
```

## 🔄 Development Workflow

1. **Start Development Environment**
   ```bash
   docker-compose --env-file .env.development.local -f docker-compose.dev.yml up
   ```

2. **Make Code Changes**
   - Files are automatically synced with hot reload
   - Database changes are instantly reflected

3. **Run Database Migrations**
   ```bash
   docker-compose -f docker-compose.dev.yml exec app npm run db:migrate
   ```

4. **Test Your Changes**
   - Application: http://localhost:3000
   - Database: Connect to localhost:5432

5. **Stop Environment** (Destroys ephemeral branch)
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## 🚀 Production Deployment

### Option 1: Docker Compose (Single Server)

```bash
# Deploy to production server
scp -r . user@server:/path/to/app
ssh user@server "cd /path/to/app && docker-compose --env-file .env.production.local -f docker-compose.prod.yml up -d"
```

### Option 2: Container Registry

```bash
# Build and push image
docker build -t acquisitions-app:latest --target production .
docker tag acquisitions-app:latest your-registry/acquisitions-app:latest
docker push your-registry/acquisitions-app:latest

# Deploy using the pushed image
# Update docker-compose.prod.yml to use your registry image
```

## 📝 Additional Configuration

### Persistent Development Branches

To persist database branches per Git branch, uncomment these lines in `docker-compose.dev.yml`:

```yaml
volumes:
  - ./.neon_local/:/tmp/.neon_local
  - ./.git/HEAD:/tmp/.git/HEAD:ro
```

Add to your `.env.development.local`:
```bash
DELETE_BRANCH=false
```

### SSL Configuration for JavaScript Apps

If using the Neon serverless driver, configure SSL settings in your application:

```javascript
import { neon, neonConfig } from '@neondatabase/serverless';

// For development with Neon Local
if (process.env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = 'http://neon-local:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Start development environment: `docker-compose --env-file .env.development.local -f docker-compose.dev.yml up`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

- [Neon Documentation](https://neon.com/docs)
- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Docker Documentation](https://docs.docker.com/)

For project-specific issues, please open an issue in this repository.