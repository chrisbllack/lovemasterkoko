# INFINEON Enterprise Hospitality Booking Engine

Luxury marketing site, real-time booking engine, staff admin dashboard, guest portal, CMS and
notification services for Banky Hotel & Suites, Ado-Ekiti.

**Stack:** TanStack Start (React 19 + Vite) · Tailwind CSS · shadcn/ui · Firebase Firestore · Paystack.

---

## 1. Prerequisites

| Tool    | Version | Notes                             |
| ------- | ------- | --------------------------------- |
| Node.js | ≥ 20    | Primary runtime environment       |
| npm/bun | any     | Package manager                   |

## 2. Running Locally

```sh
npm install
cp .env.example .env          # fill in your configuration values
npm run dev                   # http://localhost:3000
```

Useful scripts:

```sh
npm run build         # production build
npm run preview       # serve the production build
npm run lint          # ESLint
npm run typecheck     # TypeScript
```

## 3. Architecture

- `src/lib/*.functions.ts` — Server functions RPC used by the UI (`site`, `admin`, `guest`, `cms`, `settings`).
- `src/lib/firebase.ts` — Firebase Firestore client configuration.
- `src/lib/payment-gateway.server.ts` — Paystack payment processing & verification.
- `src/lib/notify.server.ts` — Transactional email notifications.

## 4. Project Layout

```
src/
  routes/                 file-based routes (public pages, /auth, /admin, /my-stay, api/)
  routes/_authenticated/  auth-gated subtree (admin + guest portal)
  components/site/        header, footer, booking bar, settings provider
  components/admin/       admin panels, calendars, rates, folios
  lib/                    server functions, concurrency engine, branding, types
```

