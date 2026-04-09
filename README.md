# Deal Desk AI Frontend

React + Vite frontend for the Deal Desk AI proposal generation system. Part of the AI SaaS Empire.

## Features

- **Proposal Generator** — Enter a client brief and get a full AI-generated sales proposal with suggested pricing and risk flags
- **Pricing Plans** — Starter / Pro / Agency plans with Stripe checkout integration
- **Dark Mode UI** — Polished dark theme with indigo accent

## Tech Stack

- React 18 + Vite
- No external UI framework — custom CSS
- Calls [deal-desk-ai-backend](https://github.com/Garrettc123/deal-desk-ai-backend) (FastAPI)

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL
npm run dev
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |

## Deploy to Vercel

```bash
npx vercel --prod
```

Set `VITE_API_URL` in Vercel project environment variables.

## Backend API

This frontend connects to the `deal-desk-ai-backend`. The backend requires:

- `ANTHROPIC_API_KEY` — for Claude proposal generation
- `STRIPE_SECRET_KEY` — for checkout sessions
- `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCY` — Stripe price IDs
