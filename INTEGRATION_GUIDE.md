# MCN Frontend-Backend Integration Guide

## Architecture Overview

The MCN system consists of three main components:

1. **Frontend (React + TypeScript)**: User interface and portal
2. **Supabase**: Database and authentication
3. **MCN Backend (FastAPI)**: Vector operations and search

## Data Flow

### Authentication Flow
1. User signs up/logs in via Supabase Auth (email/password only)
2. Supabase trigger creates user record in `users` table with auto-generated API key
3. Frontend stores user session and API key
4. All MCN backend requests include `api_key` for authentication

### Vector Operations Flow
1. User creates an index in frontend → Saved to Supabase `indexes` table
2. User uploads vectors → Frontend calls MCN backend `/add` endpoint with `api_key`
3. MCN backend validates API key and stores vectors
4. Usage logged to Supabase `usage_logs` table
5. User finalizes index → Frontend calls MCN backend `/finalize` endpoint
6. Index status updated in Supabase

### Search Flow
1. User performs search → Frontend calls MCN backend `/search` endpoint with `api_key`
2. MCN backend returns results filtered by user_id (security)
3. Usage logged to Supabase with latency metrics

## Security Measures

### 1. Row Level Security (RLS)
- Users can only access their own data
- Admins can view all data
- Policies enforced at database level

### 2. API Key Authentication
- Each user has a unique API key stored in Supabase
- MCN backend validates API key on every request
- API key is never exposed in frontend code (stored server-side)

### 3. User Isolation
- MCN backend filters results by `user_id` from metadata
- Vectors are tagged with `user_id` during ingestion
- No cross-user data leakage possible

### 4. Rate Limiting
- Enforced at MCN backend level
- Per-tenant limits based on plan
- Prevents abuse and ensures fair usage

## Environment Variables Required

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# MCN Backend
VITE_MCN_API_URL=http://localhost:8000

# Stripe (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Database Schema

See `supabase/migrations/001_initial_schema.sql` for complete schema.

Key tables:
- `users`: User accounts, plans, API keys
- `indexes`: Vector indexes per user
- `usage_logs`: Query/ingest/finalize actions with metadata

## API Endpoints

### MCN Backend (FastAPI)
- `POST /add`: Add vectors (requires `api_key`)
- `POST /search`: Search vectors (requires `api_key`)
- `POST /finalize`: Finalize index (requires `api_key`)
- `GET /health`: Health check

### Frontend API Layer
- `login(email, password)`: Authenticate via Supabase
- `listIndexes(userId)`: Get user's indexes from Supabase
- `createIndex(userId, ...)`: Create index in Supabase
- `addVectors(apiKey, vectors)`: Add vectors via MCN backend
- `searchVectors(apiKey, vector, k)`: Search via MCN backend
- `finalizeIndex(apiKey, indexId)`: Finalize via MCN backend + update Supabase

## Payment Integration (Stripe)

Stripe integration is set up for:
- Creating checkout sessions for plan upgrades
- Managing customer portal for billing
- Webhook handling (requires backend endpoint)

## Testing the Integration

1. **Without Supabase** (Development):
   - Frontend falls back to mock data
   - MCN backend can be tested directly with API keys

2. **With Supabase** (Production):
   - Run migration SQL in Supabase
   - Configure environment variables
   - Test authentication flow
   - Test vector operations

## Next Steps

1. Set up Supabase project and run migrations
2. Configure environment variables
3. Set up Stripe account and webhook endpoint
4. Test end-to-end flow
5. Deploy frontend and backend

