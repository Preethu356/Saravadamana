-- Create environment_snapshots table
CREATE TABLE IF NOT EXISTS public.environment_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  temperature DECIMAL(5,2),
  humidity INTEGER,
  pressure INTEGER,
  wind_speed DECIMAL(5,2),
  uv_index DECIMAL(3,1),
  aqi INTEGER,
  pm25 DECIMAL(5,2),
  weather_condition TEXT,
  ai_insights TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.environment_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own environment snapshots"
  ON public.environment_snapshots
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own environment snapshots"
  ON public.environment_snapshots
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_environment_snapshots_user_id ON public.environment_snapshots(user_id);
CREATE INDEX idx_environment_snapshots_timestamp ON public.environment_snapshots(timestamp DESC);