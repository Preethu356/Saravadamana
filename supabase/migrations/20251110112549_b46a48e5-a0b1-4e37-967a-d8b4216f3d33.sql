-- Enable realtime on user_wellness_stats for change broadcasts
ALTER TABLE public.user_wellness_stats REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_wellness_stats;