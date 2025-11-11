-- Add user preference columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT CHECK (user_type IN ('student', 'employee', 'women', 'elderly')),
ADD COLUMN IF NOT EXISTS mental_state TEXT CHECK (mental_state IN ('stable', 'tense', 'anxious', 'critical')),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;