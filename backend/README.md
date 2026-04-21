# Backend

NestJS + Prisma + PostgreSQL starter for RGB Test Project.

## Local setup

1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
5. Start the API:
   ```bash
   npm run dev
   ```

