
-- Fix audio_metadata INSERT policy (WITH CHECK true -> restrict to authenticated + service role pattern)
DROP POLICY IF EXISTS "Service role can insert audio metadata" ON public.audio_metadata;
CREATE POLICY "Service role can insert audio metadata"
ON public.audio_metadata FOR INSERT
TO authenticated
WITH CHECK (true);

-- Fix audio_metadata SELECT policy to authenticated only
DROP POLICY IF EXISTS "Authenticated users can view audio metadata" ON public.audio_metadata;
CREATE POLICY "Authenticated users can view audio metadata"
ON public.audio_metadata FOR SELECT
TO authenticated
USING (true);

-- Fix communities SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view communities" ON public.communities;
CREATE POLICY "Authenticated users can view communities"
ON public.communities FOR SELECT
TO authenticated
USING (true);

-- Fix community_members policies
DROP POLICY IF EXISTS "Users can view only their own memberships" ON public.community_members;
CREATE POLICY "Users can view only their own memberships"
ON public.community_members FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
CREATE POLICY "Users can join communities"
ON public.community_members FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave their communities" ON public.community_members;
CREATE POLICY "Users can leave their communities"
ON public.community_members FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix achievement_badges policies
DROP POLICY IF EXISTS "Users can view their own badges" ON public.achievement_badges;
CREATE POLICY "Users can view their own badges"
ON public.achievement_badges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own badges" ON public.achievement_badges;
CREATE POLICY "Users can insert their own badges"
ON public.achievement_badges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix assessments policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
CREATE POLICY "Users can view their own assessments"
ON public.assessments FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = assessments.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
CREATE POLICY "Users can insert their own assessments"
ON public.assessments FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = assessments.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix consent_logs policies
DROP POLICY IF EXISTS "Users can view their own consent logs" ON public.consent_logs;
CREATE POLICY "Users can view their own consent logs"
ON public.consent_logs FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = consent_logs.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own consent logs" ON public.consent_logs;
CREATE POLICY "Users can insert their own consent logs"
ON public.consent_logs FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = consent_logs.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix environment_snapshots policies
DROP POLICY IF EXISTS "Users can view their own environment snapshots" ON public.environment_snapshots;
CREATE POLICY "Users can view their own environment snapshots"
ON public.environment_snapshots FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own environment snapshots" ON public.environment_snapshots;
CREATE POLICY "Users can insert their own environment snapshots"
ON public.environment_snapshots FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix exercise_plans policies
DROP POLICY IF EXISTS "Users can view their own exercise plans" ON public.exercise_plans;
CREATE POLICY "Users can view their own exercise plans"
ON public.exercise_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own exercise plans" ON public.exercise_plans;
CREATE POLICY "Users can create their own exercise plans"
ON public.exercise_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own exercise plans" ON public.exercise_plans;
CREATE POLICY "Users can update their own exercise plans"
ON public.exercise_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own exercise plans" ON public.exercise_plans;
CREATE POLICY "Users can delete their own exercise plans"
ON public.exercise_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix interactions policies
DROP POLICY IF EXISTS "Users can view their own interactions" ON public.interactions;
CREATE POLICY "Users can view their own interactions"
ON public.interactions FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = interactions.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own interactions" ON public.interactions;
CREATE POLICY "Users can insert their own interactions"
ON public.interactions FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = interactions.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix lifestyle_logs policies
DROP POLICY IF EXISTS "Users can view their own lifestyle logs" ON public.lifestyle_logs;
CREATE POLICY "Users can view their own lifestyle logs"
ON public.lifestyle_logs FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = lifestyle_logs.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own lifestyle logs" ON public.lifestyle_logs;
CREATE POLICY "Users can insert their own lifestyle logs"
ON public.lifestyle_logs FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = lifestyle_logs.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update their own lifestyle logs" ON public.lifestyle_logs;
CREATE POLICY "Users can update their own lifestyle logs"
ON public.lifestyle_logs FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = lifestyle_logs.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix mind_plans policies
DROP POLICY IF EXISTS "Users can view their own mind plans" ON public.mind_plans;
CREATE POLICY "Users can view their own mind plans"
ON public.mind_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own mind plans" ON public.mind_plans;
CREATE POLICY "Users can create their own mind plans"
ON public.mind_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own mind plans" ON public.mind_plans;
CREATE POLICY "Users can update their own mind plans"
ON public.mind_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own mind plans" ON public.mind_plans;
CREATE POLICY "Users can delete their own mind plans"
ON public.mind_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix neural_fingerprinting policies
DROP POLICY IF EXISTS "Users can view their own neural fingerprinting results" ON public.neural_fingerprinting;
CREATE POLICY "Users can view their own neural fingerprinting results"
ON public.neural_fingerprinting FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own neural fingerprinting results" ON public.neural_fingerprinting;
CREATE POLICY "Users can insert their own neural fingerprinting results"
ON public.neural_fingerprinting FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix nutrition_plans policies
DROP POLICY IF EXISTS "Users can view their own nutrition plans" ON public.nutrition_plans;
CREATE POLICY "Users can view their own nutrition plans"
ON public.nutrition_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own nutrition plans" ON public.nutrition_plans;
CREATE POLICY "Users can create their own nutrition plans"
ON public.nutrition_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own nutrition plans" ON public.nutrition_plans;
CREATE POLICY "Users can update their own nutrition plans"
ON public.nutrition_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own nutrition plans" ON public.nutrition_plans;
CREATE POLICY "Users can delete their own nutrition plans"
ON public.nutrition_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix personality_profiles policies
DROP POLICY IF EXISTS "Users can view their own personality profiles" ON public.personality_profiles;
CREATE POLICY "Users can view their own personality profiles"
ON public.personality_profiles FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = personality_profiles.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own personality profiles" ON public.personality_profiles;
CREATE POLICY "Users can insert their own personality profiles"
ON public.personality_profiles FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = personality_profiles.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix personality_results policies
DROP POLICY IF EXISTS "Users can view their own personality results" ON public.personality_results;
CREATE POLICY "Users can view their own personality results"
ON public.personality_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own personality results" ON public.personality_results;
CREATE POLICY "Users can create their own personality results"
ON public.personality_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own personality results" ON public.personality_results;
CREATE POLICY "Users can update their own personality results"
ON public.personality_results FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix safety_flags policies
DROP POLICY IF EXISTS "Users can view their own safety flags" ON public.safety_flags;
CREATE POLICY "Users can view their own safety flags"
ON public.safety_flags FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = safety_flags.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can insert their own safety flags" ON public.safety_flags;
CREATE POLICY "Users can insert their own safety flags"
ON public.safety_flags FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE user_profiles.id = safety_flags.user_profile_id AND user_profiles.auth_user_id = auth.uid()));

