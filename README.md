# PubTrack Library Portal

Next.js 16 app for library receiving, inventory, sales, reports, and administration.

Shared UI primitives live in `components/ui` (kept identical to `publisher-dashboard`). Preview them at `/design-system`. See `../docs/phase-1-design-system.md` and `../docs/phase-12-library-portal.md`.

## Getting Started

```bash
npm run dev
```

The app listens on [http://localhost:3002](http://localhost:3002). NestJS must be running on `http://localhost:3000` (`API_URL` / `NEXT_PUBLIC_API_URL`).

Demo library login (seeded in `pubtrack-backend`):

- Email: `walt.e@example.net` (library admin)
- Email: `wendy.h@example.net` (library staff)
- Password: `ChangeMe123!`

## Routes

| Path | Notes |
|---|---|
| `/login` | Public |
| `/design-system` | Public primitive gallery |
| `/receiving` | Inbound shipments and receipts |
| `/receiving/[distributionId]` | Review → verify → confirm stepper |
| `/inventory` | Library stock, QR token lookup |
| `/sales` | Counter sales |
| `/returns` | V2 stub |
| `/reports` | On-hand, sales, and receiving snapshot |
| `/administration` | Library profile and staff |
