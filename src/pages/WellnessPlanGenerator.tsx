import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageNavigation from "@/components/PageNavigation";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Clock, Target, Calendar, Lightbulb, Save, Loader2, Activity, Brain, Moon, Apple, Dumbbell, CloudSun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AssessmentData {
  screeningResults: any[];
  personalityResults: any[];
  sleepRoutines: any[];
  nutritionPlans: any[];
  exercisePlans: any[];
  environmentSnapshots: any[];
}

const WellnessPlanGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [goals, setGoals] = useState("");
  const [availableTime, setAvailableTime] = useState([30]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [preferences, setPreferences] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    screeningResults: [],
    personalityResults: [],
    sleepRoutines: [],
    nutritionPlans: [],
    exercisePlans: [],
    environmentSnapshots: []
  });

  useEffect(() => {
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setIsLoadingReports(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const [screening, personality, sleep, nutrition, exercise, environment] = await Promise.all([
        supabase.from("screening_results").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(10),
        supabase.from("personality_results").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("sleep_routines").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("nutrition_plans").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("exercise_plans").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("environment_snapshots").select("*").eq("user_id", userData.user.id).order("created_at", { ascending: false }).limit(5)
      ]);

      setAssessmentData({
        screeningResults: screening.data || [],
        personalityResults: personality.data || [],
        sleepRoutines: sleep.data || [],
        nutritionPlans: nutrition.data || [],
        exercisePlans: exercise.data || [],
        environmentSnapshots: environment.data || []
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  const generatePlan = async () => {
    if (!goals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one wellness goal",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to generate wellness plans",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-wellness-plan", {
        body: {
          goals: goals.split(',').map(g => g.trim()),
          availableTime: availableTime[0],
          stressLevel: stressLevel[0],
          preferences: preferences || "No specific preferences"
        }
      });

      if (error) throw error;

      setGeneratedPlan(data);
      toast({
        title: "Plan Generated!",
        description: "Your personalized wellness plan is ready",
      });
    } catch (error: any) {
      console.error("Error generating plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate wellness plan",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan) return;

    setIsSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("wellness_plans").insert({
        user_id: userData.user.id,
        title: generatedPlan.title,
        description: generatedPlan.description,
        goals: goals.split(',').map(g => g.trim()),
        daily_routine: generatedPlan.daily_routine,
        weekly_schedule: generatedPlan.weekly_schedule
      });

      if (error) throw error;

      toast({
        title: "Plan Saved!",
        description: "Your wellness plan has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error saving plan:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save wellness plan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "minimal": return "text-green-600";
      case "mild": return "text-yellow-600";
      case "moderate": return "text-orange-600";
      case "severe": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              My Mind Plan
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            View your assessment reports and create personalized wellness plans
          </p>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="reports">Assessment Reports</TabsTrigger>
            <TabsTrigger value="generator">Generate Plan</TabsTrigger>
          </TabsList>

          {/* Assessment Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Screening Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Mental Health Screenings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.screeningResults.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.screeningResults.map((result) => (
                          <div key={result.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{result.screening_type}</span>
                              <Badge variant="secondary">{result.score}/{result.max_score}</Badge>
                            </div>
                            {result.severity && (
                              <p className={`text-xs font-medium ${getSeverityColor(result.severity)}`}>
                                {result.severity}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No screening results yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Personality Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-orange-500" />
                      Mind Reflection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.personalityResults.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.personalityResults.map((result) => (
                          <div key={result.id} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-semibold text-sm mb-2">{result.archetype}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-muted-foreground">Position:</span>
                              <Badge variant="outline">{result.position_score}/100</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(result.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No personality results yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Sleep Routines */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-purple-500" />
                      Mind Your Sleep
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.sleepRoutines.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.sleepRoutines.map((routine) => (
                          <div key={routine.id} className="p-3 bg-muted/50 rounded-lg">
                            {routine.psqi_score && (
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">PSQI Score:</span>
                                <Badge variant="secondary">{routine.psqi_score}</Badge>
                              </div>
                            )}
                            {routine.sleep_quality_rating && (
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">Quality:</span>
                                <Badge variant="outline">{routine.sleep_quality_rating}/10</Badge>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {new Date(routine.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No sleep routines yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Nutrition Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="w-5 h-5 text-green-500" />
                      Mind Your Diet
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.nutritionPlans.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.nutritionPlans.map((plan) => (
                          <div key={plan.id} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-semibold text-sm mb-1">{plan.title}</p>
                            <Badge variant="secondary" className="mb-2">{plan.plan_type}</Badge>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{plan.completed_days}/{plan.total_days} days</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(plan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No nutrition plans yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Exercise Plans */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-blue-500" />
                      Mind Your Gym
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.exercisePlans.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.exercisePlans.map((plan) => (
                          <div key={plan.id} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-semibold text-sm mb-1">{plan.title}</p>
                            <Badge variant="secondary" className="mb-2">{plan.plan_type}</Badge>
                            <div className="text-xs text-muted-foreground">
                              <p>Sessions: {plan.completed_sessions}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(plan.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No exercise plans yet</p>
                    )}
                  </CardContent>
                </Card>

                {/* Environment Snapshots */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CloudSun className="w-5 h-5 text-cyan-500" />
                      Mind Climate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assessmentData.environmentSnapshots.length > 0 ? (
                      <div className="space-y-3">
                        {assessmentData.environmentSnapshots.map((snapshot) => (
                          <div key={snapshot.id} className="p-3 bg-muted/50 rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                              <div>
                                <span className="text-muted-foreground">Temp:</span> {snapshot.temperature}°C
                              </div>
                              <div>
                                <span className="text-muted-foreground">AQI:</span> {snapshot.aqi}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(snapshot.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No climate data yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Plan Generator Tab */}
          <TabsContent value="generator">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Preferences</CardTitle>
                  <CardDescription>Tell us about your wellness goals and lifestyle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="goals" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Wellness Goals (comma-separated)
                    </Label>
                    <Textarea
                      id="goals"
                      placeholder="e.g., Reduce stress, Improve sleep, Build resilience"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Available Time per Day: {availableTime[0]} minutes
                    </Label>
                    <Slider
                      value={availableTime}
                      onValueChange={setAvailableTime}
                      min={10}
                      max={120}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Current Stress Level: {stressLevel[0]}/10
                    </Label>
                    <Slider
                      value={stressLevel}
                      onValueChange={setStressLevel}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferences">Additional Preferences (optional)</Label>
                    <Textarea
                      id="preferences"
                      placeholder="e.g., Prefer morning activities, enjoy meditation, need guidance"
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Generating Your Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Wellness Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Plan */}
              <div className="space-y-6">
                {generatedPlan ? (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl">{generatedPlan.title}</CardTitle>
                            <CardDescription className="mt-2">{generatedPlan.description}</CardDescription>
                          </div>
                          <Button onClick={savePlan} disabled={isSaving} variant="outline" size="sm">
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Daily Routine */}
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-primary" />
                            Daily Routine
                          </h3>
                          <div className="space-y-3">
                            {generatedPlan.daily_routine.map((item: any, index: number) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{item.time}</span>
                                  <Badge variant="secondary">{item.duration} min</Badge>
                                </div>
                                <p className="font-semibold text-sm">{item.activity}</p>
                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Weekly Schedule */}
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <Calendar className="w-5 h-5 text-primary" />
                            Weekly Focus
                          </h3>
                          <div className="space-y-2">
                            {generatedPlan.weekly_schedule.map((day: any, index: number) => (
                              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-sm">{day.day}</span>
                                  <span className="text-xs text-muted-foreground">• {day.focus}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {day.activities.map((activity: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {activity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Tips */}
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            Tips for Success
                          </h3>
                          <ul className="space-y-2">
                            {generatedPlan.tips.map((tip: string, index: number) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill in your preferences and click "Generate Wellness Plan" to create your personalized routine
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <PageNavigation />
    </div>
  );
};

export default WellnessPlanGenerator;
