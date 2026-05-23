# Backend Transition Playbook

## Hosting Decision

- `Frontend`: Vercel (Next.js-first deploy, preview environments, fast rollback).
- `Backend API`: Render Web Service (Node runtime, simple autoscaling, environment secrets).
- `Database`: Managed PostgreSQL (Render/Neon/Supabase).
- `Media`: S3-compatible object storage (Cloudflare R2 or AWS S3).
- `Cache/Rate-limit store`: Redis (Upstash/Render Redis).

This setup keeps rollout simple: frontend and backend deploy independently, while local development still runs everything with `docker compose`.

## Local Testing

- Start services: `docker compose up --build`
- Frontend: `http://localhost:3000`
- Backend healthcheck: `http://localhost:4000/api/health`
- Backend content endpoint: `http://localhost:4000/api/public/content/home-hero`

## CMS MVP Scope

Initial editable entities for content manager:

1. `HomeHero`  
   - `heading`, `leadLine1`, `leadLine2`, `ctaLabel`
   - typography settings:
     - `headingFontFamily`, `headingFontWeight`
     - `leadFontFamily`, `leadFontWeight`
2. `FeatureCards`
   - title, description, icon URL
3. `ProcessSections`
   - eyebrow, title, description, button label
4. `LegalDocuments`
   - title, description, PDF link

For this iteration we implement full API + admin update flow for `HomeHero`.

## Backend Modules (MVP)

- `auth` - API key based role access for admin endpoints.
- `content` - public content read + admin upsert.
- `media` - upload descriptor for S3-compatible uploads.
- `orders` - order create/list and status transitions.
- `payments` - provider abstraction, payment records, webhook processing.
- `health` - readiness probe endpoint.

## Security and Reliability Baseline

- Global rate limiting via Nest throttler.
- Request logging middleware + request-id interceptor.
- Audit log entries for admin content changes and order list access.
- Payment webhook idempotency key persistence.
