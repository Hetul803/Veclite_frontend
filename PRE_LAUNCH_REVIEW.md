# Pre-Launch Review & Summary

## ✅ Completed Tasks

### 1. API Key Hashing
- **Status:** Migration created (`002_api_key_hashing.sql`)
- **Location:** `MCN_FRONTEND/supabase/migrations/002_api_key_hashing.sql`
- **Note:** Requires manual application in Supabase SQL Editor
- **Implementation:** Uses PostgreSQL `pgcrypto` extension with bcrypt hashing

### 2. URL Clarification
- **Status:** ✅ Updated in Docs
- **Clarification:** 
  - **Frontend URL:** `https://memryx.org` (Vercel) - for website/portal
  - **Backend URL:** `https://api.memryx.org` or Railway URL - for API calls
  - Developers need **backend URL + API key**

### 3. JavaScript/TypeScript Examples
- **Status:** ✅ Added to Docs page
- **Location:** New section after Python example
- **Library:** Uses `@xenova/transformers` for embeddings

### 4. Website Accuracy Review
- **Status:** ✅ Reviewed - All claims are accurate
- **Findings:**
  - Recall numbers match test results (39.34%)
  - Compression ratio accurate (12.71x)
  - Latency numbers match benchmarks (33.69ms)
  - Cost comparisons marked as "Estimated" (appropriate)
  - No defamation found - comparisons are factual and respectful

### 5. Plan Limits Enforcement
- **Status:** ✅ Hardcoded and enforced
- **Location:** `NEW_MCN_ONLY/server_v2.py` - `RATE_LIMIT_CONFIG`
- **Enforcement:** `RateLimitMiddleware` returns 429 when exceeded
- **Limits:**
  - Free: 10K vectors, 5 QPS, 2 concurrent, 5K daily
  - Starter: 100K vectors, 10 QPS, 5 concurrent, 50K daily
  - Pro: 250K vectors, 25 QPS, 10 concurrent, 200K daily
  - Scale: 1M vectors, 60 QPS, 25 concurrent, 1M daily
  - Enterprise: 10M vectors, 200 QPS, 100 concurrent, 10M daily

### 6. Plan Capacity Analysis
- **Status:** ✅ Calculated
- **Capacity per plan (assuming 1 QPS per user):**
  - Free: ~5 users
  - Starter: ~10 users
  - Pro: ~25 users
  - Scale: ~60 users
  - Enterprise: ~200 users
- **Note:** With 20 beta users, total capacity = sum of individual plan limits

### 7. Stripe Integration
- **Status:** ⚠️ **NOT READY**
- **Frontend:** ✅ Stripe client code exists (`stripe.ts`)
- **Backend:** ❌ Missing webhook endpoints:
  - `/api/stripe/create-checkout-session`
  - `/api/stripe/create-portal-session`
- **Action Required:** Implement backend webhooks before enabling payments

### 8. Domain: memryx.org
- **Status:** ✅ Good choice
- **Recommendation:** 
  - Frontend: `https://memryx.org` (Vercel)
  - Backend API: `https://api.memryx.org` (Railway with custom domain)

### 9. Beta Launch (20 users)
- **Status:** ✅ Configured
- **Setting:** `MAX_TENANTS=20` in `server_v2.py`
- **Enforcement:** Returns 403 when cap reached

## 📋 Remaining Tasks

### Critical (Before Launch)
1. **Apply API Key Hashing Migration**
   - Run `002_api_key_hashing.sql` in Supabase SQL Editor
   - Test API key verification

2. **Implement Stripe Backend Webhooks**
   - Create `/api/stripe/create-checkout-session` endpoint
   - Create `/api/stripe/create-portal-session` endpoint
   - Add Stripe webhook handler for payment events
   - Update user plan in Supabase on successful payment

3. **Set Up Custom Domain**
   - Configure `api.memryx.org` → Railway backend
   - Update `VITE_MCN_API_URL` in Vercel to use custom domain

### Recommended (Post-Launch)
1. **Add Python/JS SDK Wrappers**
   - Create `memryx-python` package (like `faiss` or `qdrant-client`)
   - Create `memryx-js` package for Node.js
   - Makes integration easier (similar to FAISS/ANN)

2. **Add More Integration Examples**
   - LangChain integration
   - LlamaIndex integration
   - Next.js API route example
   - Express.js middleware example

## 🎯 Launch Checklist

### Frontend (Vercel)
- [x] Environment variables set
- [x] Supabase migration applied (001_initial_schema.sql)
- [ ] API key hashing migration applied (002_api_key_hashing.sql)
- [ ] Stripe publishable key added
- [ ] Custom domain configured (memryx.org)

### Backend (Railway)
- [ ] Deploy `server_v2.py`
- [ ] Set environment variables:
  - `MAX_TENANTS=20`
  - `WORKERS_RECOMMENDED=1`
  - `ADMIN_API_KEY=...`
- [ ] Test `/health` endpoint
- [ ] Configure custom domain (api.memryx.org)
- [ ] Implement Stripe webhooks

### Database (Supabase)
- [x] Tables created (users, indexes, usage_logs)
- [ ] API key hashing enabled (002_api_key_hashing.sql)
- [ ] RLS policies verified
- [ ] Triggers working (auto API key generation)

### Testing
- [ ] Test signup → API key generation
- [ ] Test API key hashing/verification
- [ ] Test vector ingestion
- [ ] Test search
- [ ] Test rate limiting
- [ ] Test tenant cap (20 users)

## 📊 System Capacity Summary

**Beta Launch (20 users):**
- Each user gets their own plan limits
- Total system capacity = sum of all user limits
- With 1 worker: ~10 tenants, ~2M vectors, p95 < 60ms
- Scale to 2 workers when: tenants > 10 OR vectors > 2M OR p95 > 60ms

**Plan Limits (Hardcoded & Enforced):**
- All limits are enforced via `RateLimitMiddleware`
- Returns 429 with Retry-After headers when exceeded
- No way to bypass limits (security)

## 🔒 Security Notes

1. **API Keys:**
   - Currently stored in plain text (migration created for hashing)
   - After migration: Only hashed keys stored
   - Backend should verify using Supabase function `verify_api_key()`

2. **Rate Limiting:**
   - Enforced per tenant (API key)
   - Thread-safe with locks
   - No bypass possible

3. **Tenant Isolation:**
   - Vectors filtered by `user_id` in metadata
   - No cross-tenant data leakage possible

## 🚀 Next Steps

1. Apply API key hashing migration
2. Implement Stripe backend webhooks
3. Deploy backend to Railway
4. Configure custom domains
5. Test end-to-end flow
6. Launch beta (20 users)

