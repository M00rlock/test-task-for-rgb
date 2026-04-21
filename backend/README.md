# Backend

NestJS + Prisma + PostgreSQL starter for RGB Test Project.

## Local setup

1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
   If Docker is unavailable on macOS, the root `npm run dev:all` flow will fall back to Homebrew PostgreSQL automatically.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate:deploy
   ```
5. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
6. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
7. Start the API:
   ```bash
   npm run dev
   ```

8. Open Swagger UI:
   ```bash
   http://127.0.0.1:3001/docs
   ```
   Swagger now documents the response models used by the CRM UI, including paginated clients and deals with nested client data.

## API

Clients:
- `POST /clients`
- `GET /clients?page=1&limit=10`
- `GET /clients/:id`
- `PATCH /clients/:id`
- `DELETE /clients/:id`
  - `GET /clients` returns `{ data, meta }`
  - `GET /clients/:id` returns the client with its deals

Deals:
- `POST /deals`
- `GET /deals?status=NEW&clientId=<uuid>`
- `PATCH /deals/:id`
- `DELETE /deals/:id`
  - `GET /deals` returns deals with nested client data
