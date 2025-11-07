-- Create communities table
CREATE TABLE public.communities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Everyone can view communities
CREATE POLICY "Anyone can view communities"
ON public.communities
FOR SELECT
USING (true);

-- Create community_members table
CREATE TABLE public.community_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);

-- Enable RLS on community_members
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Users can view all community memberships (to see member counts)
CREATE POLICY "Users can view all memberships"
ON public.community_members
FOR SELECT
TO authenticated
USING (true);

-- Users can join communities
CREATE POLICY "Users can join communities"
ON public.community_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can leave communities they joined
CREATE POLICY "Users can leave their communities"
ON public.community_members
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Insert initial communities
INSERT INTO public.communities (name, description, icon) VALUES
('Anxiety Support Community', 'Connect with others managing anxiety disorders', '💙'),
('Depression Recovery Circle', 'Peer support for depression and mood disorders', '🌈'),
('Stress Management Group', 'Share coping strategies for daily stress', '🧠'),
('Mindfulness Community', 'Practice mindfulness together', '🕉️');

-- Create function to count community members
CREATE OR REPLACE FUNCTION public.get_community_member_count(community_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.community_members
  WHERE community_id = community_uuid
$$;