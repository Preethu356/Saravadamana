-- Update audio_metadata table to require authentication for viewing
DROP POLICY IF EXISTS "Anyone can view audio metadata" ON public.audio_metadata;

CREATE POLICY "Authenticated users can view audio metadata" 
ON public.audio_metadata 
FOR SELECT 
TO authenticated
USING (true);