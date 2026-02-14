
-- Create public feedback/comments table
CREATE TABLE public.feedbacks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL DEFAULT 'Anonymous',
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated) can read all feedback
CREATE POLICY "Anyone can view feedback"
ON public.feedbacks FOR SELECT
TO authenticated
USING (true);

-- Users can insert their own feedback
CREATE POLICY "Users can create feedback"
ON public.feedbacks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own feedback
CREATE POLICY "Users can delete own feedback"
ON public.feedbacks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
