# Portfolio Management Dashboard – Nx Monorepo

Enterprise-grade Nx monorepo scaffold for a portfolio management dashboard application. This scaffold includes project structure, configuration, and placeholder code suitable for a Senior Engineer portfolio assignment.

## Project Overview

A full-stack portfolio management dashboard with backend API (NestJS), frontend application (React/Vite), PostgreSQL database, and supporting infrastructure. The scaffold establishes architecture and developer experience without business logic implementation.

## Architecture Overview

### Monorepo Structure

```
├── apps/
│   ├── api/              # NestJS backend API
│   │   ├── src/
│   │   │   ├── main.ts   # Application bootstrap with Swagger and validation
│   │   │   ├── app.module.ts
│   │   │   ├── modules/  # Feature modules (auth, users, portfolios, investments, transactions)
│   │   │   ├── common/   # Shared cross-cutting utilities
│   │   │   ├── decorators/
│   │   │   ├── guards/
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── config/
│   │   ├── prisma/       # Prisma schema and migrations
│   │   └── .env.example
│   └── web/              # React + Vite frontend application
│       ├── src/
│       │   ├── app/      # App router and root component
│       │   ├── pages/    # Page-level components (Login, Dashboard, Investments, Transactions)
│       │   ├── components/ # Reusable UI components
│       │   ├── features/  # Feature-sliced architecture (future)
│       │   ├── hooks/    # Custom React hooks
│       │   ├── services/ # API client (axios) and service layer
│       │   ├── providers/ # React context providers (React Query, MUI Theme)
│       │   ├── theme/    # MUI theme customization (#00693C primary)
│       │   └── types/    # TypeScript type definitions
│       └── .env.example
├── libs/                 # Shared libraries
│   ├── shared-types/     # Enums (AssetType, TransactionType, UserRole) and DTOs
│   ├── shared-constants/ # Application constants
│   └── shared-utils/     # Shared utility functions
├── .github/
│   └── workflows/
│       └── ci.yml       # GitHub Actions CI pipeline
├── docker-compose.yml   # Local development stack (PostgreSQL, API, Web)
└── [config files]       # ESLint, Prettier, Nx, TypeScript
```

### Technology Stack

**Backend:**
- NestJS 11 with TypeScript
- Passport + JWT for authentication (placeholder)
- Prisma ORM + PostgreSQL
- Swagger for OpenAPI documentation
- class-validator for DTO validation
- bcrypt for password hashing

**Frontend:**
- React 19 + TypeScript
- Vite as build tool
- React Router v7 for routing
- Material-UI (MUI) with custom theme (#00693C primary)
- React Query (@tanstack/react-query) for server state
- Axios for HTTP client
- React Hook Form + Zod for form handling
- Recharts for data visualization

**Infrastructure:**
- PostgreSQL database
- Docker & Docker Compose for local development
- GitHub Actions for CI/CD
- pnpm workspace package manager

**Quality & Tooling:**
- Nx for monorepo orchestration
- ESLint + Prettier for code quality
- Jest for backend unit tests
- Vitest + React Testing Library for frontend tests

## Setup Instructions

### Prerequisites

- **Node.js** ≥ 24.x
- **pnpm** ≥ 10.x (package manager)
- **Docker** & **Docker Compose** (for containerized development)

### Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Start local development stack:**
   ```bash
   pnpm docker:up
   ```

4. **Access the application:**
   - **Frontend:** http://localhost:4200
   - **API Swagger:** http://localhost:3000/docs

## Development Commands

### Nx Monorepo Commands

```bash
pnpm lint              # Lint all projects
pnpm format            # Format code with Prettier
pnpm test              # Run tests
pnpm build             # Build all projects
pnpm dev:api           # Serve API
pnpm dev:web           # Serve Web app
pnpm docker:up         # Start Docker Compose stack
pnpm docker:down       # Stop Docker Compose stack
```

## Docker Instructions

```bash
# Start the full local stack
pnpm docker:up

# View logs
pnpm docker:logs

# Stop services
pnpm docker:down
```

### Docker DNS Stability (Build + Runtime)

To reduce intermittent DNS and timeout failures when resolving `auth.docker.io` and `registry.npmjs.org`, set Docker Engine DNS resolvers:

```json
{ "dns": ["1.1.1.1", "8.8.8.8"] }
```

On macOS Docker Desktop, add this JSON in Docker Engine settings and apply/restart Docker.

## Database Schema

Prisma models (apps/api/prisma/schema.prisma):
- **User:** email, passwordHash, role (ADMIN, INVESTOR)
- **Portfolio:** name, userId reference
- **Investment:** name, assetType, quantity, prices (purchase, current)
- **Transaction:** action (BUY, SELL, DIVIDEND, FEE), quantity, price, transactionDate

## Deployment

Docker images are provided for both API and Web. Build and deploy as containers to any platform supporting Docker.

## Notes

This scaffold prioritizes **architecture over implementation**, establishing a stable foundation for feature development while maintaining clean structure and consistency across the monorepo.

---

**Created:** June 2026  
**Node.js:** 24.x  
**License:** MIT

