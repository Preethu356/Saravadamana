-- Update communities table to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view communities" ON public.communities;

CREATE POLICY "Authenticated users can view communities" 
ON public.communities 
FOR SELECT 
TO authenticated
USING (true);