# Supabase Email Redirect Setup

## Problem

When users sign up, Supabase sends a confirmation email. The link in the email redirects to localhost, which doesn't work when:
- User clicks from a different device
- User is on production (Vercel) but link points to localhost

## Solution

### Step 1: Set Frontend URL in Vercel

Add this environment variable in **Vercel → Settings → Environment Variables**:

```bash
VITE_FRONTEND_URL=https://your-vercel-app.vercel.app
```

Or if you have a custom domain:
```bash
VITE_FRONTEND_URL=https://memryx.org
```

**Important**: 
- No trailing slash
- Use `https://` (not `http://`)
- This will be used for email confirmation links

### Step 2: Configure Supabase Redirect URLs

In **Supabase Dashboard → Authentication → URL Configuration**:

Add these to **Redirect URLs**:
```
http://localhost:5173/app
http://localhost:5173/*
https://your-vercel-app.vercel.app/app
https://your-vercel-app.vercel.app/*
https://memryx.org/app
https://memryx.org/*
```

**Site URL** should be:
```
https://your-vercel-app.vercel.app
```
(or your custom domain)

### Step 3: Redeploy Vercel

After adding `VITE_FRONTEND_URL`, redeploy your Vercel project.

### Step 4: Test

1. Sign up from your Vercel site
2. Check the confirmation email
3. Click the link - it should redirect to your Vercel URL (not localhost)

## How It Works

- **Local dev**: Uses `http://localhost:5173` (from `window.location.origin`)
- **Production**: Uses `VITE_FRONTEND_URL` from environment variables
- **Email links**: Always use the production URL (Vercel)

## Troubleshooting

### Email link still goes to localhost
- Check `VITE_FRONTEND_URL` is set in Vercel
- Redeploy Vercel after adding the variable
- Check Supabase redirect URLs include your Vercel domain

### "Redirect URL not allowed" error
- Add your Vercel URL to Supabase → Authentication → URL Configuration → Redirect URLs
- Make sure it matches exactly (including `/app` path)

### Link works but shows "localhost not found"
- The link was generated before you added `VITE_FRONTEND_URL`
- Sign up again to get a new email with the correct link

