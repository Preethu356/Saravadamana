-- Update RLS policy for community_members to protect user privacy
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Users can view all memberships" ON public.community_members;

-- Users should only see their own memberships
CREATE POLICY "Users can view only their own memberships"
ON public.community_members
FOR SELECT
USING (auth.uid() = user_id);