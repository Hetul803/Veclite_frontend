# Fix Vercel Authentication/SSO Issue

## Problem
When visiting `https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback`, Vercel redirects to `https://vercel.com/login?next=...` instead of showing your app.

This means **Vercel Authentication/SSO is enabled** on your project, which is blocking public access to your routes.

## Solution: Disable Vercel Authentication

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: `memryx-hetul-patels-projects-25c30007`

### Step 2: Check Project Settings
1. Go to **Settings** → **General**
2. Look for **"Vercel Authentication"** or **"Password Protection"** section
3. If you see:
   - **"Password Protection"** → Turn it OFF
   - **"Vercel Authentication"** → Disable it
   - **"Deployment Protection"** → Make sure it's set to "None" or "Public"

### Step 3: Check Deployment Settings
1. Go to **Settings** → **Deployments**
2. Look for **"Deployment Protection"**
3. Set it to **"None"** (or "Public" if available)

### Step 4: Check Team/Organization Settings
If you're in a team:
1. Go to **Team Settings** → **Security**
2. Check if there's organization-wide authentication enabled
3. Disable it or add an exception for this project

### Step 5: Redeploy
After making changes:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Or push a new commit to trigger a redeploy

## Alternative: Check for vercel.json

If there's a `vercel.json` file in your project with authentication settings, remove or update it:

```json
// BAD - This would block routes
{
  "auth": {
    "enabled": true
  }
}

// GOOD - Remove auth or set to false
{
  "auth": {
    "enabled": false
  }
}
```

Or just delete the `vercel.json` file if you don't need it.

## Verify Fix

After disabling authentication:
1. Visit: `https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback`
2. You should see the callback page (not Vercel login)
3. Then try the email confirmation link again

## Why This Happened

Vercel Authentication/SSO is a feature that protects deployments behind a login screen. It's useful for staging/preview environments, but **NOT for production apps** that need public access.

Your app needs to be publicly accessible for:
- Email confirmation links
- Public pages (Home, Pricing, Docs)
- API endpoints
- User authentication flows

## If You Can't Find the Setting

If you don't see authentication settings:
1. Check if you're on a **Vercel Pro** plan (some features are plan-specific)
2. Contact Vercel support
3. Or create a new project and redeploy (as a last resort)

