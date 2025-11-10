-- Create user wellness stats table to track streaks, sessions, and activities
CREATE TABLE public.user_wellness_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  total_sessions integer NOT NULL DEFAULT 0,
  meditation_minutes integer NOT NULL DEFAULT 0,
  journal_entries integer NOT NULL DEFAULT 0,
  mood_entries integer NOT NULL DEFAULT 0,
  last_activity_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_wellness_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view their own wellness stats"
ON public.user_wellness_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own stats
CREATE POLICY "Users can insert their own wellness stats"
ON public.user_wellness_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own stats
CREATE POLICY "Users can update their own wellness stats"
ON public.user_wellness_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_user_wellness_stats_updated_at
BEFORE UPDATE ON public.user_wellness_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to initialize wellness stats for new users
CREATE OR REPLACE FUNCTION public.initialize_wellness_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_wellness_stats (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger to create wellness stats when a new user signs up
CREATE TRIGGER on_user_created_initialize_wellness
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.initialize_wellness_stats();