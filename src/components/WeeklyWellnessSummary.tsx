import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, TrendingUp, Heart, Brain, Moon, Dumbbell, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface WellnessData {
  currentStreak: number;
  totalSessions: number;
  moodEntries: number;
  meditationMinutes: number;
  screeningCount: number;
  avgSleepHours: number | null;
  avgExerciseMinutes: number | null;
  avgDietQuality: number | null;
}

interface WellnessInsights {
  summary: string;
  highlights: string[];
  recommendations: string[];
  focusArea: string;
}

export function WeeklyWellnessSummary() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [wellnessData, setWellnessData] = useState<WellnessData | null>(null);
  const [insights, setInsights] = useState<WellnessInsights | null>(null);

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch wellness stats
      const { data: stats } = await supabase
        .from("user_wellness_stats")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch screening count from last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const { count: screeningCount } = await supabase
        .from("screening_results")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", weekAgo.toISOString());

      // Fetch lifestyle logs from last 7 days
      const { data: lifestyleLogs } = await supabase
        .from("lifestyle_logs")
        .select("sleep_hours, exercise_minutes, diet_quality")
        .gte("log_date", weekAgo.toISOString().split("T")[0]);

      // Calculate averages
      let avgSleepHours = null;
      let avgExerciseMinutes = null;
      let avgDietQuality = null;

      if (lifestyleLogs && lifestyleLogs.length > 0) {
        const sleepValues = lifestyleLogs.filter(l => l.sleep_hours).map(l => Number(l.sleep_hours));
        const exerciseValues = lifestyleLogs.filter(l => l.exercise_minutes).map(l => l.exercise_minutes!);
        const dietValues = lifestyleLogs.filter(l => l.diet_quality).map(l => l.diet_quality!);

        if (sleepValues.length) avgSleepHours = sleepValues.reduce((a, b) => a + b, 0) / sleepValues.length;
        if (exerciseValues.length) avgExerciseMinutes = exerciseValues.reduce((a, b) => a + b, 0) / exerciseValues.length;
        if (dietValues.length) avgDietQuality = dietValues.reduce((a, b) => a + b, 0) / dietValues.length;
      }

      const data: WellnessData = {
        currentStreak: stats?.current_streak || 0,
        totalSessions: stats?.total_sessions || 0,
        moodEntries: stats?.mood_entries || 0,
        meditationMinutes: stats?.meditation_minutes || 0,
        screeningCount: screeningCount || 0,
        avgSleepHours,
        avgExerciseMinutes,
        avgDietQuality,
      };

      setWellnessData(data);
      setLoading(false);

      // Auto-generate insights if we have data
      if (data.totalSessions > 0 || data.moodEntries > 0) {
        generateInsights(data);
      }
    } catch (error) {
      console.error("Error fetching wellness data:", error);
      setLoading(false);
    }
  };

  const generateInsights = async (data: WellnessData) => {
    setGenerating(true);
    try {
      const response = await supabase.functions.invoke("generate-wellness-insights", {
        body: { wellnessData: data },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setInsights(response.data);
    } catch (error) {
      console.error("Error generating insights:", error);
      // Fallback to basic insights
      setInsights({
        summary: "Keep up your wellness journey! Every step counts towards better mental health.",
        highlights: [
          data.currentStreak > 0 ? `${data.currentStreak} day streak - great consistency!` : "Start your streak today!",
          data.moodEntries > 0 ? `${data.moodEntries} mood entries logged` : "Try logging your mood daily",
          data.meditationMinutes > 0 ? `${data.meditationMinutes} minutes of mindfulness` : "Explore meditation exercises",
        ],
        recommendations: [
          "Try a 5-minute breathing exercise",
          "Log your mood to track patterns",
          "Complete a quick screening assessment",
        ],
        focusArea: "Consistency",
      });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Loading wellness summary...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50/80 via-pink-50/60 to-purple-50/80 dark:from-blue-950/40 dark:via-pink-950/30 dark:to-purple-950/40 border-primary/20 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Weekly Wellness Summary
            {generating && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={TrendingUp} label="Streak" value={`${wellnessData?.currentStreak || 0} days`} color="text-green-600" />
            <StatCard icon={Heart} label="Mood Logs" value={wellnessData?.moodEntries || 0} color="text-pink-600" />
            <StatCard icon={Brain} label="Sessions" value={wellnessData?.totalSessions || 0} color="text-purple-600" />
            <StatCard icon={Moon} label="Meditation" value={`${wellnessData?.meditationMinutes || 0} min`} color="text-blue-600" />
          </div>

          {/* Lifestyle Averages */}
          {(wellnessData?.avgSleepHours || wellnessData?.avgExerciseMinutes || wellnessData?.avgDietQuality) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {wellnessData.avgSleepHours && (
                <span className="px-3 py-1 rounded-full bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Moon className="h-3 w-3 inline mr-1" />
                  {wellnessData.avgSleepHours.toFixed(1)}h avg sleep
                </span>
              )}
              {wellnessData.avgExerciseMinutes && (
                <span className="px-3 py-1 rounded-full bg-green-100/60 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Dumbbell className="h-3 w-3 inline mr-1" />
                  {Math.round(wellnessData.avgExerciseMinutes)}min avg exercise
                </span>
              )}
            </div>
          )}

          {/* AI Insights */}
          {insights && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 pt-2 border-t border-primary/10"
            >
              <p className="text-sm text-foreground/80 italic">"{insights.summary}"</p>
              
              {/* Highlights */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Highlights</h4>
                <ul className="space-y-1">
                  {insights.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommendations</h4>
                <ul className="space-y-1">
                  {insights.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-accent">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus Area */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Focus Area: <span className="font-medium text-primary">{insights.focusArea}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => wellnessData && generateInsights(wellnessData)}
                  disabled={generating}
                  className="text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${generating ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
            </motion.div>
          )}

          {!insights && !generating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => wellnessData && generateInsights(wellnessData)}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Insights
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-background/60 backdrop-blur-sm rounded-lg p-3 text-center">
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
