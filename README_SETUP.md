# MCN Frontend Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Stripe account (for payments)
- MCN backend server running

## Setup Steps

### 1. Install Dependencies

```bash
cd MCN_FRONTEND
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MCN_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. This will create:
   - `users` table
   - `indexes` table
   - `usage_logs` table
   - Row Level Security policies
   - Triggers for automatic user creation

### 4. Set Up Stripe

1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe dashboard
3. Add it to `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
4. Set up webhook endpoint for payment events (backend required)

### 5. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Backend Connection

The frontend connects to the MCN backend API. Make sure:

1. The MCN backend server is running (see `NEW_MCN_ONLY/server.py`)
2. The backend is accessible at the URL specified in `VITE_MCN_API_URL`
3. The backend accepts requests with `api_key` in the request body

## Security Notes

- API keys are stored in Supabase and associated with user accounts
- Row Level Security (RLS) policies ensure users can only access their own data
- Admin users can view all data (set `is_admin = true` in database)
- All API calls to MCN backend require a valid `api_key`

## Default Admin Account

To create an admin account:

1. Sign up with email: `admin@mcn.local`
2. In Supabase SQL Editor, run:
   ```sql
   UPDATE public.users 
   SET is_admin = true 
   WHERE email = 'admin@mcn.local';
   ```

## Troubleshooting

- **Supabase connection issues**: Check your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Backend connection issues**: Ensure MCN backend is running and `VITE_MCN_API_URL` is correct
- **Authentication issues**: Check Supabase Auth settings and ensure email confirmation is configured correctly

