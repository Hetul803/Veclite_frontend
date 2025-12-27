# Supabase Email Settings Check

## Problem
Email confirmation links are expiring immediately or very quickly, even for fresh signups.

## Solution: Check Supabase Email Settings

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `hoiijlxgruwpmbafwjot`
3. Go to **Authentication** → **Email Templates**

### Step 2: Check Email Confirmation Template
1. Click on **"Confirm signup"** template
2. Check the **Redirect URL** in the template
3. It should be: `{{ .SiteURL }}}/auth/callback` or use `{{ .RedirectTo }}`

### Step 3: Check URL Configuration (CRITICAL)
Go to **Authentication** → **URL Configuration**

**Site URL must be:**
```
https://memryx-hetul-patels-projects-25c30007.vercel.app
```

**Redirect URLs must include (EXACTLY):**
```
https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback
```

**Important:**
- No trailing slashes
- Must use `https://` (not `http://`)
- Must match your Vercel URL exactly
- Case-sensitive

### Step 4: Check Email Rate Limits
Go to **Authentication** → **Settings**

Check:
- **Enable email confirmations**: Should be ON
- **Email confirmation expiry**: Default is 3600 seconds (1 hour)
- **Rate limit**: Make sure it's not too restrictive

### Step 5: Test with Fresh Signup
1. **Delete the user** in Supabase Dashboard → Authentication → Users
2. **Sign up again** with the same email
3. **Check your email immediately** (within 1 minute)
4. **Click the link immediately** (don't wait)

### Step 6: Check Email Link Format
When you receive the email, the link should look like:
```
https://memryx-hetul-patels-projects-25c30007.vercel.app/auth/callback#access_token=eyJ...&refresh_token=...&type=email
```

If it looks different, the redirect URL is wrong.

## Common Issues

### Issue 1: Redirect URL Mismatch
**Symptom:** Links expire immediately or redirect to wrong page
**Fix:** Make sure redirect URL in Supabase matches exactly what's in the email

### Issue 2: Site URL Wrong
**Symptom:** Links don't work at all
**Fix:** Set Site URL to your Vercel deployment URL

### Issue 3: Email Not Being Sent
**Symptom:** No email received
**Fix:** Check Supabase → Settings → Email → SMTP settings (if using custom SMTP)

### Issue 4: Links Expire Too Fast
**Symptom:** Links expire before clicking
**Fix:** Check email confirmation expiry time (should be 3600 seconds = 1 hour)

## Quick Test
1. Sign up with a NEW email (never used before)
2. Check email within 30 seconds
3. Click link immediately
4. Check browser console for logs

If it still expires, there's likely a redirect URL mismatch.

