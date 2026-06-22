# Scaffolding Commands Reference

This document lists all the exact Nx commands and setup steps used to create the Portfolio Management Dashboard monorepo.

## Workspace Initialization

### 1. Create Nx Workspace

```bash
npx create-nx-workspace@latest manulife-portfolio-dashboard \
  --preset=apps \
  --workspaceType=integrated \
  --nxCloud=skip \
  --packageManager=pnpm \
  --interactive=false \
  --skipGit
```

### 2. Install Nx Plugins

```bash
cd manulife-portfolio-dashboard
pnpm nx add @nx/nest --interactive=false
pnpm nx add @nx/react --interactive=false
```

### 3. Generate Applications

**API (NestJS):**
```bash
pnpm nx g @nx/nest:application \
  --name=api \
  --directory=api \
  --unitTestRunner=jest \
  --e2eTestRunner=none \
  --linter=eslint \
  --strict=true \
  --interactive=false
```

**Web (React + Vite):**
```bash
pnpm nx g @nx/react:application \
  --name=web \
  --directory=web \
  --bundler=vite \
  --unitTestRunner=vitest \
  --e2eTestRunner=none \
  --routing=true \
  --style=css \
  --linter=eslint \
  --interactive=false
```

### 4. Move Projects Under apps/ Directory

After generation, projects were at the root level. Manual steps were taken to reorganize them:

```bash
# Update nx.json with workspace layout
# Add to nx.json:
# "workspaceLayout": {
#   "appsDir": "apps",
#   "libsDir": "libs"
# }

mkdir -p apps
mv api apps/api
mv web apps/web

# Update all relative paths in:
# - apps/api/project.json
# - apps/api/webpack.config.js
# - apps/api/tsconfig.json and related configs
# - apps/web/project.json
# - apps/web/vite.config.mts
# - apps/web/tsconfig.json and related configs
```

### 5. Install Dependencies

#### Backend/Shared

```bash
pnpm add \
  @nestjs/swagger \
  class-validator \
  class-transformer \
  passport \
  passport-jwt \
  bcrypt \
  @nestjs/config \
  @prisma/client \
  axios

pnpm add -D \
  prisma \
  @types/passport-jwt \
  @types/bcrypt \
  @types/passport \
  @types/node
```

#### Frontend

```bash
pnpm add \
  @tanstack/react-query \
  react-router-dom \
  @mui/material \
  @mui/icons-material \
  @mui/x-data-grid \
  react-hook-form \
  zod \
  recharts

pnpm add -D \
  @testing-library/jest-dom
```

## Development Commands

### Build & Serve

```bash
# Build all projects
pnpm build

# Serve individual projects
pnpm dev:api          # http://localhost:3000
pnpm dev:web          # http://localhost:4200

# Serve both in parallel
pnpm dev
```

### Code Quality

```bash
pnpm lint             # Run ESLint
pnpm format           # Run Prettier
pnpm test             # Run Jest/Vitest
pnpm test:ci          # Run tests with coverage
```

### Docker

```bash
pnpm docker:up        # Start all services
pnpm docker:down      # Stop all services
pnpm docker:logs      # View logs
```

### Nx-Specific Commands

```bash
# Show project graph
pnpm nx graph

# Show details of a project
pnpm nx show project api
pnpm nx show project web

# Run specific target
pnpm nx run api:build
pnpm nx run web:build
pnpm nx run api:serve

# Run targets across multiple projects
pnpm nx run-many --target=build --projects=api,web
pnpm nx run-many --target=lint --all
```

## Folder Structure Verification

```bash
# View complete project structure
tree -I node_modules -L 4

# List all TypeScript/source files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  ! -path "./node_modules/*" \
  ! -path "./.nx/*" \
  | sort
```

## Configuration Files

### Root TypeScript Config

```bash
cat tsconfig.base.json
# Includes path aliases for shared libraries:
# @portfolio/shared-types
# @portfolio/shared-constants
# @portfolio/shared-utils
```

### Prettier Config

```bash
cat .prettierrc
# Single quotes, trailing commas, 100 char line width
```

### ESLint Config

```bash
cat eslint.config.mjs
# Nx-integrated ESLint with TypeScript support
```

### Nx Config

```bash
cat nx.json
# Includes workspace layout, plugins, and generator defaults
```

## Database Setup (Prisma)

```bash
# Generate Prisma client
cd apps/api
pnpm prisma generate

# Create and run migrations
pnpm prisma migrate dev --name init

# View database (Prisma Studio)
pnpm prisma studio
```

## Docker Build Commands

```bash
# Build all Docker images
docker-compose build

# Build specific image
docker build -f apps/api/Dockerfile -t portfolio-api:latest .
docker build -f apps/web/Dockerfile -t portfolio-web:latest .

# Push to registry (example)
docker tag portfolio-api:latest myregistry/portfolio-api:latest
docker push myregistry/portfolio-api:latest
```

## GitHub Actions CI

The CI pipeline (`.github/workflows/ci.yml`) includes:
1. **install** – Dependency caching with pnpm
2. **lint** – ESLint checks all projects
3. **test** – Jest/Vitest with coverage
4. **build** – Production builds for API and Web

