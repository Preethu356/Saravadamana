import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Sparkles, Plus, Calendar, TrendingUp, Award, Target, Heart, Brain, Activity, BookOpen, Shield, AlertTriangle, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Watermark from "@/components/Watermark";
import PageNavigation from "@/components/PageNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";

const wellnessActivities = [
  { id: "meditation", label: "Daily Meditation (10-15 min)", category: "Mindfulness", icon: "🧘" },
  { id: "exercise", label: "Physical Exercise (30 min)", category: "Physical Health", icon: "🏃" },
  { id: "journaling", label: "Reflective Journaling", category: "Self-Reflection", icon: "📝" },
  { id: "sleep", label: "Consistent Sleep Schedule", category: "Rest", icon: "😴" },
  { id: "nutrition", label: "Balanced Nutrition", category: "Physical Health", icon: "🥗" },
  { id: "social", label: "Social Connection", category: "Relationships", icon: "👥" },
  { id: "breathing", label: "Breathing Exercises", category: "Mindfulness", icon: "💨" },
  { id: "hobby", label: "Engage in Hobbies", category: "Joy", icon: "🎨" },
  { id: "nature", label: "Time in Nature", category: "Environment", icon: "🌳" },
  { id: "gratitude", label: "Gratitude Practice", category: "Positive Thinking", icon: "🙏" },
];

interface MindPlanData {
  id: string;
  title: string;
  interventions: any;
  duration_days: number;
  current_day: number;
  streak_count: number;
  created_at: string;
  updated_at: string;
}

interface AssessmentData {
  depression?: { score: number; severity: string; date: string };
  anxiety?: { score: number; severity: string; date: string };
  sleep?: { psqi_score: number; quality: number; date: string };
  nutrition?: { plan_type: string; date: string };
  exercise?: { plan_type: string; completed: number; date: string };
  personality?: { 
    archetype: string; 
    position: number; 
    date: string;
    clusterA?: number;
    clusterB?: number;
    clusterC?: number;
    growthAreas?: string[];
    strengths?: string[];
  };
}

interface RiskProfile {
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  factors: string[];
  protectiveFactors: string[];
}

interface ScreeningResult {
  screening_type: string;
  score: number;
  max_score: number;
  severity: string | null;
}

