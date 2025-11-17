-- Mind Matters Module Tables

-- Mind Your Diet: Meal plans and nutrition tracking
CREATE TABLE public.nutrition_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL, -- '7-day', 'custom'
  title TEXT NOT NULL,
  meals JSONB NOT NULL, -- [{day: 1, meal: "breakfast", food: "...", mental_benefit: "..."}]
  completed_days INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mind Your Gym: Exercise routines
CREATE TABLE public.exercise_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL, -- 'mood-boost', 'stress-relief', 'energy'
  title TEXT NOT NULL,
  exercises JSONB NOT NULL, -- [{name: "...", duration: 3, video_url: "...", mood_benefit: "..."}]
  completed_sessions INTEGER DEFAULT 0,
  scheduled_time TIME,
  reminder_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Mind Your Sleep: Sleep tracking and routines
CREATE TABLE public.sleep_routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bedtime_routine JSONB NOT NULL, -- [{step: "...", duration: 5, audio_url: "..."}]
  psqi_score INTEGER,
  sleep_quality_rating INTEGER, -- 1-10
  body_image_reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Personality Map: Animal archetype results
CREATE TABLE public.personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  archetype TEXT NOT NULL, -- 'dolphin', 'otter', 'fox', 'wolf'
  position_score INTEGER NOT NULL, -- 0-100 (0=Dolphin, 100=Wolf)
  strengths TEXT[] NOT NULL,
  growth_areas TEXT[] NOT NULL,
  reflection_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- My Mind Plan: Compiled personalized plans
CREATE TABLE public.mind_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  duration_days INTEGER DEFAULT 7,
  interventions JSONB NOT NULL, -- [{day: 1, type: "diet|gym|sleep", title: "...", completed: false}]
  current_day INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mind_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for nutrition_plans
CREATE POLICY "Users can view their own nutrition plans"
ON public.nutrition_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nutrition plans"
ON public.nutrition_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nutrition plans"
ON public.nutrition_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nutrition plans"
ON public.nutrition_plans FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for exercise_plans
CREATE POLICY "Users can view their own exercise plans"
ON public.exercise_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise plans"
ON public.exercise_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise plans"
ON public.exercise_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise plans"
ON public.exercise_plans FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for sleep_routines
CREATE POLICY "Users can view their own sleep routines"
ON public.sleep_routines FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sleep routines"
ON public.sleep_routines FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep routines"
ON public.sleep_routines FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep routines"
ON public.sleep_routines FOR DELETE
USING (auth.uid() = user_id);

-- RLS Policies for personality_results
CREATE POLICY "Users can view their own personality results"
ON public.personality_results FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personality results"
ON public.personality_results FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personality results"
ON public.personality_results FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for mind_plans
CREATE POLICY "Users can view their own mind plans"
ON public.mind_plans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mind plans"
ON public.mind_plans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mind plans"
ON public.mind_plans FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mind plans"
ON public.mind_plans FOR DELETE
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_nutrition_plans_updated_at
BEFORE UPDATE ON public.nutrition_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercise_plans_updated_at
BEFORE UPDATE ON public.exercise_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sleep_routines_updated_at
BEFORE UPDATE ON public.sleep_routines
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mind_plans_updated_at
BEFORE UPDATE ON public.mind_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();