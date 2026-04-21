# RGB Test Project

A CRM MVP with a full-stack setup.

Frontend:
- Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-style components

Backend:
- NestJS, Prisma, PostgreSQL

## Requirements

- Node.js 20+
- Docker (recommended) or Homebrew on macOS

## Quickstart

The fastest way to run everything — one command starts the database, runs migrations, seeds data, and launches both frontend and backend:

```bash
npm install
cd backend && npm install && cd ..
npm run dev:all
```

- Frontend: http://localhost:3000
- Backend API: http://127.0.0.1:3001
- Swagger UI: http://127.0.0.1:3001/docs *(development only)*

## Manual Setup

### 1. PostgreSQL

With Docker:
```bash
docker compose up -d postgres
```

Without Docker (macOS only, requires Homebrew):
```bash
npm run db:up
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
cd ..
npm run db:migrate
npm run db:seed
npm run dev:backend
```

### 3. Frontend

In a separate terminal from the project root:
```bash
npm install
npm run dev:web
```

## Environment Variables

### Backend (`backend/.env`)

| Variable       | Default                                                                 | Description                        |
|----------------|-------------------------------------------------------------------------|------------------------------------|
| `PORT`         | `3001`                                                                  | Backend port                       |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/rgb_test_project?schema=public` | PostgreSQL connection string |
| `CORS_ORIGIN`  | `http://localhost:3000`                                                 | Allowed frontend origin            |

### Frontend (`.env.local`)

| Variable               | Default                  | Description       |
|------------------------|--------------------------|-------------------|
| `NEXT_PUBLIC_API_URL`  | `http://127.0.0.1:3001`  | Backend API URL   |

## Useful Commands

```bash
npm run dev:all        # Start everything (DB + frontend + backend)
npm run dev:stop       # Stop all dev processes
npm run dev:web        # Frontend only
npm run dev:backend    # Backend only
npm run db:up          # Start PostgreSQL
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed the database
npm run build          # Build frontend for production
npm run build:backend  # Build backend for production
npm run lint           # Lint frontend
npm run test:web       # Frontend unit tests
npm run test:backend   # Backend unit tests
npm run test:web:cov   # Frontend tests with coverage
npm run test:backend:cov # Backend tests with coverage
```

## Development vs Production

### Development

Hot-reload for both frontend and backend, Swagger UI enabled, no build step required:

```bash
npm run dev:all
```

### Production

**1. Set environment variables**

`backend/.env`:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/rgb_test_project?schema=public
CORS_ORIGIN=https://your-frontend-domain.com
```

`.env.local`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

**2. Build both apps**

```bash
npm run build
npm run build:backend
```

**3. Run migrations**

```bash
npm run db:migrate
```

**4. Start both apps**

In separate processes (or use a process manager like PM2):
```bash
npm run start          # Frontend on port 3000
npm run start:backend  # Backend on port 3001
```

**Key differences in production mode:**
- Swagger UI is disabled
- Next.js runs the optimised build instead of the dev server
- `CORS_ORIGIN` must be set to your actual frontend domain
- `NODE_ENV=production` must be set in `backend/.env`
