-- Create table for stigma tool progress tracking
CREATE TABLE IF NOT EXISTS public.stigma_tool_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tool_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  responses JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for achievement badges
CREATE TABLE IF NOT EXISTS public.achievement_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create table for neural fingerprinting results
CREATE TABLE IF NOT EXISTS public.neural_fingerprinting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vulnerability_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  risk_factors JSONB NOT NULL,
  protective_factors JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stigma_tool_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neural_fingerprinting ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stigma_tool_progress
CREATE POLICY "Users can view their own stigma tool progress"
  ON public.stigma_tool_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stigma tool progress"
  ON public.stigma_tool_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stigma tool progress"
  ON public.stigma_tool_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for achievement_badges
CREATE POLICY "Users can view their own badges"
  ON public.achievement_badges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges"
  ON public.achievement_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for neural_fingerprinting
CREATE POLICY "Users can view their own neural fingerprinting results"
  ON public.neural_fingerprinting FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own neural fingerprinting results"
  ON public.neural_fingerprinting FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_stigma_progress_user ON public.stigma_tool_progress(user_id);
CREATE INDEX idx_badges_user ON public.achievement_badges(user_id);
CREATE INDEX idx_neural_user ON public.neural_fingerprinting(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_stigma_progress_updated_at
  BEFORE UPDATE ON public.stigma_tool_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();