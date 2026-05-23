# Disaster Recovery Runbook

## Backup Policy

- Database: daily full dump via `scripts/backup-db.ps1`.
- Retention: 14 days for local/stage, 30 days for production backups.
- Store at least one encrypted off-site copy (cloud bucket).

## Restore Drill (monthly)

1. Start stack with `docker compose up -d postgres`.
2. Restore the latest backup:
   - `pwsh ./scripts/restore-db.ps1 -BackupFile .\backups\latest.sql`
3. Run backend and verify:
   - `GET /api/health`
   - `GET /api/public/content/home-hero`
4. Confirm order and payment tables are queryable.

## Incident Recovery Checklist

1. Switch API traffic to maintenance mode.
2. Restore latest healthy database snapshot.
3. Replay delayed payment webhooks if required.
4. Validate critical paths:
   - public content read
   - order create
   - payment status update
5. Return traffic and monitor logs for 30 minutes.