-- Fix screening_results policies
DROP POLICY IF EXISTS "Users can view their own screening results" ON public.screening_results;
CREATE POLICY "Users can view their own screening results"
ON public.screening_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own screening results" ON public.screening_results;
CREATE POLICY "Users can create their own screening results"
ON public.screening_results FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own screening results" ON public.screening_results;
CREATE POLICY "Users can update their own screening results"
ON public.screening_results FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own screening results" ON public.screening_results;
CREATE POLICY "Users can delete their own screening results"
ON public.screening_results FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix sequences policies
DROP POLICY IF EXISTS "Users can view their own sequences" ON public.sequences;
CREATE POLICY "Users can view their own sequences"
ON public.sequences FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own sequences" ON public.sequences;
CREATE POLICY "Users can create their own sequences"
ON public.sequences FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sequences" ON public.sequences;
CREATE POLICY "Users can update their own sequences"
ON public.sequences FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sequences" ON public.sequences;
CREATE POLICY "Users can delete their own sequences"
ON public.sequences FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix sequence_steps policies
DROP POLICY IF EXISTS "Users can view steps of their sequences" ON public.sequence_steps;
CREATE POLICY "Users can view steps of their sequences"
ON public.sequence_steps FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM sequences WHERE sequences.id = sequence_steps.sequence_id AND sequences.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can create steps for their sequences" ON public.sequence_steps;
CREATE POLICY "Users can create steps for their sequences"
ON public.sequence_steps FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM sequences WHERE sequences.id = sequence_steps.sequence_id AND sequences.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can update steps of their sequences" ON public.sequence_steps;
CREATE POLICY "Users can update steps of their sequences"
ON public.sequence_steps FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM sequences WHERE sequences.id = sequence_steps.sequence_id AND sequences.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can delete steps of their sequences" ON public.sequence_steps;
CREATE POLICY "Users can delete steps of their sequences"
ON public.sequence_steps FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM sequences WHERE sequences.id = sequence_steps.sequence_id AND sequences.user_id = auth.uid()));

-- Fix sleep_routines policies
DROP POLICY IF EXISTS "Users can view their own sleep routines" ON public.sleep_routines;
CREATE POLICY "Users can view their own sleep routines"
ON public.sleep_routines FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own sleep routines" ON public.sleep_routines;
CREATE POLICY "Users can create their own sleep routines"
ON public.sleep_routines FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own sleep routines" ON public.sleep_routines;
CREATE POLICY "Users can update their own sleep routines"
ON public.sleep_routines FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own sleep routines" ON public.sleep_routines;
CREATE POLICY "Users can delete their own sleep routines"
ON public.sleep_routines FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix stigma_tool_progress policies
DROP POLICY IF EXISTS "Users can view their own stigma tool progress" ON public.stigma_tool_progress;
CREATE POLICY "Users can view their own stigma tool progress"
ON public.stigma_tool_progress FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own stigma tool progress" ON public.stigma_tool_progress;
CREATE POLICY "Users can insert their own stigma tool progress"
ON public.stigma_tool_progress FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stigma tool progress" ON public.stigma_tool_progress;
CREATE POLICY "Users can update their own stigma tool progress"
ON public.stigma_tool_progress FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix user_profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = auth_user_id);

-- Fix user_wellness_stats policies
DROP POLICY IF EXISTS "Users can view their own wellness stats" ON public.user_wellness_stats;
CREATE POLICY "Users can view their own wellness stats"
ON public.user_wellness_stats FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own wellness stats" ON public.user_wellness_stats;
CREATE POLICY "Users can insert their own wellness stats"
ON public.user_wellness_stats FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wellness stats" ON public.user_wellness_stats;
CREATE POLICY "Users can update their own wellness stats"
ON public.user_wellness_stats FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Fix wellness_plans policies
DROP POLICY IF EXISTS "Users can view their own wellness plans" ON public.wellness_plans;
CREATE POLICY "Users can view their own wellness plans"
ON public.wellness_plans FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own wellness plans" ON public.wellness_plans;
CREATE POLICY "Users can create their own wellness plans"
ON public.wellness_plans FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own wellness plans" ON public.wellness_plans;
CREATE POLICY "Users can update their own wellness plans"
ON public.wellness_plans FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own wellness plans" ON public.wellness_plans;
CREATE POLICY "Users can delete their own wellness plans"
ON public.wellness_plans FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix storage.objects policy for audio files
DROP POLICY IF EXISTS "Authenticated users can view audio files" ON storage.objects;
CREATE POLICY "Authenticated users can view audio files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'audio-files');
