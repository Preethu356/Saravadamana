-- Create screening_results table to track user screening progress
CREATE TABLE IF NOT EXISTS public.screening_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  screening_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage_score INTEGER,
  severity TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.screening_results ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own screening results" 
ON public.screening_results 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own screening results" 
ON public.screening_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own screening results" 
ON public.screening_results 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own screening results" 
ON public.screening_results 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_screening_results_user_id ON public.screening_results(user_id);
CREATE INDEX idx_screening_results_screening_type ON public.screening_results(screening_type);