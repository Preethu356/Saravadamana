import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Moon,
  Dumbbell,
  Apple,
  Droplets,
  Brain,
  Heart,
  Activity,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  user_type: string | null;
  mental_state: string | null;
  onboarding_completed: boolean | null;
}

interface LifestyleLog {
  log_date: string;
  sleep_hours: number | null;
  exercise_minutes: number | null;
  diet_quality: number | null;
  water_intake_ml: number | null;
}

interface ScreeningResult {
  screening_type: string;
  score: number;
  max_score: number;
  severity: string | null;
  completed_at: string;
}

interface CorrelationInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  recommendation: string;
}

const DemographicDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [lifestyleLogs, setLifestyleLogs] = useState<LifestyleLog[]>([]);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [insights, setInsights] = useState<CorrelationInsight[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        calculateProfileCompletion(profileData);
      }

      // Fetch lifestyle logs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let fetchedLogs: LifestyleLog[] = [];
      let fetchedScreenings: ScreeningResult[] = [];

      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userProfile) {
        const { data: logsData } = await supabase
          .from("lifestyle_logs")
          .select("*")
          .eq("user_profile_id", userProfile.id)
          .gte("log_date", thirtyDaysAgo.toISOString().split('T')[0])
          .order("log_date", { ascending: true });

        if (logsData) {
          setLifestyleLogs(logsData);
          fetchedLogs = logsData;
        }
      }

      // Fetch screening results
      const { data: screeningsData } = await supabase
        .from("screening_results")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (screeningsData) {
        setScreeningResults(screeningsData);
        fetchedScreenings = screeningsData;
      }

      // Generate insights after data is fetched
      generateCorrelationInsights(fetchedLogs, fetchedScreenings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (data: ProfileData) => {
    const fields = [
      data.full_name,
      data.email,
      data.user_type,
      data.mental_state,
      data.onboarding_completed
    ];
    const completed = fields.filter(f => f !== null && f !== undefined && f !== '').length;
    setProfileCompletion(Math.round((completed / fields.length) * 100));
  };

  const generateCorrelationInsights = (logs: LifestyleLog[], screenings: ScreeningResult[]) => {
    const newInsights: CorrelationInsight[] = [];

    if (logs.length === 0) {
      newInsights.push({
        type: 'neutral',
        title: 'Start Tracking Your Lifestyle',
        description: 'Log your daily sleep, exercise, and diet to unlock personalized insights.',
        recommendation: 'Begin logging today to see how your habits affect your mental wellness.'
      });
      setInsights(newInsights);
      return;
    }

    // Calculate averages
    const avgSleep = logs.reduce((sum, l) => sum + (l.sleep_hours || 0), 0) / logs.length;
    const avgExercise = logs.reduce((sum, l) => sum + (l.exercise_minutes || 0), 0) / logs.length;
    const avgDiet = logs.reduce((sum, l) => sum + (l.diet_quality || 0), 0) / logs.length;
    const avgWater = logs.reduce((sum, l) => sum + (l.water_intake_ml || 0), 0) / logs.length;

    // Get latest mental health scores
    const latestPHQ9 = screenings.find(s => s.screening_type === 'PHQ-9');
    const latestGAD7 = screenings.find(s => s.screening_type === 'GAD-7');

    // Sleep insights
    if (avgSleep < 6) {
      newInsights.push({
        type: 'negative',
        title: 'Sleep Deficit Detected',
        description: `Your average sleep of ${avgSleep.toFixed(1)} hours is below the recommended 7-9 hours. This may be impacting your mental clarity and mood.`,
        recommendation: 'Try establishing a consistent bedtime routine and aim for at least 7 hours of sleep.'
      });
    } else if (avgSleep >= 7) {
      newInsights.push({
        type: 'positive',
        title: 'Healthy Sleep Pattern',
        description: `Great job! You're averaging ${avgSleep.toFixed(1)} hours of sleep, which supports mental wellness.`,
        recommendation: 'Keep maintaining this healthy sleep schedule for optimal mental health.'
      });
    }

    // Exercise insights
    if (avgExercise < 20) {
      newInsights.push({
        type: 'negative',
        title: 'Low Physical Activity',
        description: `Your average of ${avgExercise.toFixed(0)} minutes of exercise daily is below recommendations. Regular exercise can reduce anxiety and depression symptoms.`,
        recommendation: 'Start with 15-minute walks and gradually increase to 30+ minutes daily.'
      });
    } else if (avgExercise >= 30) {
      newInsights.push({
        type: 'positive',
        title: 'Active Lifestyle',
        description: `You're averaging ${avgExercise.toFixed(0)} minutes of daily exercise. This significantly benefits your mental health!`,
        recommendation: 'Continue your active routine and consider adding variety for sustained motivation.'
      });
    }

    // Combined correlation insights
    if (latestPHQ9 && avgSleep < 6) {
      const depressionScore = (latestPHQ9.score / latestPHQ9.max_score) * 100;
      if (depressionScore > 40) {
        newInsights.push({
          type: 'negative',
          title: 'Sleep-Mood Connection',
          description: 'Your depression screening shows elevated scores, which may be linked to insufficient sleep patterns.',
          recommendation: 'Prioritize sleep as it directly impacts mood regulation and emotional resilience.'
        });
      }
    }

    if (latestGAD7 && avgExercise < 20) {
      const anxietyScore = (latestGAD7.score / latestGAD7.max_score) * 100;
      if (anxietyScore > 40) {
        newInsights.push({
          type: 'negative',
          title: 'Exercise-Anxiety Connection',
          description: 'Your anxiety levels appear elevated. Regular physical activity can help reduce stress hormones.',
          recommendation: 'Even light exercise like walking or yoga can significantly reduce anxiety symptoms.'
        });
      }
    }

    // Diet quality insight
    if (avgDiet < 3) {
      newInsights.push({
        type: 'negative',
        title: 'Nutrition Needs Attention',
        description: 'Your diet quality rating suggests room for improvement. Nutrition significantly impacts brain health and mood.',
        recommendation: 'Focus on whole foods, increase vegetable intake, and reduce processed foods.'
      });
    } else if (avgDiet >= 4) {
      newInsights.push({
        type: 'positive',
        title: 'Good Nutritional Habits',
        description: 'Your diet quality is supporting your mental wellness. Nutrition plays a key role in brain function.',
        recommendation: 'Maintain these healthy eating habits for continued mental clarity.'
      });
    }

    setInsights(newInsights);
  };

  // Prepare chart data
  const chartData = lifestyleLogs.map(log => ({
    date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleep: log.sleep_hours || 0,
    exercise: log.exercise_minutes || 0,
    diet: (log.diet_quality || 0) * 20, // Scale to 0-100
  }));

  const profileFields = [
    { label: 'Full Name', value: profile?.full_name, icon: User },
    { label: 'User Type', value: profile?.user_type, icon: Activity },
    { label: 'Mental State', value: profile?.mental_state, icon: Brain },
    { label: 'Onboarding', value: profile?.onboarding_completed ? 'Complete' : 'Pending', icon: CheckCircle },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile for personalized insights</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-primary">{profileCompletion}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profileFields.map((field, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    field.value ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {field.value ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm truncate">{field.label}</span>
                </div>
              ))}
            </div>
            {profileCompletion < 100 && (
              <Button 
                className="w-full mt-4" 
                variant="outline"
                onClick={() => navigate("/profile")}
              >
                Complete Your Profile
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Lifestyle Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Lifestyle Metrics
            </CardTitle>
            <CardDescription>Your recent lifestyle data affecting mental wellness</CardDescription>
          </CardHeader>
          <CardContent>
            {lifestyleLogs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-indigo-500/10 rounded-xl text-center">
                    <Moon className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {(lifestyleLogs.reduce((sum, l) => sum + (l.sleep_hours || 0), 0) / lifestyleLogs.length).toFixed(1)}h
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Sleep</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-xl text-center">
                    <Dumbbell className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(lifestyleLogs.reduce((sum, l) => sum + (l.exercise_minutes || 0), 0) / lifestyleLogs.length)}m
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Exercise</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-xl text-center">
                    <Apple className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {(lifestyleLogs.reduce((sum, l) => sum + (l.diet_quality || 0), 0) / lifestyleLogs.length).toFixed(1)}/5
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Diet</div>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-xl text-center">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(lifestyleLogs.reduce((sum, l) => sum + (l.water_intake_ml || 0), 0) / lifestyleLogs.length)}ml
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Water</div>
                  </div>
                </div>

                {/* Trend Chart */}
                {chartData.length > 3 && (
                  <div className="h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sleep" stroke="hsl(var(--primary))" strokeWidth={2} name="Sleep (hrs)" dot={false} />
                        <Line type="monotone" dataKey="exercise" stroke="hsl(var(--accent))" strokeWidth={2} name="Exercise (min)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No lifestyle data yet</p>
                <Button onClick={() => navigate("/mind-your-sleep")}>
                  Start Tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Self-Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Self-Insights
            </CardTitle>
            <CardDescription>
              Personalized correlations between your lifestyle and mental health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-xl border ${
                  insight.type === 'positive' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : insight.type === 'negative'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'positive' 
                      ? 'bg-green-500/20' 
                      : insight.type === 'negative'
                      ? 'bg-red-500/20'
                      : 'bg-muted'
                  }`}>
                    {insight.type === 'positive' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : insight.type === 'negative' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <Brain className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-medium text-foreground">{insight.recommendation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {insights.length === 0 && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Complete screenings and log lifestyle data to generate insights</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2"
          onClick={() => navigate("/secondary-care")}
        >
          <Brain className="h-6 w-6 text-primary" />
          <span>Take Screening</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2"
          onClick={() => navigate("/mind-your-sleep")}
        >
          <Moon className="h-6 w-6 text-indigo-500" />
          <span>Log Lifestyle</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default DemographicDashboard;
