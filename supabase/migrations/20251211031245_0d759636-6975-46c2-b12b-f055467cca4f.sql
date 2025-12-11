-- Drop and recreate profiles table policies with explicit authentication check
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Recreate with explicit auth.uid() IS NOT NULL check
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Also fix screening_results table with explicit authentication
DROP POLICY IF EXISTS "Users can view their own screening results" ON public.screening_results;
DROP POLICY IF EXISTS "Users can create their own screening results" ON public.screening_results;
DROP POLICY IF EXISTS "Users can update their own screening results" ON public.screening_results;
DROP POLICY IF EXISTS "Users can delete their own screening results" ON public.screening_results;

CREATE POLICY "Users can view their own screening results" 
ON public.screening_results 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own screening results" 
ON public.screening_results 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own screening results" 
ON public.screening_results 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own screening results" 
ON public.screening_results 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);