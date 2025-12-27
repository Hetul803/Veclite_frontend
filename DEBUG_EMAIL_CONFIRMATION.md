# Debugging Email Confirmation Issue

## Current Problem
When clicking the email confirmation link, it says "authenticating" briefly then redirects to Vercel login page instead of the callback route.

## Debugging Steps

### 1. Check the Email Link
When you receive the confirmation email, check what URL it contains:
- It should be: `https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback#access_token=...`
- If it's different, that's the problem

### 2. Check Browser Console
After clicking the link, open browser console (F12) and look for:
- `✅ AuthCallback component mounted` - confirms the route is hit
- `🔐 Auth callback handler started` - confirms the handler runs
- Any error messages

### 3. Check Supabase Redirect URLs
In Supabase Dashboard → Authentication → URL Configuration:

**Site URL should be:**
```
https://memryx-hetul-patels-projects-25c30007.vercel.app
```

**Redirect URLs should include:**
```
https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback
https://memryx-hetul-patels-projects-25c30007.vercel.app/*
```

### 4. Check Vercel Environment Variable
In Vercel Dashboard → Settings → Environment Variables:

**VITE_FRONTEND_URL should be:**
```
https://memryx-hetul-patels-projects-25c30007.vercel.app
```

(No trailing slash, with https://)

### 5. Test the Callback Route Directly
Try visiting this URL directly (replace with your actual Vercel URL):
```
https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback
```

You should see the callback page (even if it shows an error, the page should load).

### 6. Check Network Tab
In browser DevTools → Network tab:
- Look for requests to `/auth/callback`
- Check if there are any redirects (301/302)
- Check if the request is going to the right domain

### 7. Common Issues

**Issue: Redirect URL mismatch**
- Supabase redirect URLs must EXACTLY match what's in the email
- Check for trailing slashes, http vs https, www vs non-www

**Issue: Route not matching**
- The route `/auth/callback` must be defined in App.tsx
- Check that it's not being blocked by authentication middleware

**Issue: Supabase auto-redirect**
- With `detectSessionInUrl: false`, Supabase won't auto-process
- We handle it manually in AuthCallback component

## What to Share
If it's still not working, share:
1. The exact URL from the email confirmation link
2. Browser console logs (all of them)
3. Network tab showing what requests are made
4. What page you actually see after clicking

