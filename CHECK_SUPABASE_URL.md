# How to Find Your Correct Supabase URL

## The Problem

Your URL `hoijlxgruwpmbafwjot.supabase.co` cannot be resolved by DNS, even though the project shows as active.

## Solution: Get the EXACT URL from Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Log in
3. Find your project in the list

### Step 2: Get the Project URL
1. Click on your project
2. In the left sidebar, click **Settings** (gear icon)
3. Click **API** (under Project Settings)
4. Look for **Project URL** section
5. **Copy the EXACT URL** shown there

**It should look like:**
```
https://xxxxxxxxxxxxx.supabase.co
```

### Step 3: Compare with Your Current URL

**Current URL in your code:**
```
https://hoijlxgruwpmbafwjot.supabase.co
```

**Does it match EXACTLY?**
- Same subdomain?
- Same format?
- No typos?

### Step 4: Check the Anon Key

Your anon key contains: `"ref":"hoijlxgruwpmbafwjot"`

This should match the subdomain in your URL. If they don't match, that's the problem!

### Step 5: Update Vercel

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `VITE_SUPABASE_URL` with the EXACT URL from Step 2
3. **Save**
4. **Redeploy** (or wait for auto-deploy)

## If the URL is Different

If the URL in Supabase dashboard is different from `hoijlxgruwpmbafwjot.supabase.co`:

1. **The project was recreated** - Use the new URL
2. **You're looking at the wrong project** - Check project list
3. **Supabase changed the URL** - Use the current one from dashboard

## Quick Test

After updating, test in browser console:
```javascript
console.log('URL:', import.meta.env.VITE_SUPABASE_URL);
fetch(import.meta.env.VITE_SUPABASE_URL + '/rest/v1/')
  .then(r => console.log('✅ Works!', r.status))
  .catch(e => console.error('❌ Failed:', e));
```

