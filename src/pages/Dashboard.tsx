import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Smile, ClipboardList, Stethoscope, HeartHandshake, TrendingUp, Award, Brain, Rocket, Shield, AlertTriangle, CheckCircle, Target, Download, ChevronRight, LayoutDashboard, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import ComplianceFooter from "@/components/ComplianceFooter";
import { useNeuralTrends } from "@/hooks/useNeuralTrends";
import BottomNav from "@/components/BottomNav";
import DemographicDashboard from "@/components/DemographicDashboard";

interface ScreeningResult {
  screening_type: string;
  score: number;
  max_score: number;
  severity: string | null;
  created_at: string;
}

interface RiskProfile {
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  factors: string[];
  protectiveFactors: string[];
  completedScreenings: number;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wellnessStats, setWellnessStats] = useState({
    mood_entries: 0,
    total_sessions: 0,
    current_streak: 0,
    meditation_minutes: 0
  });
  const [screeningCount, setScreeningCount] = useState(0);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const { trends: neuralTrends, loading: trendsLoading } = useNeuralTrends();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWellnessStats(session.user.id);
        fetchScreeningResults(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchWellnessStats(session.user.id);
          fetchScreeningResults(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (screeningResults.length > 0) {
      calculateRiskProfile();
    }
  }, [screeningResults]);

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

  const fetchScreeningResults = async (userId: string) => {
    const { data, error } = await supabase
      .from('screening_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching screening results:', error);
      return;
    }

    if (data) {
      setScreeningResults(data);
      setScreeningCount(data.length);
    }
  };

  const calculateRiskProfile = () => {
    const latestResults: Record<string, ScreeningResult> = {};
    screeningResults.forEach(result => {
      if (!latestResults[result.screening_type]) {
        latestResults[result.screening_type] = result;
      }
    });

    let totalRiskScore = 0;
    const factors: string[] = [];
    const protectiveFactors: string[] = [];
    let completedScreenings = 0;

    // PHQ-9 Analysis
    if (latestResults['PHQ-9']) {
      completedScreenings++;
      const score = latestResults['PHQ-9'].score;
      if (score >= 20) { totalRiskScore += 40; factors.push('Severe depression'); }
      else if (score >= 15) { totalRiskScore += 30; factors.push('Moderately severe depression'); }
      else if (score >= 10) { totalRiskScore += 20; factors.push('Moderate depression'); }
      else if (score >= 5) { totalRiskScore += 10; factors.push('Mild depression'); }
      else { protectiveFactors.push('Minimal depression'); }
    }

    // GAD-7 Analysis
    if (latestResults['GAD-7']) {
      completedScreenings++;
      const score = latestResults['GAD-7'].score;
      if (score >= 15) { totalRiskScore += 35; factors.push('Severe anxiety'); }
      else if (score >= 10) { totalRiskScore += 25; factors.push('Moderate anxiety'); }
      else if (score >= 5) { totalRiskScore += 15; factors.push('Mild anxiety'); }
      else { protectiveFactors.push('Minimal anxiety'); }
    }

    // WHO-5 Analysis
    if (latestResults['WHO-5']) {
      completedScreenings++;
      const percentScore = (latestResults['WHO-5'].score / 25) * 100;
      if (percentScore < 28) { totalRiskScore += 25; factors.push('Poor well-being'); }
      else if (percentScore < 50) { totalRiskScore += 15; factors.push('Below average well-being'); }
      else { protectiveFactors.push('Good well-being'); }
    }

    // Personality Analysis
    if (latestResults['Personality']) {
      completedScreenings++;
      protectiveFactors.push('Self-awareness through personality assessment');
    }

    let overallRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (totalRiskScore >= 70) overallRisk = 'critical';
    else if (totalRiskScore >= 45) overallRisk = 'high';
    else if (totalRiskScore >= 20) overallRisk = 'moderate';

    setRiskProfile({
      overallRisk,
      riskScore: Math.min(totalRiskScore, 100),
      factors,
      protectiveFactors,
      completedScreenings
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'moderate': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'default';
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
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

        {/* Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile & Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <DemographicDashboard />
          </TabsContent>

          <TabsContent value="overview">

        {/* Quick Action - Start Journey */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card 
            className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => navigate("/start-journey")}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Start Your Journey</h3>
                  <p className="text-sm text-muted-foreground">Take a personalized wellness assessment</p>
                </div>
              </div>
              <Button size="sm">Begin</Button>
            </CardContent>
          </Card>
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

        {/* Mental Health Risk Score Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Mental Health Risk Score</CardTitle>
                    <CardDescription>Based on PHQ-9, GAD-7, WHO-5 & Personality screenings</CardDescription>
                  </div>
                </div>
                {riskProfile && (
                  <Badge variant={getRiskBadgeVariant(riskProfile.overallRisk) as any}>
                    {riskProfile.overallRisk.toUpperCase()} RISK
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {riskProfile ? (
                <div className="space-y-6">
                  {/* Risk Score Visualization */}
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-28 h-28">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-muted"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r="48"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${(riskProfile.riskScore / 100) * 301} 301`}
                          className={getRiskColor(riskProfile.overallRisk)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold">{riskProfile.riskScore}</span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">{riskProfile.completedScreenings}/4</span> screenings completed
                      </div>
                      
                      {/* Individual Scale Progress */}
                      <div className="grid grid-cols-2 gap-2">
                        {['PHQ-9', 'GAD-7', 'WHO-5', 'Personality'].map(scale => {
                          const result = screeningResults.find(r => r.screening_type === scale);
                          return (
                            <div key={scale} className="flex items-center gap-2 text-xs">
                              {result ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : (
                                <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                              )}
                              <span className={result ? 'text-foreground' : 'text-muted-foreground'}>{scale}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Risk & Protective Factors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {riskProfile.factors.length > 0 && (
                      <div className="p-3 bg-red-500/10 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Risk Factors
                        </h4>
                        <ul className="space-y-1">
                          {riskProfile.factors.slice(0, 3).map((factor, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {riskProfile.protectiveFactors.length > 0 && (
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Protective Factors
                        </h4>
                        <ul className="space-y-1">
                          {riskProfile.protectiveFactors.slice(0, 3).map((factor, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground">• {factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={() => navigate('/mind-plan')} className="flex-1 gap-2">
                      <Target className="h-4 w-4" />
                      Create Risk-Based Plan
                    </Button>
                    <Button onClick={() => navigate('/secondary-care')} variant="outline" className="flex-1 gap-2">
                      <ClipboardList className="h-4 w-4" />
                      Complete More Screenings
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">No Screenings Completed</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete screening assessments to generate your mental health risk score
                  </p>
                  <Button onClick={() => navigate('/secondary-care')} className="gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Start Screening
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

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

        {/* Neural Fingerprinting Trends */}
        {neuralTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8"
          >
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Neural Fingerprinting Trends
                </CardTitle>
                <CardDescription>Your mental health vulnerability over time</CardDescription>
              </CardHeader>
              <CardContent>
                {trendsLoading ? (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading trends...</p>
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      vulnerabilityScore: {
                        label: "Vulnerability Score",
                        color: "hsl(var(--primary))",
                      },
                    }}
                    className="h-80"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={neuralTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="vulnerabilityScore"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: "hsl(var(--primary))", r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
          </TabsContent>
        </Tabs>
      </div>
      <ComplianceFooter />
      <BottomNav />
    </div>
  );
};

export default Dashboard;
