# Vercel Frontend Troubleshooting Guide

## "Load Failed" Error on Login/Signup

This error usually means Supabase connection failed. Here's how to fix it:

### Step 1: Check Environment Variables in Vercel

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables**

Make sure you have:
```bash
VITE_SUPABASE_URL=https://hoijlxgruwpmbafwjot.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_MCN_API_URL=https://your-railway-url.up.railway.app
```

**Important**: 
- Variables must start with `VITE_` to be accessible in the frontend
- After adding/changing variables, **redeploy** your Vercel project

### Step 2: Check Supabase Project Status

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Check if your project is **active** (not paused)
3. If paused, click "Restore" to reactivate

### Step 3: Check Browser Console

1. Open your Vercel site
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for errors like:
   - `Failed to fetch`
   - `NetworkError`
   - `CORS error`
   - `Supabase not configured`

### Step 4: Check Network Tab

1. In DevTools, go to **Network** tab
2. Try to login/signup
3. Look for failed requests to:
   - `https://hoijlxgruwpmbafwjot.supabase.co`
   - Check the status code (should be 200, not 404/500)

### Step 5: Verify Supabase URL Configuration

In Supabase Dashboard:
1. Go to **Settings → API**
2. Check **Project URL** matches: `https://hoijlxgruwpmbafwjot.supabase.co`
3. Go to **Authentication → URL Configuration**
4. Add your Vercel domain to **Redirect URLs**:
   - `https://your-vercel-app.vercel.app`
   - `https://memryx.org` (if you have custom domain)

### Step 6: Common Issues & Fixes

#### Issue: "Supabase not configured"
**Fix**: Add environment variables in Vercel and redeploy

#### Issue: "Failed to fetch" / "NetworkError"
**Fix**: 
- Check Supabase project is active
- Check internet connection
- Check CORS settings in Supabase

#### Issue: "CORS error"
**Fix**: Add your Vercel URL to Supabase Authentication → URL Configuration

#### Issue: "User account not found"
**Fix**: This is normal for new signups - the trigger should create the user. Check Supabase database triggers.

### Step 7: Test Supabase Connection

Open browser console and run:
```javascript
// Check if Supabase is configured
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test connection
import { supabase } from './lib/supabase';
supabase.auth.getSession().then(console.log).catch(console.error);
```

### Step 8: Check Vercel Build Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Check **Build Logs** for errors
4. Check **Runtime Logs** for runtime errors

## Quick Checklist

- [ ] Environment variables set in Vercel (with `VITE_` prefix)
- [ ] Vercel project redeployed after adding variables
- [ ] Supabase project is active (not paused)
- [ ] Supabase URL is correct
- [ ] Vercel domain added to Supabase redirect URLs
- [ ] Browser console shows no errors
- [ ] Network tab shows successful requests to Supabase

## Still Not Working?

1. **Check browser console** for specific error messages
2. **Check Vercel logs** for deployment/runtime errors
3. **Test Supabase directly**:
   ```bash
   curl https://hoijlxgruwpmbafwjot.supabase.co/rest/v1/ \
     -H "apikey: YOUR_ANON_KEY"
   ```

