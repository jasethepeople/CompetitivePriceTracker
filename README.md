# CompetitivePriceTracker

A full-stack business intelligence tool for tracking competitor pricing, products, and market trends, built as a Replit export.

## Features

- **Dashboard** — analytics overview with KPI cards and charts (Recharts).
- **Companies** — manage competitor companies (name, industry, website, description).
- **Products** — track competitor products with categories, features, and target markets.
- **Pricing analysis** — record pricing data per product (price, currency, pricing model: one-time, monthly, yearly, usage-based, tiered) with data visualization.
- **Market trends** — track and analyze market trend entries.
- **CRM integrations** — manage connections to external CRM systems.
- **Reports** — generate and manage analysis reports.
- **Theming** — dark/light mode toggle, responsive layout.

## Tech stack

- Frontend: React 19, TypeScript, Vite, Wouter (routing), TanStack Query, Tailwind CSS 4, shadcn/ui, React Hook Form + Zod validation.
- Backend: Node.js, Express 5, TypeScript (via tsx).
- Validation/shared schemas: Zod (`shared/schema.ts` covers companies, products, pricing data, market trends, CRM integrations, reports).
- Storage: in-memory (`MemStorage` in `server/storage.ts`); Drizzle ORM is a dependency but the shipped server uses in-memory storage.
- Ports: app serves on port 5000 (see `.replit`).

## Getting started

No npm scripts are defined in `package.json` besides a placeholder test script. The Replit workflow starts the server with:

```bash
npm install
npx tsx dev-server.ts
```

then open `http://localhost:5000`.

## Project structure

```
├── client/            # React frontend (pages: Dashboard, Companies, Products,
│                      # PricingAnalysis, MarketTrends, CrmIntegrations, Reports)
├── server/            # Express backend (routes.ts, index.ts, storage.ts)
├── shared/            # Zod schemas and TypeScript types shared by both
├── dev-server.ts      # entry point used by the Replit workflow
├── server.js / simple-server.js  # alternate server entry points
├── .replit            # Replit run configuration (tsx dev-server.ts, port 5000)
├── replit.md          # project guide (architecture notes, partially pending)
└── attached_assets/   # uploaded image and an unrelated zip archive
```

## Status

**Working prototype.** The app is implemented end to end (per `replit.md`: "Status: Implemented") with in-memory storage, so data does not persist across restarts. Exported from https://replit.com/@realjasontclark/CompetitivePriceTracker.
