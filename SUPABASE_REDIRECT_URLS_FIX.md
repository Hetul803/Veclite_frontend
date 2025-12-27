# Supabase Redirect URLs Configuration

## Current Issue
The redirect URLs in Supabase are incorrect. They need to match your Vercel deployment URL.

## Your Actual Vercel Deployment URL
```
https://memryx-hetul-patels-projects-25c30007.vercel.app
```

## Steps to Fix

### 1. Go to Supabase Dashboard
- Navigate to: **Authentication** → **URL Configuration**

### 2. Update Site URL
Set **Site URL** to:
```
https://memryx-hetul-patels-projects-25c30007.vercel.app
```

### 3. Update Redirect URLs
**Remove all existing redirect URLs** and add ONLY these:

```
https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback
https://memryx-hetul-patels-projects-25c30007.vercel.app/*
http://localhost:5173/auth/callback
http://localhost:5173/*
```

**Important:**
- Use the **full Vercel URL** (with `https://`)
- Include `/auth/callback` for email confirmation
- Include `/*` wildcard for other auth flows
- Keep localhost URLs for local development

### 4. Save Changes
Click **Save** at the bottom of the page.

### 5. Update Vercel Environment Variable
In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add or update:
```
VITE_FRONTEND_URL=https://memryx-hetul-patels-projects-25c30007.vercel.app
```

**Important:** Make sure there's NO trailing slash at the end.

### 6. Redeploy Vercel
After updating the environment variable, trigger a new deployment in Vercel.

## After Fixing

1. **Sign up again** to get a new email with the correct callback URL
2. Click the confirmation link
3. It should redirect to `/auth/callback` on your Vercel site
4. You'll be automatically logged in and redirected to `/app`

## Testing

After making these changes:
1. Sign up with a new email (or delete the old user in Supabase)
2. Check the email - the confirmation link should point to:
   `https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback#access_token=...`
3. Click the link
4. You should see the callback page, then be redirected to `/app`