const MindPlan = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingAIPlan, setGeneratingAIPlan] = useState(false);
  const [plans, setPlans] = useState<MindPlanData[]>([]);
  const [assessments, setAssessments] = useState<AssessmentData>({});
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [userId, setUserId] = useState<string>("");
  const navigate = useNavigate();

  // New plan form state
  const [planTitle, setPlanTitle] = useState("");
  const [planGoals, setPlanGoals] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [duration, setDuration] = useState("21");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUserId(user.id);

      // Fetch existing plans
      const { data: plansData, error: plansError } = await supabase
        .from("mind_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch all screening results for risk calculation
      const { data: screeningData } = await supabase
        .from("screening_results")
        .select("screening_type, score, max_score, severity")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (screeningData) {
        setScreeningResults(screeningData);
        calculateRiskProfile(screeningData);
      }

      // Fetch assessment data
      await fetchAssessments(user.id);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load your data");
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskProfile = (results: ScreeningResult[]) => {
    const latestResults: Record<string, ScreeningResult> = {};
    results.forEach(result => {
      if (!latestResults[result.screening_type]) {
        latestResults[result.screening_type] = result;
      }
    });

    let totalRiskScore = 0;
    const factors: string[] = [];
    const protectiveFactors: string[] = [];

    // PHQ-9 Analysis
    if (latestResults['PHQ-9']) {
      const score = latestResults['PHQ-9'].score;
      if (score >= 20) { totalRiskScore += 40; factors.push('Severe depression'); }
      else if (score >= 15) { totalRiskScore += 30; factors.push('Moderately severe depression'); }
      else if (score >= 10) { totalRiskScore += 20; factors.push('Moderate depression'); }
      else if (score >= 5) { totalRiskScore += 10; factors.push('Mild depression'); }
      else { protectiveFactors.push('Minimal depression'); }
    }

    // GAD-7 Analysis
    if (latestResults['GAD-7']) {
      const score = latestResults['GAD-7'].score;
      if (score >= 15) { totalRiskScore += 35; factors.push('Severe anxiety'); }
      else if (score >= 10) { totalRiskScore += 25; factors.push('Moderate anxiety'); }
      else if (score >= 5) { totalRiskScore += 15; factors.push('Mild anxiety'); }
      else { protectiveFactors.push('Minimal anxiety'); }
    }

    // WHO-5 Analysis
    if (latestResults['WHO-5']) {
      const percentScore = (latestResults['WHO-5'].score / 25) * 100;
      if (percentScore < 28) { totalRiskScore += 25; factors.push('Poor well-being'); }
      else if (percentScore < 50) { totalRiskScore += 15; factors.push('Below average well-being'); }
      else { protectiveFactors.push('Good well-being'); }
    }

    let overallRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (totalRiskScore >= 70) overallRisk = 'critical';
    else if (totalRiskScore >= 45) overallRisk = 'high';
    else if (totalRiskScore >= 20) overallRisk = 'moderate';

    setRiskProfile({
      overallRisk,
      riskScore: Math.min(totalRiskScore, 100),
      factors,
      protectiveFactors
    });
  };

  const generateAIWellnessPlan = async () => {
    if (!riskProfile) {
      toast.error("Please complete screenings first");
      return;
    }

    setGeneratingAIPlan(true);
    
    try {
      const latestResults: Record<string, number> = {};
      screeningResults.forEach(r => {
        if (!latestResults[r.screening_type]) {
          latestResults[r.screening_type] = r.score;
        }
      });

      const response = await supabase.functions.invoke('generate-wellness-plan', {
        body: {
          goals: ["Improve mental health", "Build resilience", "Reduce stress"],
          availableTime: 60,
          stressLevel: riskProfile.overallRisk === 'critical' ? 9 : 
                       riskProfile.overallRisk === 'high' ? 7 : 
                       riskProfile.overallRisk === 'moderate' ? 5 : 3,
          preferences: "Evidence-based interventions tailored to my risk profile",
          riskScore: riskProfile.riskScore,
          riskLevel: riskProfile.overallRisk,
          riskFactors: riskProfile.factors,
          protectiveFactors: riskProfile.protectiveFactors,
          screeningResults: {
            phq9: latestResults['PHQ-9'],
            gad7: latestResults['GAD-7'],
            who5: latestResults['WHO-5'],
            personality: assessments.personality?.archetype
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to generate plan');
      }

      const plan = response.data;

      // Save the AI-generated plan
      const { error: saveError } = await supabase.from("mind_plans").insert({
        user_id: userId,
        title: plan.title || `AI Wellness Plan - ${riskProfile.overallRisk.toUpperCase()} Risk`,
        interventions: {
          goals: plan.description,
          activities: plan.daily_routine?.map((r: any) => ({
            id: r.activity.toLowerCase().replace(/\s+/g, '-'),
            label: r.activity,
            category: r.time,
            icon: "🎯",
            duration: r.duration,
            description: r.description
          })) || [],
          recommendations: plan.tips || [],
          weeklySchedule: plan.weekly_schedule,
          professionalSupport: plan.professional_support,
          assessmentSummary: {
            riskScore: riskProfile.riskScore,
            riskLevel: riskProfile.overallRisk,
            factors: riskProfile.factors
          }
        },
        duration_days: 21,
        current_day: 1,
        streak_count: 0,
      });

      if (saveError) throw saveError;

      toast.success("AI Wellness Plan generated and saved!");
      await fetchUserData();
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Error generating AI plan:", error);
      toast.error("Failed to generate AI plan. Please try again.");
    } finally {
      setGeneratingAIPlan(false);
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

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'moderate': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  const fetchAssessments = async (uid: string) => {
    try {
      const assessmentData: AssessmentData = {};

      // Fetch depression screening
      const { data: depression } = await supabase
        .from("screening_results")
        .select("*")
        .eq("user_id", uid)
        .eq("screening_type", "depression")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (depression) {
        assessmentData.depression = {
          score: depression.score,
          severity: depression.severity || "Unknown",
          date: new Date(depression.created_at).toLocaleDateString(),
        };
      }

      // Fetch anxiety screening
      const { data: anxiety } = await supabase
        .from("screening_results")
        .select("*")
        .eq("user_id", uid)
        .eq("screening_type", "anxiety")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (anxiety) {
        assessmentData.anxiety = {
          score: anxiety.score,
          severity: anxiety.severity || "Unknown",
          date: new Date(anxiety.created_at).toLocaleDateString(),
        };
      }

      // Fetch sleep data
      const { data: sleep } = await supabase
        .from("sleep_routines")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (sleep) {
        assessmentData.sleep = {
          psqi_score: sleep.psqi_score || 0,
          quality: sleep.sleep_quality_rating || 0,
          date: new Date(sleep.created_at).toLocaleDateString(),
        };
      }

      // Fetch personality with cluster scores
      const { data: personality } = await supabase
        .from("personality_results")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (personality) {
        // Parse cluster scores from archetype or metadata if stored
        const clusterData = personality.archetype ? {
          clusterA: 0,
          clusterB: 0,
          clusterC: 0
        } : undefined;

        assessmentData.personality = {
          archetype: personality.archetype,
          position: personality.position_score,
          date: new Date(personality.created_at).toLocaleDateString(),
          growthAreas: personality.growth_areas || [],
          strengths: personality.strengths || [],
          ...clusterData
        };
      }

      setAssessments(assessmentData);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const generateAIRecommendations = () => {
    const recommendations: string[] = [];

    // Recommendations based on screening results
    if (assessments.depression && assessments.depression.score >= 10) {
      recommendations.push("Daily mood tracking and journaling for depression management");
      recommendations.push("Behavioral activation: Schedule pleasant activities daily");
    }

    if (assessments.anxiety && assessments.anxiety.score >= 10) {
      recommendations.push("Progressive muscle relaxation exercises (15 min daily)");
      recommendations.push("Mindfulness-based stress reduction techniques");
    }

    if (assessments.sleep && assessments.sleep.psqi_score > 5) {
      recommendations.push("Establish consistent sleep-wake schedule");
      recommendations.push("Sleep hygiene improvements and relaxation routine");
    }

    if (assessments.personality) {
      if (assessments.personality.growthAreas && assessments.personality.growthAreas.length > 0) {
        recommendations.push(`Focus areas: ${assessments.personality.growthAreas.join(", ")}`);
      }
      if (assessments.personality.clusterA && assessments.personality.clusterA > 15) {
        recommendations.push("Social skills training and trust-building exercises");
      }
      if (assessments.personality.clusterB && assessments.personality.clusterB > 15) {
        recommendations.push("Emotion regulation strategies and DBT skills practice");
      }
      if (assessments.personality.clusterC && assessments.personality.clusterC > 15) {
        recommendations.push("Exposure therapy and anxiety management techniques");
      }
    }

    return recommendations.length > 0 ? recommendations : ["Continue with general wellness activities"];
  };

  const savePlan = async () => {
    if (!planTitle.trim()) {
      toast.error("Please enter a plan title");
      return;
    }

    if (!planGoals.trim()) {
      toast.error("Please describe your wellness goals");
      return;
    }

    if (selectedActivities.length === 0) {
      toast.error("Please select at least one activity");
      return;
    }

    setSaving(true);

    try {
      const interventions = selectedActivities.map((activityId) => {
        const activity = wellnessActivities.find((a) => a.id === activityId);
        return {
          id: activityId,
          label: activity?.label || "",
          category: activity?.category || "",
          icon: activity?.icon || "",
        };
      });

      // Generate AI recommendations based on all assessments
      const aiRecommendations = generateAIRecommendations();

      const { error } = await supabase.from("mind_plans").insert({
        user_id: userId,
        title: planTitle,
        interventions: { 
          goals: planGoals, 
          activities: interventions,
          recommendations: aiRecommendations,
          assessmentSummary: {
            depression: assessments.depression?.score,
            anxiety: assessments.anxiety?.score,
            sleep: assessments.sleep?.psqi_score,
            personality: assessments.personality?.archetype
          }
        },
        duration_days: parseInt(duration),
        current_day: 1,
        streak_count: 0,
      });

      if (error) throw error;

      toast.success("Mind Plan saved with personalized recommendations!");
      
      // Reset form
      setPlanTitle("");
      setPlanGoals("");
      setSelectedActivities([]);
      setDuration("21");
      
      // Refresh plans
      await fetchUserData();
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Error saving plan:", error);
      toast.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = (plan: MindPlanData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(88, 86, 214);
    doc.text(plan.title, pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Created: ${new Date(plan.created_at).toLocaleDateString()}`, margin, yPosition);
    doc.text(`Duration: ${plan.duration_days} days`, pageWidth - margin, yPosition, { align: "right" });
    
    yPosition += 10;
    doc.text(`Progress: Day ${plan.current_day} of ${plan.duration_days}`, margin, yPosition);
    doc.text(`Streak: ${plan.streak_count} days`, pageWidth - margin, yPosition, { align: "right" });
    
    yPosition += 15;

    // Assessment Summary
    if (plan.interventions.assessmentSummary) {
      doc.setFontSize(16);
      doc.setTextColor(88, 86, 214);
      doc.text("Assessment Summary", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      const summary = plan.interventions.assessmentSummary;
      if (summary.depression) doc.text(`Depression Score: ${summary.depression}`, margin + 5, yPosition), yPosition += 6;
      if (summary.anxiety) doc.text(`Anxiety Score: ${summary.anxiety}`, margin + 5, yPosition), yPosition += 6;
      if (summary.sleep) doc.text(`Sleep Quality (PSQI): ${summary.sleep}`, margin + 5, yPosition), yPosition += 6;
      if (summary.personality) doc.text(`Personality: ${summary.personality}`, margin + 5, yPosition), yPosition += 6;
      yPosition += 10;
    }

    // AI Recommendations
    if (plan.interventions.recommendations && plan.interventions.recommendations.length > 0) {
      doc.setFontSize(16);
      doc.setTextColor(88, 86, 214);
      doc.text("Personalized Recommendations", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      plan.interventions.recommendations.forEach((rec: string, idx: number) => {
        const recLines = doc.splitTextToSize(`${idx + 1}. ${rec}`, pageWidth - 2 * margin - 10);
        doc.text(recLines, margin + 5, yPosition);
        yPosition += recLines.length * 5 + 3;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      yPosition += 10;
    }

    // Goals Section
    if (plan.interventions.goals) {
      doc.setFontSize(16);
      doc.setTextColor(88, 86, 214);
      doc.text("My Wellness Goals", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const goalLines = doc.splitTextToSize(plan.interventions.goals, pageWidth - 2 * margin);
      doc.text(goalLines, margin, yPosition);
      yPosition += goalLines.length * 6 + 15;
    }

    // Activities
    if (plan.interventions.activities) {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(88, 86, 214);
      doc.text("My Daily Wellness Activities", margin, yPosition);
      yPosition += 10;

      plan.interventions.activities.forEach((activity: any) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`${activity.icon} ${activity.label}`, margin + 5, yPosition);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`(${activity.category})`, margin + 10, yPosition + 5);
        
        yPosition += 12;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    doc.save(`mind-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Plan downloaded as PDF!");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "minimal":
      case "none":
        return "bg-green-500";
      case "mild":
        return "bg-yellow-500";
      case "moderate":
        return "bg-orange-500";
      case "severe":
      case "moderately severe":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <Watermark />
        <div className="container mx-auto px-4 py-8 relative z-10">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-32 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Watermark />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              My Mind Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Create and track personalized mental wellness plans tailored to your needs
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="dashboard" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="assessments" className="gap-2">
                <Brain className="h-4 w-4" />
                Assessments
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {plans.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Plans Yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first Mind Plan to start your wellness journey
                    </p>
                    <Button onClick={() => setActiveTab("create")} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Your First Plan
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{plan.title}</CardTitle>
                            <CardDescription className="mt-2">
                              Created {new Date(plan.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Calendar className="h-3 w-3" />
                            {plan.duration_days} days
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Day {plan.current_day} of {plan.duration_days}</span>
                            <span className="font-semibold">
                              {Math.round((plan.current_day / plan.duration_days) * 100)}%
                            </span>
                          </div>
                          <Progress value={(plan.current_day / plan.duration_days) * 100} />
                        </div>

                        {/* Streak */}
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{plan.streak_count} day streak</span>
                        </div>

                        {/* Activities */}
                        <div>
                          <p className="text-sm font-semibold mb-2">Activities:</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.interventions.activities?.slice(0, 3).map((activity: any, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {activity.icon} {activity.label.split(" ")[0]}
                              </Badge>
                            ))}
                            {plan.interventions.activities?.length > 3 && (
                              <Badge variant="outline">
                                +{plan.interventions.activities.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={() => generatePDF(plan)}
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Depression Assessment */}
                {assessments.depression && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Depression Screening
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Score:</span>
                          <Badge className={getSeverityColor(assessments.depression.severity)}>
                            {assessments.depression.score} - {assessments.depression.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Assessed on {assessments.depression.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Anxiety Assessment */}
                {assessments.anxiety && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-500" />
                        Anxiety Screening
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Score:</span>
                          <Badge className={getSeverityColor(assessments.anxiety.severity)}>
                            {assessments.anxiety.score} - {assessments.anxiety.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Assessed on {assessments.anxiety.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Sleep Assessment */}
                {assessments.sleep && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        😴 Sleep Quality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">PSQI Score:</span>
                          <Badge variant="secondary">{assessments.sleep.psqi_score}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Quality:</span>
                          <span className="text-sm font-semibold">
                            {assessments.sleep.quality}/10
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Assessed on {assessments.sleep.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Personality */}
                {assessments.personality && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Personality Screening
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Archetype:</span>
                          <Badge variant="secondary">
                            {assessments.personality.archetype}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Position:</span>
                          <Badge variant="outline">
                            {assessments.personality.position}
                          </Badge>
                        </div>
                        {assessments.personality.strengths && assessments.personality.strengths.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-semibold mb-1">Strengths:</p>
                            <div className="flex flex-wrap gap-1">
                              {assessments.personality.strengths.map((strength, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-green-50">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {assessments.personality.growthAreas && assessments.personality.growthAreas.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-semibold mb-1">Growth Areas:</p>
                            <div className="flex flex-wrap gap-1">
                              {assessments.personality.growthAreas.map((area, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-yellow-50">
                                  {area}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Assessed on {assessments.personality.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {Object.keys(assessments).length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="py-12 text-center">
                      <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">No Assessments Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete screenings to get personalized recommendations
                      </p>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button variant="outline" onClick={() => navigate("/depression-screening")}>
                          Depression Screening
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/anxiety-screening")}>
                          Anxiety Screening
                        </Button>
                        <Button variant="outline" onClick={() => navigate("/mind-your-sleep")}>
                          Sleep Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {(Object.keys(assessments).length > 0 || riskProfile) && (
                <>
                  {/* Risk-Based AI Plan Generation */}
                  <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>Risk-Based AI Wellness Plan</CardTitle>
                            <CardDescription>
                              Generate a personalized plan based on your screening results
                            </CardDescription>
                          </div>
                        </div>
                        {riskProfile && (
                          <Badge variant={getRiskBadgeVariant(riskProfile.overallRisk) as any}>
                            {riskProfile.overallRisk.toUpperCase()} RISK
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {riskProfile ? (
                        <>
                          {/* Risk Score Visualization */}
                          <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24">
                              <svg className="w-24 h-24 transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                                  strokeDasharray={`${(riskProfile.riskScore / 100) * 251} 251`}
                                  className={getRiskColor(riskProfile.overallRisk)}
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold">{riskProfile.riskScore}</span>
                                <span className="text-xs text-muted-foreground">/100</span>
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                {riskProfile.factors.length > 0 && (
                                  <div className="p-2 bg-red-500/10 rounded-lg">
                                    <p className="text-xs font-medium flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3 text-red-500" />
                                      Risk Factors
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{riskProfile.factors.slice(0, 2).join(', ')}</p>
                                  </div>
                                )}
                                {riskProfile.protectiveFactors.length > 0 && (
                                  <div className="p-2 bg-green-500/10 rounded-lg">
                                    <p className="text-xs font-medium flex items-center gap-1">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      Protective
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">{riskProfile.protectiveFactors.slice(0, 2).join(', ')}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={generateAIWellnessPlan}
                            className="w-full gap-2"
                            disabled={generatingAIPlan}
                          >
                            {generatingAIPlan ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Generating AI Plan...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" />
                                Generate AI Wellness Plan
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <Brain className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground mb-3">
                            Complete screenings to generate risk-based recommendations
                          </p>
                          <Button variant="outline" onClick={() => navigate('/secondary-care')} className="gap-2">
                            Complete Screenings
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI-Powered Recommendations
                      </CardTitle>
                      <CardDescription>
                        Based on your comprehensive assessment results
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {assessments.depression && assessments.depression.score >= 10 && (
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-500" />
                              Depression Support
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Daily mood tracking, behavioral activation, and social connection activities recommended
                            </p>
                          </div>
                        )}
                        
                        {assessments.anxiety && assessments.anxiety.score >= 10 && (
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-blue-500" />
                              Anxiety Management
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Progressive muscle relaxation, mindfulness-based stress reduction, and breathing exercises
                            </p>
                          </div>
                        )}

                        {assessments.sleep && assessments.sleep.psqi_score > 5 && (
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Activity className="h-4 w-4 text-purple-500" />
                              Sleep Improvement
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Consistent sleep-wake schedule and relaxation routine needed
                            </p>
                          </div>
                        )}

                        {assessments.personality && assessments.personality.growthAreas && assessments.personality.growthAreas.length > 0 && (
                          <div className="p-3 rounded-lg bg-background/50">
                            <p className="text-sm font-medium mb-1 flex items-center gap-2">
                              <Brain className="h-4 w-4 text-orange-500" />
                              Personality Development
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Focus on: {assessments.personality.growthAreas.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Link to Mind Reflection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Mind Reflection Journal
                      </CardTitle>
                      <CardDescription>
                        Document your wellness journey and track personal growth
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => navigate("/mind-reflection")}
                      >
                        <BookOpen className="h-4 w-4" />
                        Open Reflection Journal
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Create Plan Tab */}
            <TabsContent value="create" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Plan Details</CardTitle>
                  <CardDescription>
                    Give your plan a name and set your wellness goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="planTitle">Plan Title</Label>
                    <Input
                      id="planTitle"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      placeholder="e.g., My 21-Day Wellness Journey"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Plan Duration</Label>
                    <select
                      id="duration"
                      className="w-full mt-2 px-4 py-2 border border-border rounded-lg bg-background"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    >
                      <option value="7">7 Days</option>
                      <option value="14">14 Days</option>
                      <option value="21">21 Days</option>
                      <option value="30">30 Days</option>
                      <option value="60">60 Days</option>
                      <option value="90">90 Days</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="planGoals">Your Wellness Goals</Label>
                    <Textarea
                      id="planGoals"
                      value={planGoals}
                      onChange={(e) => setPlanGoals(e.target.value)}
                      placeholder="Describe what you hope to achieve with this wellness plan..."
                      className="mt-2 min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Select Your Daily Activities
                  </CardTitle>
                  <CardDescription>
                    Choose activities you commit to practicing regularly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wellnessActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                      >
                        <Checkbox
                          id={activity.id}
                          checked={selectedActivities.includes(activity.id)}
                          onCheckedChange={() => toggleActivity(activity.id)}
                        />
                        <label htmlFor={activity.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 font-medium">
                            <span>{activity.icon}</span>
                            <span>{activity.label}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {activity.category}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button
                  onClick={savePlan}
                  size="lg"
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Save Mind Plan
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};

export default MindPlan;