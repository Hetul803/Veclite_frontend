# Memryx Frontend

Production-ready React frontend for Memryx - a compressed vector database with exact recall.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your Supabase and API URLs

# Start development server
npm run dev
```

## Environment Variables

Required environment variables (see `env.example`):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_MCN_API_URL` - Memryx backend API URL (default: https://api.memryx.com)
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (optional)

## Deployment

### Vercel

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Build

```bash
npm run build
```

Output will be in `dist/` directory.

## Documentation

- `INTEGRATION_GUIDE.md` - Frontend-backend integration details
- `LAUNCH_CHECKLIST.md` - Pre-launch checklist
- `PRODUCTION_READY_SUMMARY.md` - Production readiness summary

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Supabase (Auth + Database)
- Stripe (Payments)

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── lib/            # Utilities, API clients, config
└── ui/             # UI primitives
```