Trigger manually or on push to `main`/`develop`:

```bash
git push origin main
```

## Package Management

```bash
# Add package to workspace root
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Add to specific project (if needed)
pnpm add package-name --filter api
pnpm add package-name --filter web

# Remove package
pnpm remove package-name

# Update packages
pnpm update

# Check workspace structure
pnpm list --depth=0
```

## Authentication Setup

The authentication system is implemented in `apps/api/src/modules/auth/` with JWT-based tokens and role-based access control.

### 1. Install Authentication Dependencies

```bash
# Already included in package.json:
# - @nestjs/jwt
# - @nestjs/passport
# - passport-jwt
# - bcrypt
# - class-validator

pnpm install
```

### 2. Configure JWT Secrets

```bash
# Copy environment template
cp apps/api/.env.example apps/api/.env.local

# Edit and replace JWT secrets (generate strong random strings)
# openssl rand -base64 32

# Required environment variables:
# JWT_ACCESS_SECRET=<strong-random-string>
# JWT_REFRESH_SECRET=<strong-random-string>
# JWT_ACCESS_EXPIRES_IN=15m
# JWT_REFRESH_EXPIRES_IN=7d
# DATABASE_URL=postgresql://...
```

### 3. Run Database Migrations

```bash
# Generate Prisma client
cd apps/api
pnpm prisma generate

# Run migrations (creates users, portfolios, investments, transactions tables)
pnpm prisma migrate dev --name init
```

### 4. Seed Demo User

```bash
# Create demo user (email: demo@manulife.com, password: Password123!)
cd apps/api
pnpm prisma db seed

# Or using ts-node:
npx ts-node prisma/seed.ts
```

### 5. Test Authentication Endpoints

```bash
# Start API server
pnpm dev:api

# Login (returns accessToken, refreshToken)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@manulife.com","password":"Password123!"}'

# Get current user (requires accessToken)
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <your-access-token>"

# Refresh token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your-refresh-token>"}'

# Logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <your-access-token>"
```

### 6. View API Documentation

```bash
# Open Swagger UI in browser
http://localhost:3000/docs

# To authenticate in Swagger:
# 1. Click "Authorize" button
# 2. Enter: Bearer <your-access-token>
# 3. Requests will include the token automatically
```

### Authentication Module Structure

```
apps/api/src/modules/auth/
├── strategies/
│   ├── jwt.strategy.ts              # JWT validation strategy
│   └── jwt-refresh.strategy.ts      # Refresh token strategy
├── dtos/
│   ├── login.dto.ts                 # Login request validation
│   ├── refresh-token.dto.ts         # Refresh token request
│   ├── auth-response.dto.ts         # Login response
│   ├── current-user.dto.ts          # User information
│   └── refresh-token-response.dto.ts # Refresh response
├── auth.controller.ts               # Endpoints: login, refresh, logout, me
├── auth.service.ts                  # JWT, password hashing, token lifecycle
├── auth.module.ts                   # Module definition & imports
├── auth.service.spec.ts             # Unit tests skeleton
└── auth.controller.spec.ts          # Controller tests skeleton

apps/api/src/modules/decorators/
├── current-user.decorator.ts        # @CurrentUser() decorator
└── roles.decorator.ts               # @Roles() decorator

apps/api/src/modules/guards/
├── jwt-auth.guard.ts                # JwtAuthGuard for protected routes
├── roles.guard.ts                   # RolesGuard for role-based access
└── index.ts

apps/api/src/modules/common/
└── prisma.service.ts                # Database client service

apps/api/src/modules/users/
├── users.service.ts                 # User repository operations
├── users.module.ts                  # Module definition
└── users.service.spec.ts            # Unit tests skeleton

docs/
└── authentication.md                 # Complete authentication documentation
```

### Authentication Flows

#### Login
- Request: `POST /auth/login` with email & password
- Response: `{ accessToken, refreshToken, user }`
- Password verified with bcrypt

#### Refresh
- Request: `POST /auth/refresh` with refreshToken
- Response: `{ accessToken, refreshToken }`
- Issues new token pair on valid refresh token

#### Protected Route
- Requires: `Authorization: Bearer <accessToken>` header
- Guard validates JWT signature and expiration
- User available via `@CurrentUser()` decorator

#### Roles
- Use `@Roles('ADMIN')` decorator on endpoints
- RolesGuard validates user role matches decorator

### Documentation

See `docs/authentication.md` for:
- Detailed JWT architecture
- Token lifecycle & refresh strategy
- Request/response examples
- Security considerations
- Future improvements (token blacklist, session storage, MFA)

## Troubleshooting Commands


```bash
# Clear Nx cache
pnpm nx reset

# Validate Nx workspace
pnpm nx list

# Show affected projects
pnpm nx affected --target=lint

# Verbose output for debugging
pnpm nx build api --verbose
```

## Environment Setup

```bash
# Copy example env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Edit and add secrets
# apps/api/.env
# apps/web/.env
```

---

**Workspace:** manulife-portfolio-dashboard  
**Created:** June 2026  
**Nx Version:** 23.0.0  
**Node Version:** 24.x  
**Package Manager:** pnpm 10.x+
