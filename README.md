# Concert Ticket Reservation

A full-stack concert ticket reservation system built with:

- Frontend: Next.js (App Router)
- Backend: NestJS + Prisma
- Database: PostgreSQL

This project supports running the complete stack with Docker Compose (frontend + backend + db), and it can also be run locally without Docker.

## Project Structure

```text
.
|-- backend/
|   |-- src/
|   |   |-- auth/              # Authentication module
|   |   |-- concert/           # Concert management module
|   |   |-- reservation/       # Reservation module
|   |   |-- prisma/            # Prisma service/module for NestJS
|   |   |-- app.module.ts
|   |   |-- main.ts
|   |-- prisma/
|   |   |-- schema.prisma      # Prisma schema
|   |   |-- seed.ts            # Seed script
|   |   |-- migrations/        # Database migrations
|   |-- test/                  # E2E tests
|   |-- Dockerfile
|   |-- package.json
|-- frontend/
|   |-- app/                   # Next.js App Router pages/layouts
|   |   |-- (auth)/
|   |   |-- (landing)/
|   |   |-- (main)/
|   |-- components/
|   |   |-- common/
|   |   |-- ui/
|   |-- lib/                   # API client and utilities
|   |-- hooks/
|   |-- public/
|   |-- __tests__/             # Frontend unit tests
|   |-- Dockerfile
|   |-- package.json
|-- docker-compose.yml
|-- README.md
```

## Tech Stack

- Node.js 20+
- Next.js 16
- NestJS 11
- Prisma 7
- PostgreSQL (via Docker)

## Application Architecture Overview

The system is split into two main applications plus one database:

- Frontend (Next.js App Router)
    - Route groups organize UI flows: `(landing)`, `(auth)`, `(main)`.
    - UI components are under `components/` and utility logic/API client is under `lib/`.
    - Uses cookie-based authentication flow and calls backend APIs through a centralized Axios client.

- Backend (NestJS)
    - Organized by feature modules:
        - `auth`: login/session identity checks
        - `concert`: concert listing and details
        - `reservation`: reserve/cancel and reservation history/events
    - `prisma` module encapsulates database access.
    - API runs under `/api`.

- Database (PostgreSQL + Prisma)
    - Core entities: `User`, `Concert`, `Reservation`, `ReservationEvent`.
    - Prisma schema and migrations live in `backend/prisma/`.

Typical request flow:

1. User interacts with frontend pages/components.
2. Frontend calls backend endpoints (for example `/auth`, `/concert`, `/reservation`).
3. NestJS services execute business logic and use Prisma to read/write PostgreSQL.
4. Backend responds with JSON used by the frontend to render updated state.

## Key Libraries and Their Roles

### Frontend

- `next`, `react`, `react-dom`: App Router UI framework and rendering.
- `axios`: HTTP client for calling backend API.
- `tailwindcss`: utility-first styling.
- `shadcn`, `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`: reusable UI primitives and class composition.
- `lucide-react`: icon library.
- `sonner`: toast notifications.
- `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `jest-environment-jsdom`: unit/UI test stack.

### Backend

- `@nestjs/*`: server framework, routing, DI, and module system.
- `@prisma/client`, `prisma`, `@prisma/adapter-pg`: ORM, migrations, and PostgreSQL adapter.
- `pg`: PostgreSQL driver.
- `class-validator`, `class-transformer`: DTO validation and payload transformation.
- `jsonwebtoken`: token creation/verification for auth.
- `cookie-parser`: cookie parsing middleware.
- `dotenv`, `@nestjs/config`: environment configuration loading.
- `jest`, `ts-jest`, `supertest`: unit and e2e testing stack.

## Ports

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001/api`
- PostgreSQL: `localhost:5433`

## Getting Started with Docker (Recommended)

### 1) Prepare `.env` file (optional)

You can run the project without a root `.env` file because `docker-compose.yml` already includes default values.

If you want to customize values, create `.env` at repository root:

```env
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password
POSTGRES_DB=concert_db

JWT_SECRET=your_jwt_secret

NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### 2) Build and start all services

```bash
docker compose up --build -d
```

### 3) Check service status

```bash
docker compose ps
```

### 4) View logs

```bash
docker compose logs -f
```

### 5) Stop all services

```bash
docker compose down
```

To remove database volume data as well:

```bash
docker compose down -v
```

## Defined Docker Services

- `db`
    - Uses image `postgres:latest`
    - Port mapping `5433:5432`
    - Persistent storage in volume `postgres_data`

- `backend`
    - Built from `backend/Dockerfile`
    - Runs Prisma migrations automatically before starting the app
    - Port mapping `3001:3001`

- `frontend`
    - Built from `frontend/Dockerfile`
    - Port mapping `3000:3000`

## Database Setup and Seeding

Use this section when you need to initialize database schema or insert sample data.

### Local (run from `backend`)

Apply existing migrations:

```bash
cd backend
npx prisma migrate deploy
```

Insert seed data:

```bash
npx prisma db seed
```

Reset database and re-seed (development only):

```bash
npx prisma migrate reset --force
```

### Docker (run Prisma inside backend container)

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx prisma db seed
```

## Run Locally (Without Docker)

### 0) Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL (if not using Docker for DB)

### 1) Create local environment files

Create `backend/.env`:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5433/concert_db?schema=public
PORT=3001
JWT_SECRET=your_jwt_secret
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Notes:

- If your PostgreSQL runs on a different host/port/user/password, update `DATABASE_URL`.
- Port `5433` is used in Docker Compose mapping; if your local PostgreSQL is on `5432`, update `DATABASE_URL` accordingly.

### 2) Start PostgreSQL

Option A: start only DB with Docker

```bash
docker compose up -d db
```

Option B: use your own local PostgreSQL instance.

### 3) Install dependencies

```bash
cd backend
npm install

cd frontend
npm install
```

### 4) Run Prisma migrations and seed data

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 5) Start backend and frontend

### Backend

```bash
cd backend
npm run start:dev
```

### Frontend

```bash
cd frontend
npm run dev
```

## Run Unit Tests

### Backend unit tests

```bash
cd backend
npm run test
```

### Frontend unit tests

```bash
cd frontend
npm run test
```

### Optional coverage reports

```bash
cd backend
npm run test:cov

cd frontend
npm run test:coverage
```

## Common Commands

Rebuild only selected services:

```bash
docker compose build backend frontend
```

Restart backend only:

```bash
docker compose restart backend
```

Open a shell in backend container:

```bash
docker compose exec backend sh
```

Open psql in db container:

```bash
docker compose exec db psql -U admin -d concert_db
```

## Basic Verification Checklist

1. Open `http://localhost:3000` and confirm the web app loads.
2. Access `http://localhost:3001/api` (or any available endpoint) successfully.
3. Confirm all services are `Up` via `docker compose ps`.
