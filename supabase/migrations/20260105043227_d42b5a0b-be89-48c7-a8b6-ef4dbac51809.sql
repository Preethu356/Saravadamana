-- Add demographic and wellness fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS weight_kg numeric,
ADD COLUMN IF NOT EXISTS height_cm numeric,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS sex text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS job text,
ADD COLUMN IF NOT EXISTS good_habits text[],
ADD COLUMN IF NOT EXISTS bad_habits text[],
ADD COLUMN IF NOT EXISTS loneliness_score integer,
ADD COLUMN IF NOT EXISTS happiness_score integer;