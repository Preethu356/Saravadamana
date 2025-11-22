-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  preferred_modes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  tool TEXT NOT NULL, -- 'phq9', 'gad7', 'who5', 'psqi'
  score INTEGER NOT NULL,
  raw JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create interactions table for event tracking
CREATE TABLE IF NOT EXISTS public.interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'assessment_taken', 'generate_plan', 'play_audio', 'step_completed', etc.
  event_props JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create lifestyle_logs table
CREATE TABLE IF NOT EXISTS public.lifestyle_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  sleep_hours DECIMAL(4,2),
  exercise_minutes INTEGER,
  diet_quality INTEGER CHECK (diet_quality >= 1 AND diet_quality <= 5),
  water_intake_ml INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_profile_id, log_date)
);

-- Create personality_profiles table
CREATE TABLE IF NOT EXISTS public.personality_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  scores JSONB NOT NULL,
  continuum_value DECIMAL(5,2),
  animal_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create audio_metadata table
CREATE TABLE IF NOT EXISTS public.audio_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'elevenlabs', 'google-tts', etc.
  duration_sec INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create safety_flags table
CREATE TABLE IF NOT EXISTS public.safety_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL, -- 'self_report', 'assessment', 'chat'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  message TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create consent_logs table
CREATE TABLE IF NOT EXISTS public.consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  analytics BOOLEAN DEFAULT false,
  research BOOLEAN DEFAULT false,
  data_sharing BOOLEAN DEFAULT false,
  consented_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('audio-files', 'audio-files', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- RLS Policies for assessments
CREATE POLICY "Users can view their own assessments"
  ON public.assessments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = assessments.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = assessments.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- RLS Policies for interactions
CREATE POLICY "Users can view their own interactions"
  ON public.interactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = interactions.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own interactions"
  ON public.interactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = interactions.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- RLS Policies for lifestyle_logs
CREATE POLICY "Users can view their own lifestyle logs"
  ON public.lifestyle_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = lifestyle_logs.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own lifestyle logs"
  ON public.lifestyle_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = lifestyle_logs.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own lifestyle logs"
  ON public.lifestyle_logs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = lifestyle_logs.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- RLS Policies for personality_profiles
CREATE POLICY "Users can view their own personality profiles"
  ON public.personality_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = personality_profiles.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own personality profiles"
  ON public.personality_profiles FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = personality_profiles.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- RLS Policies for audio_metadata (public read for caching)
CREATE POLICY "Anyone can view audio metadata"
  ON public.audio_metadata FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert audio metadata"
  ON public.audio_metadata FOR INSERT
  WITH CHECK (true);

-- RLS Policies for safety_flags (sensitive - limited access)
CREATE POLICY "Users can view their own safety flags"
  ON public.safety_flags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = safety_flags.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own safety flags"
  ON public.safety_flags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = safety_flags.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- RLS Policies for consent_logs
CREATE POLICY "Users can view their own consent logs"
  ON public.consent_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = consent_logs.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own consent logs"
  ON public.consent_logs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = consent_logs.user_profile_id
    AND user_profiles.auth_user_id = auth.uid()
  ));

-- Storage policies for audio files
CREATE POLICY "Authenticated users can view audio files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio-files' AND auth.role() = 'authenticated');

CREATE POLICY "Service role can upload audio files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio-files');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_user_profile_id ON public.assessments(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_interactions_user_profile_id ON public.interactions(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_interactions_event_type ON public.interactions(event_type);
CREATE INDEX IF NOT EXISTS idx_lifestyle_logs_user_profile_id ON public.lifestyle_logs(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_logs_log_date ON public.lifestyle_logs(log_date);
CREATE INDEX IF NOT EXISTS idx_safety_flags_user_profile_id ON public.safety_flags(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_safety_flags_severity ON public.safety_flags(severity);