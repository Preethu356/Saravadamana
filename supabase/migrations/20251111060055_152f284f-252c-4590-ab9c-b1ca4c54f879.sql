-- Create wellness plans table
CREATE TABLE public.wellness_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT[] NOT NULL DEFAULT '{}',
  daily_routine JSONB NOT NULL,
  weekly_schedule JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wellness_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own wellness plans"
ON public.wellness_plans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wellness plans"
ON public.wellness_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness plans"
ON public.wellness_plans
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wellness plans"
ON public.wellness_plans
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_wellness_plans_updated_at
BEFORE UPDATE ON public.wellness_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();