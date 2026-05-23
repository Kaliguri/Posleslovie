# Posleslovie Backend (NestJS)

## Stack

- NestJS + TypeScript
- Prisma + PostgreSQL
- Redis (for future queue/cache/rate-limit storage)
- S3-compatible media layer (MinIO locally)

## Run locally without Docker

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend will run on `http://localhost:4000/api`.

## Key endpoints

- `GET /api/health`
- `GET /api/public/content/home-hero`
- `PUT /api/admin/content/home-hero` (`x-api-key` required)
- `POST /api/public/orders`
- `POST /api/admin/payments` (`x-api-key` required)
- `POST /api/public/payments/webhook`

## Admin API key roles

- `API_KEY_ADMIN` - full admin flows.
- `API_KEY_MANAGER` - manager flows.
