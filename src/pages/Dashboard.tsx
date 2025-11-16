import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Smile, ClipboardList, Stethoscope, HeartHandshake, TrendingUp, Award, Brain } from "lucide-react";
import { motion } from "framer-motion";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wellnessStats, setWellnessStats] = useState({
    mood_entries: 0,
    total_sessions: 0,
    current_streak: 0,
    meditation_minutes: 0
  });
  const [screeningCount, setScreeningCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWellnessStats(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchWellnessStats(session.user.id);
          fetchScreeningProgress(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchWellnessStats = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_wellness_stats')
      .select('mood_entries, total_sessions, current_streak, meditation_minutes')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching wellness stats:', error);
      return;
    }

    if (data) {
      setWellnessStats(data);
    }
  };

  const fetchScreeningProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('screening_results')
      .select('id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching screening progress:', error);
      return;
    }

    if (data) {
      setScreeningCount(data.length);
    }
  };

  const progressCards = [
    {
      title: "Mind Sequencing",
      description: "Personalized mental wellness interventions",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      progress: 0,
      count: 0,
      goal: 1,
      action: () => navigate("/mind-sequencing")
    },
    {
      title: "Mood Tracking",
      description: "Track your daily emotional wellness",
      icon: Smile,
      color: "from-yellow-500 to-orange-500",
      progress: Math.min((wellnessStats.mood_entries / 30) * 100, 100),
      count: wellnessStats.mood_entries,
      goal: 30,
      action: () => navigate("/mood-tracker")
    },
    {
      title: "Screening",
      description: "Complete mental health assessments",
      icon: ClipboardList,
      color: "from-blue-500 to-cyan-500",
      progress: Math.min((screeningCount / 5) * 100, 100),
      count: screeningCount,
      goal: 5,
      action: () => navigate("/secondary-care")
    },
    {
      title: "Diagnosis Support",
      description: "Access professional mental health care",
      icon: Stethoscope,
      color: "from-green-500 to-emerald-500",
      progress: 0,
      count: 0,
      goal: 1,
      action: () => navigate("/tertiary-care")
    },
    {
      title: "Community",
      description: "Connect with support groups",
      icon: HeartHandshake,
      color: "from-pink-500 to-rose-500",
      progress: 0,
      count: 0,
      goal: 1,
      action: () => navigate("/resources")
    }
  ];

  const getFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Hello, {getFirstName()}!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Welcome to your mental wellness journey
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                    <p className="text-3xl font-bold text-primary">{wellnessStats.current_streak}</p>
                    <p className="text-xs text-muted-foreground">days</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                    <p className="text-3xl font-bold text-secondary">{wellnessStats.total_sessions}</p>
                    <p className="text-xs text-muted-foreground">completed</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Meditation Time</p>
                    <p className="text-3xl font-bold text-accent">{wellnessStats.meditation_minutes}</p>
                    <p className="text-xs text-muted-foreground">minutes</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <Smile className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={card.action}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{card.title}</CardTitle>
                          <CardDescription className="text-sm">{card.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">
                          {card.count} / {card.goal}
                        </span>
                      </div>
                      <Progress value={card.progress} className="h-3" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {Math.round(card.progress)}% complete
                        </span>
                        <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                          Continue →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Dashboard;
