# Supabase URL Verification Guide

## Problem: DNS Resolution Fails Even Though Project is Active

If you're getting `ERR_NAME_NOT_RESOLVED` or `Could not resolve host`, but the project shows as active, the URL might be incorrect.

## Step-by-Step Verification

### Step 1: Get the EXACT URL from Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Click on your project
3. Go to **Settings** (gear icon in sidebar)
4. Click **API** in the settings menu
5. Look for **Project URL** section
6. Copy the EXACT URL shown (should look like `https://xxxxx.supabase.co`)

**Important**: 
- Copy it exactly as shown
- No trailing slash
- Should start with `https://`
- Should end with `.supabase.co`

### Step 2: Verify the URL Works

Test the URL directly:
```bash
curl https://YOUR_EXACT_URL_HERE/rest/v1/ \
  -H "apikey: YOUR_ANON_KEY"
```

If this works, the URL is correct. If it fails, the URL is wrong.

### Step 3: Check Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `VITE_SUPABASE_URL`
3. Compare it EXACTLY with the URL from Step 1
4. Check for:
   - Typos
   - Missing `https://`
   - Extra characters
   - Wrong subdomain

### Step 4: Common Issues

#### Issue 1: Project Was Recreated
If you deleted and recreated the project, it gets a NEW URL. The old URL won't work.

**Fix**: Use the NEW URL from the dashboard.

#### Issue 2: Wrong Project Selected
You might be looking at a different project in the dashboard.

**Fix**: Make sure you're in the correct project.

#### Issue 3: URL Has Changed
Sometimes Supabase changes the URL (rare, but possible).

**Fix**: Check Settings → API for the current URL.

#### Issue 4: Typo in URL
Common typos:
- `hoijlxgruwpmbafwjot` vs `hoijlxgruwpmbafwjot` (hard to spot)
- Missing `https://`
- Extra characters

**Fix**: Copy-paste directly from Supabase dashboard.

### Step 5: Update Vercel

Once you have the correct URL:

1. Go to Vercel → Settings → Environment Variables
2. Update `VITE_SUPABASE_URL` with the EXACT URL from Supabase
3. Click **Save**
4. **Redeploy** your project (or it will auto-deploy)

### Step 6: Test Again

After redeploy:
1. Open your Vercel site
2. Open browser console (F12)
3. Check for Supabase connection messages
4. Try signup again

## Quick Test Script

Run this in your browser console (on your Vercel site):
```javascript
// Check what URL is actually being used
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Test if it resolves
fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/', {
  method: 'HEAD',
  headers: {
    'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
  }
})
  .then(() => console.log('✅ URL is reachable'))
  .catch(err => console.error('❌ URL not reachable:', err));
```

## Still Not Working?

If the URL is correct and project is active, but DNS still fails:

1. **Wait 5-10 minutes** - DNS changes can take time to propagate
2. **Clear browser cache** - Old DNS cache might be stuck
3. **Try different network** - Your ISP DNS might be cached
4. **Contact Supabase support** - Project might have an issue

