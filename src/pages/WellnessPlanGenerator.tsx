import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageNavigation from "@/components/PageNavigation";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Clock, Target, Calendar, Lightbulb, Save, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const WellnessPlanGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [goals, setGoals] = useState("");
  const [availableTime, setAvailableTime] = useState([30]);
  const [stressLevel, setStressLevel] = useState([5]);
  const [preferences, setPreferences] = useState("");
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              Wellness Plan Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create a personalized mental health routine tailored to your goals and lifestyle
          </p>
        </div>

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
      </div>
      <PageNavigation />
    </div>
  );
};

export default WellnessPlanGenerator;
