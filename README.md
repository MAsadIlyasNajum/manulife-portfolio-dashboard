# Manulife Portfolio Management Dashboard

[![Node.js](https://img.shields.io/badge/Node.js-22.19-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red.svg)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-stack portfolio management dashboard built with NestJS, React, TypeScript, and PostgreSQL. Manage investments, track portfolios, monitor transactions, and view comprehensive analytics in a modern, responsive interface.

**Version:** 1.0.0  
**Stack:** NX Monorepo | NestJS | React + Vite | Prisma | PostgreSQL | Docker Compose

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Setup & Installation](#setup--installation)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Database](#database)
- [Contributing](#contributing)
- [Assignment Notes](#assignment-notes)
- [License](#license)

---

## Project Overview

The Manulife Portfolio Management Dashboard is a comprehensive full-stack application designed to help users manage investment portfolios, track transactions, and analyze portfolio performance. Users can:

- Authenticate securely with JWT tokens
- Create and manage multiple portfolios
- Track individual investments with buy/sell transactions
- Monitor transaction history
- View detailed portfolio analytics including allocation, performance, and summary metrics
- Access a responsive dashboard with real-time data visualization

The application follows professional software engineering practices including clean architecture, separation of concerns, comprehensive testing, and production-ready deployment configurations.

---

## Architecture

### Monorepo Structure

```
manulife-portfolio-dashboard/
├── apps/
│   ├── api/              # NestJS backend (port 3000)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/              # JWT authentication, login, register
│   │   │   │   ├── users/             # User management
│   │   │   │   ├── portfolios/        # Portfolio CRUD
│   │   │   │   ├── investments/       # Investment operations
│   │   │   │   ├── transactions/      # Transaction history
│   │   │   │   ├── portfolio-analytics/ # Summary, allocation, performance
│   │   │   │   ├── common/            # Prisma service
│   │   │   │   ├── decorators/        # @CurrentUser, @Roles
│   │   │   │   ├── guards/            # JWT auth guard, roles guard
│   │   │   │   ├── interceptors/      # Response formatting
│   │   │   │   └── filters/           # Exception handling
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   └── prisma/
│   │       ├── schema.prisma          # Database schema
│   │       ├── seed.ts                # Seeding script
│   │       └── migrations/
│   │
│   └── web/              # React + Vite frontend (port 4200)
│       ├── src/
│       │   ├── pages/
│       │   │   ├── LoginPage.tsx       # Authentication
│       │   │   ├── DashboardPage.tsx   # Main dashboard
│       │   │   ├── InvestmentsPage.tsx # Investment management
│       │   │   └── TransactionsPage.tsx# Transaction history
│       │   ├── components/
│       │   │   ├── dashboard/          # Charts, cards, tables
│       │   │   └── common/
│       │   ├── api/
│       │   │   ├── http-client.ts      # Axios configuration
│       │   │   └── services/           # API service layer
│       │   ├── auth/                   # Auth logic, session
│       │   ├── hooks/                  # Custom React hooks
│       │   ├── routes/                 # Route protection
│       │   ├── store/                  # Auth state management
│       │   ├── theme/                  # MUI theming
│       │   └── i18n/                   # Internationalization
│       └── vite.config.mts
│
├── libs/
│   ├── shared-types/    # Shared TypeScript types and DTOs
│   ├── shared-utils/    # Shared utility functions
│   └── shared-constants/# Shared constants
│
├── nx.json              # NX configuration
├── docker-compose.yml   # Full stack orchestration
├── package.json         # Root dependencies
└── README.md
```

### Communication Flow

```
Frontend (React)
    ↓
HTTP Client (Axios)
    ↓
API Services (portfolio.service, auth.service, etc.)
    ↓
NestJS Backend (REST endpoints)
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

All frontend-to-backend communication uses JWT Bearer tokens for authentication.

---

## Features

### Authentication & Authorization

- ✅ User registration with email validation
- ✅ JWT login with access and refresh tokens
- ✅ Protected API routes with `@UseGuards(JwtAuthGuard)`
- ✅ Protected frontend routes with role-based navigation
- ✅ Session persistence across page reloads
- ✅ Automatic token refresh mechanism
- ✅ Secure logout with token invalidation

**Implementation:**
- Backend: `apps/api/src/modules/auth/` with JWT strategies
- Frontend: `apps/web/src/auth/` and `apps/web/src/routes/`

### Portfolio Management

- ✅ Create, read, update, and delete portfolios
- ✅ Portfolio ownership verification
- ✅ List all user portfolios with metadata
- ✅ Real-time portfolio value calculation
- ✅ Portfolio status tracking

**API Endpoints:**
- `POST /portfolios` - Create portfolio
- `GET /portfolios` - List user portfolios
- `GET /portfolios/:id` - Get portfolio details
- `PATCH /portfolios/:id` - Update portfolio
- `DELETE /portfolios/:id` - Delete portfolio

**Implementation:** `apps/api/src/modules/portfolios/`

### Investment Tracking

- ✅ Add investments to portfolios with purchase details
- ✅ Update investment records (quantity, price, etc.)
- ✅ Delete investments
- ✅ Track investment metadata (symbol, type, current value)
- ✅ List all investments with filtering
- ✅ Cost basis calculation

**API Endpoints:**
- `POST /investments` - Add investment
- `GET /investments` - List investments
- `GET /investments/:id` - Get investment details
- `PATCH /investments/:id` - Update investment
- `DELETE /investments/:id` - Delete investment

**Implementation:** `apps/api/src/modules/investments/`

### Transaction Management

- ✅ Record buy/sell transactions
- ✅ Track transaction history per portfolio
- ✅ Transaction type validation (BUY, SELL, DIVIDEND)
- ✅ Transaction date and amount tracking
- ✅ List transactions with pagination

**API Endpoints:**
- `POST /investments/:id/transactions` - Record transaction
- `GET /portfolios/:id/transactions` - Portfolio transaction history
- `DELETE /transactions/:id` - Delete transaction

**Implementation:** `apps/api/src/modules/transactions/`

### Portfolio Analytics

- ✅ Portfolio summary (total value, gain/loss, percentage return)
- ✅ Asset allocation breakdown by symbol and type
- ✅ Performance metrics and trends
- ✅ Unrealized and realized gains/losses
- ✅ Calculated risk metrics

**API Endpoints:**
- `GET /portfolios/:id/analytics` - Complete portfolio analytics

**Calculated Metrics:**
- Total portfolio value
- Absolute and percentage returns
- Asset allocation percentages
- Gain/loss by investment
- Performance trends

**Implementation:** `apps/api/src/modules/portfolio-analytics/`

### Dashboard UI

- ✅ Portfolio overview cards with key metrics
- ✅ Asset allocation pie chart
- ✅ Performance line chart with timeframe selection
- ✅ Top performing and worst performing investments tables
- ✅ Recent transactions feed
- ✅ Investment and transaction management forms
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light theme support
- ✅ Multi-language support (English, Malay)

**Pages:**
- Login Page — Authentication form
- Dashboard — Overview and analytics
- Investments Page — Investment management
- Transactions Page — Transaction history and recording

**Implementation:** `apps/web/src/pages/` and `apps/web/src/components/`

---

## Tech Stack

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| NestJS | 11.0 | HTTP framework |
| TypeScript | 5.9 | Type-safe development |
| Prisma | 6.19 | ORM for database |
| PostgreSQL | 16 | Relational database |
| JWT | 11.0 | Authentication |
| Swagger | 11.4 | API documentation |
| Jest | 30.3 | Unit testing |
| Class Validator | 0.15 | DTO validation |

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.0 | UI framework |
| Vite | 8.0 | Build tool |
| TypeScript | 5.9 | Type-safe development |
| React Router | 6.30 | Navigation |
| React Query | 5.101 | Data fetching |
| Material-UI | 9.1 | Component library |
| Recharts | 3.8 | Data visualization |
| Axios | 1.18 | HTTP client |
| React Hook Form | 7.79 | Form management |
| i18next | 25.6 | Internationalization |

### Infrastructure

| Technology | Version | Purpose |
|-----------|---------|---------|
| Docker | Latest | Containerization |
| Docker Compose | Latest | Orchestration |
| NX | 23.0 | Monorepo management |
| pnpm | 10.17 | Package manager |

---

## Project Structure

### Backend Module Architecture

Each backend module follows NestJS conventions:

```
modules/
├── {module-name}/
│   ├── {module}.module.ts          # NestJS module definition
│   ├── {module}.controller.ts      # Route handlers
│   ├── {module}.service.ts         # Business logic
│   ├── {module}.service.spec.ts    # Unit tests
│   ├── {module}.controller.spec.ts # Controller tests
│   ├── dto/                        # Data transfer objects
│   │   ├── create-{entity}.dto.ts
│   │   ├── update-{entity}.dto.ts
│   │   └── {entity}-response.dto.ts
│   └── interfaces/                 # TypeScript interfaces
```

### Frontend Page Structure

```
pages/
├── LoginPage.tsx           # Authentication form
├── DashboardPage.tsx       # Main dashboard with analytics
├── InvestmentsPage.tsx     # Investment management
└── TransactionsPage.tsx    # Transaction history
```

### Service Layer

```
api/services/
├── auth.service.ts         # Authentication API
├── portfolio.service.ts    # Portfolio operations
├── investment.service.ts   # Investment operations
├── transaction.service.ts  # Transaction operations
└── analytics.service.ts    # Portfolio analytics
```

---

## API Documentation

### Authentication Endpoints

**POST /auth/register**
Register a new user
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**POST /auth/login**
Authenticate user and get JWT tokens
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**POST /auth/refresh**
Refresh access token using refresh token
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Portfolio Endpoints

All portfolio endpoints require JWT authentication (`Authorization: Bearer {token}`)

**GET /portfolios**
List all user portfolios with summary data

**POST /portfolios**
Create new portfolio
```json
{
  "name": "My Investment Portfolio",
  "description": "Long-term investments"
}
```

**GET /portfolios/:id**
Get portfolio details including investments and analytics

**PATCH /portfolios/:id**
Update portfolio information
```json
{
  "name": "Updated Portfolio Name"
}
```

**DELETE /portfolios/:id**
Delete portfolio and all associated investments

### Investment Endpoints

**GET /investments**
List all investments across all portfolios

**POST /investments**
Add investment to portfolio
```json
{
  "portfolioId": "uuid",
  "symbol": "AAPL",
  "quantity": 10,
  "purchasePrice": 150.00,
  "purchaseDate": "2024-01-15"
}
```

**GET /investments/:id**
Get investment details with transaction history

**PATCH /investments/:id**
Update investment
```json
{
  "quantity": 15,
  "currentPrice": 155.00
}
```

**DELETE /investments/:id**
Remove investment from portfolio

### Transaction Endpoints

**POST /investments/:id/transactions**
Record transaction (buy/sell/dividend)
```json
{
  "type": "BUY",
  "quantity": 5,
  "price": 150.00,
  "date": "2024-01-20"
}
```

**GET /portfolios/:id/transactions**
Get transaction history for portfolio

**DELETE /transactions/:id**
Delete transaction record

### Analytics Endpoints

**GET /portfolios/:id/analytics**
Get comprehensive portfolio analytics
```json
{
  "summary": {
    "totalValue": 15000.00,
    "totalGain": 2500.00,
    "totalGainPercentage": 20.0,
    "totalInvested": 12500.00
  },
  "allocation": {
    "bySymbol": [...],
    "byType": [...]
  },
  "performance": {...}
}
```

### Swagger Documentation

API documentation is available at: `http://localhost:3000/api/docs`

All endpoints include:
- Request/response examples
- Parameter descriptions
- Error response codes
- Authentication requirements

---

## Setup & Installation

### Prerequisites

- **Node.js** ≥ 22.19
- **pnpm** ≥ 10.14 (package manager)
- **Docker** (for containerized deployment)
- **Docker Compose** (for full stack deployment)
- **PostgreSQL** 14+ (or use Docker image)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/MAsadIlyasNajum/manulife-portfolio-dashboard.git
cd manulife-portfolio-dashboard
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Setup Environment Variables

```bash
# API environment
cp apps/api/.env.example apps/api/.env

# Web environment
cp apps/web/.env.example apps/web/.env
```

Edit `.env` files with your configuration (see [Environment Variables](#environment-variables) section).

#### 4. Start PostgreSQL

**Option A: Using Docker**
```bash
docker-compose up postgres
```

**Option B: Local PostgreSQL installation**
```bash
# Make sure PostgreSQL is running and accessible
```

#### 5. Setup Database

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database with sample data
npx prisma db seed --schema apps/api/prisma/schema.prisma
```

#### 6. Start Development Servers

**Terminal 1: Backend API**
```bash
pnpm dev:api
```

**Terminal 2: Frontend Web**
```bash
pnpm dev:web
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs

### Default Test Credentials

After seeding, use these credentials to login:

```
Email: user@example.com
Password: password123
```

---

## Docker Deployment

### Quick Start

Run the entire stack with a single command:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- NestJS API (port 3000)
- React Web (port 4200)

### Access Points

- **Frontend:** http://localhost:4200
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api/docs
- **Database:** postgresql://postgres:postgres@localhost:5432/portfolio_db

### Docker Compose Services

**postgres**
- Image: `postgres:16-alpine`
- Port: 5432
- Volume: `postgres_data` (persistent)

**api**
- Image: `manulife-portfolio-api:latest`
- Port: 3000
- Dependencies: postgres (health check)

**web**
- Image: `manulife-portfolio-web:latest`
- Port: 4200
- Dependencies: api (health check)

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api

# Rebuild images
docker-compose build --no-cache

# Remove volumes (database data)
docker-compose down -v
```

### Health Checks

Each service includes health checks:
- PostgreSQL: `pg_isready` command
- API: HTTP GET /api/docs endpoint
- Web: HTTP GET / endpoint

Services wait for dependencies to become healthy before starting.

---

## Environment Variables

### Backend (apps/api/.env)

```env
# API Configuration
NODE_ENV=development
API_PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db

# JWT Secrets (use strong, random strings in production)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# JWT Token Expiration
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Swagger Documentation
SWAGGER_USER=admin
SWAGGER_PASSWORD=admin
```

### Frontend (apps/web/.env)

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

# App Configuration
VITE_APP_TITLE=Portfolio Management Dashboard
```

### Docker Compose (Root .env)

```env
# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=portfolio_db

# API JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# API Port
API_PORT=3000

# Web API Base URL (for Docker)
VITE_API_BASE_URL=/api
```

---

## Development

### Available Scripts

```bash
# Monorepo Commands
pnpm nx              # Run NX CLI

# Linting & Formatting
pnpm lint            # Lint all projects
pnpm format          # Format all code

# Testing
pnpm test            # Run tests for all projects
pnpm test:ci         # Run tests with coverage

# Building
pnpm build           # Build for production

# Development Servers
pnpm dev             # Start both API and Web
pnpm dev:api         # Start API only
pnpm dev:web         # Start Web only

# Database Commands
pnpm db:migrate      # Run Prisma migrations
pnpm db:generate     # Generate Prisma client
pnpm db:studio       # Open Prisma Studio (visual DB browser)

# Docker
pnpm docker:up       # Start Docker Compose
pnpm docker:down     # Stop Docker Compose
pnpm docker:logs     # View Docker logs
```

### API Development

#### Adding a New Endpoint

1. Create service method in `apps/api/src/modules/{module}/{module}.service.ts`
2. Add controller method in `apps/api/src/modules/{module}/{module}.controller.ts`
3. Create DTOs in `apps/api/src/modules/{module}/dto/`
4. Add unit tests in `apps/api/src/modules/{module}/{module}.service.spec.ts`
5. Document in Swagger using `@ApiOperation` and `@ApiResponse` decorators

#### Authentication

Use `@UseGuards(JwtAuthGuard)` to protect routes:

```typescript
@Get('/protected')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
getProtected(@CurrentUser() user: CurrentUserDto) {
  return user;
}
```

### Frontend Development

#### Adding a New Page

1. Create page component in `apps/web/src/pages/{PageName}.tsx`
2. Add route in `apps/web/src/routes/AppRoutes.tsx`
3. Create API service in `apps/web/src/api/services/`
4. Add custom hook for data fetching in `apps/web/src/hooks/`
5. Create dashboard components as needed

#### Protected Routes

Use `ProtectedRoute` for authenticated pages:

```typescript
<Routes>
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Route>
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<LoginPage />} />
  </Route>
</Routes>
```

---

## Testing

### Backend Tests

```bash
# Run all tests
pnpm test

# Run tests for specific project
pnpm nx test api

# Run tests with coverage
pnpm test:ci

# Watch mode
pnpm nx test api --watch
```

Test files are located alongside source code: `*.spec.ts`

**Modules with tests:**
- `apps/api/src/modules/auth/`
- `apps/api/src/modules/portfolios/`
- `apps/api/src/modules/investments/`
- `apps/api/src/modules/transactions/`
- `apps/api/src/modules/guards/`

### Frontend Tests

```bash
# Run tests
pnpm nx test web

# Watch mode
pnpm nx test web --watch
```

---

## Database

### Schema

The Prisma schema includes the following models:

**User**
- id (UUID, primary key)
- email (unique, indexed)
- password (hashed with bcrypt)
- portfolios (relationship)
- createdAt, updatedAt

**Portfolio**
- id (UUID, primary key)
- userId (foreign key)
- name
- description
- investments (relationship)
- transactions (relationship)
- createdAt, updatedAt

**Investment**
- id (UUID, primary key)
- portfolioId (foreign key)
- symbol
- quantity
- purchasePrice
- currentPrice
- purchaseDate
- transactions (relationship)
- createdAt, updatedAt

**Transaction**
- id (UUID, primary key)
- investmentId (foreign key)
- portfolioId (foreign key)
- type (BUY, SELL, DIVIDEND)
- quantity
- price
- date
- createdAt, updatedAt

### Migrations

Run migrations after pulling schema changes:

```bash
pnpm db:migrate
```

### Prisma Studio

Visualize and edit database records:

```bash
pnpm db:studio
```

Opens at: http://localhost:5555

---

## Screenshots

(Add screenshots here after submission)

- **Login Page** — User authentication form
- **Dashboard** — Portfolio overview with analytics
- **Portfolio View** — Detailed portfolio with investments
- **Investment Management** — Add/edit investments
- **Transactions** — Transaction history table
- **Analytics** — Charts and performance metrics
- **Swagger UI** — API documentation

---

## Contributing

### Code Style

- **Language:** TypeScript with strict mode enabled
- **Linting:** ESLint with strict rules
- **Formatting:** Prettier (2-space indentation)
- **Naming:** PascalCase for classes, camelCase for functions/variables

### Commit Message Convention

```
type(scope): subject

feat(auth): add jwt refresh token strategy
fix(dashboard): resolve chart rendering issue
docs(readme): update setup instructions
chore(deps): upgrade nestjs to v11
```

### Pull Request Process

1. Create feature branch: `feat/{feature-name}`
2. Make changes with descriptive commits
3. Ensure tests pass: `pnpm test`
4. Ensure linting passes: `pnpm lint`
5. Submit PR with description
6. Merge after approval

---

## Troubleshooting

### Database Connection Issues

**Error:** `ECONNREFUSED` when connecting to PostgreSQL

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Verify connection string in .env
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find process on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port by updating .env
```

### Docker Build Issues

**Error:** Docker build fails

**Solution:**
```bash
# Clean up and rebuild
docker-compose build --no-cache

# Or remove all containers and volumes
docker-compose down -v
docker-compose up
```

### Migration Issues

**Error:** Prisma migration fails

**Solution:**
```bash
# Reset database (development only)
npx prisma migrate reset

# Or manually create migration
pnpm db:migrate
```

---

## Performance Optimization

- Frontend bundle is optimized with Vite (tree-shaking, code splitting)
- Backend uses Prisma caching and indexed database queries
- Docker images use multi-stage builds for minimal size
- React Query handles automatic data synchronization
- Material-UI components are tree-shakeable

---

## Security Considerations

- ✅ Passwords hashed with bcrypt (10+ salt rounds)
- ✅ JWT tokens with 15-minute expiration for access tokens
- ✅ Environment variables for secrets (never commit .env)
- ✅ CORS configured for frontend origin
- ✅ Input validation using class-validator on DTOs
- ✅ SQL injection prevention through Prisma ORM
- ✅ XSS protection through React's automatic escaping
- ⚠️ HTTPS recommended for production deployments

---

## Future Improvements

Based on the current architecture, potential enhancements could include:

- Real-time stock price integration (external API)
- WebSocket support for live updates
- Advanced portfolio optimization algorithms
- Tax loss harvesting recommendations
- Multi-currency support for global portfolios
- Export to PDF and advanced reporting
- Mobile app (iOS/Android) using React Native
- Machine learning-based investment recommendations
- Two-factor authentication
- Audit logging for compliance

---

## Assignment Notes

**Project Context:**
- This project was completed as a technical assignment demonstrating full-stack development capabilities
- The application represents a production-ready implementation of a portfolio management system
- Architecture follows industry best practices including clean code, separation of concerns, and comprehensive testing

**Development Approach:**
- Backend designed with modular NestJS architecture for scalability
- Frontend built with React and modern tooling (Vite, React Router, React Query)
- Database schema normalized and optimized for relational data
- Docker configuration enables reproducible deployments across environments
- TypeScript used throughout for type safety and developer experience

**AI Assistance:**
- AI tools (GitHub Copilot, Claude) were used for code generation, optimization, and documentation assistance
- All implementation decisions, architecture choices, and final code validation were performed by the developer
- The codebase reflects a complete understanding of the problem domain and technical requirements

---

## License

MIT

---

## Contact

For questions, issues, or feedback regarding this project, please open an issue on GitHub.

**Repository:** [MAsadIlyasNajum/manulife-portfolio-dashboard](https://github.com/MAsadIlyasNajum/manulife-portfolio-dashboard)

---

**Last Updated:** June 23, 2026  
**Version:** 1.0.0 ✅ Production Ready

