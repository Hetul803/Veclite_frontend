-- Migration: Add API Key Hashing
-- This migration adds a hashed_api_key column and updates the trigger to hash API keys

-- Add hashed_api_key column (we'll store bcrypt hash here)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS hashed_api_key TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_hashed_api_key ON public.users(hashed_api_key);

-- Function to hash API key using pgcrypto (bcrypt)
-- Note: This requires pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update the trigger function to hash API keys
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  raw_api_key TEXT;
BEGIN
  -- Generate raw API key
  raw_api_key := 'memryx_sk_' || substr(NEW.id::text, 1, 24) || substr(md5(random()::text), 1, 10);
  
  -- Insert user with both raw and hashed API key
  -- Note: In production, you should only store the hash and never return the raw key
  -- For now, we store both for backward compatibility during migration
  INSERT INTO public.users (id, email, api_key, hashed_api_key)
  VALUES (
    NEW.id,
    NEW.email,
    raw_api_key,  -- Keep raw for now (will be removed in future migration)
    crypt(raw_api_key, gen_salt('bf'))  -- bcrypt hash
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify API key
CREATE OR REPLACE FUNCTION public.verify_api_key(api_key_to_check TEXT)
RETURNS UUID AS $$
DECLARE
  user_id_found UUID;
BEGIN
  -- First try to find by hashed key
  SELECT id INTO user_id_found
  FROM public.users
  WHERE hashed_api_key = crypt(api_key_to_check, hashed_api_key);
  
  -- If not found and raw api_key exists (backward compatibility), check raw
  IF user_id_found IS NULL THEN
    SELECT id INTO user_id_found
    FROM public.users
    WHERE api_key = api_key_to_check;
  END IF;
  
  RETURN user_id_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to regenerate API key (with hashing)
CREATE OR REPLACE FUNCTION public.regenerate_api_key(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  new_raw_key TEXT;
BEGIN
  -- Generate new raw API key
  new_raw_key := 'memryx_sk_' || substr(user_uuid::text, 1, 24) || substr(md5(random()::text), 1, 10);
  
  -- Update user with new key (hashed)
  UPDATE public.users
  SET 
    api_key = new_raw_key,  -- Keep raw for backward compatibility
    hashed_api_key = crypt(new_raw_key, gen_salt('bf')),
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN new_raw_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

