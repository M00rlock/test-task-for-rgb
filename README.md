# RGB Test Project

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-style components

Backend:
- NestJS
- Prisma
- PostgreSQL

## Run locally

Frontend:
```bash
npm install
npm run dev
```

Backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

PostgreSQL:
```bash
docker compose up -d postgres
```

If Docker is not installed, the dev setup will fall back to Homebrew PostgreSQL on macOS.

## Full Stack Dev

Run everything together:
```bash
npm run dev:all
```

Stop the full stack:
```bash
npm run dev:stop
```

Useful commands:
```bash
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev:web
npm run dev:backend
```
