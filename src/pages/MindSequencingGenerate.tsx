import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generatePersonalizedSequence } from "@/utils/sequenceGenerator";

const MindSequencingGenerate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assessmentScores, setAssessmentScores] = useState<{
    phq9: number | null;
    gad7: number | null;
    who5: number | null;
  }>({ phq9: null, gad7: null, who5: null });

  useEffect(() => {
    fetchLatestAssessments();
  }, []);

  const fetchLatestAssessments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: phq9Data } = await supabase
        .from("screening_results")
        .select("score")
        .eq("user_id", user.id)
        .eq("screening_type", "depression")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { data: gad7Data } = await supabase
        .from("screening_results")
        .select("score")
        .eq("user_id", user.id)
        .eq("screening_type", "anxiety")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const { data: who5Data } = await supabase
        .from("screening_results")
        .select("score")
        .eq("user_id", user.id)
        .eq("screening_type", "wellbeing")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setAssessmentScores({
        phq9: phq9Data?.score || null,
        gad7: gad7Data?.score || null,
        who5: who5Data?.score || null
      });
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    }
  };

  const handleGenerateSequence = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Generate personalized sequence
      const generatedSequence = generatePersonalizedSequence({
        phq9Score: assessmentScores.phq9 || 0,
        gad7Score: assessmentScores.gad7 || 0,
        who5Score: assessmentScores.who5 || 0
      });

      // Create sequence in database
      const { data: sequenceData, error: sequenceError } = await supabase
        .from("sequences")
        .insert({
          user_id: user.id,
          title: generatedSequence.title,
          description: generatedSequence.description,
          total_steps: generatedSequence.steps.length,
          completed_steps: 0,
          phq9_score: assessmentScores.phq9,
          gad7_score: assessmentScores.gad7,
          who5_score: assessmentScores.who5,
          status: "active"
        })
        .select()
        .single();

      if (sequenceError) throw sequenceError;

      // Create sequence steps
      const stepsToInsert = generatedSequence.steps.map((step, index) => ({
        sequence_id: sequenceData.id,
        step_order: index + 1,
        intervention_key: step.key,
        title: step.title,
        type: step.type,
        content: step.content,
        audio_script: step.audio_script,
        duration_minutes: step.duration_minutes,
        completed: false
      }));

      const { error: stepsError } = await supabase
        .from("sequence_steps")
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      toast.success("Your personalized sequence has been created!");
      navigate(`/mind-sequencing/${sequenceData.id}`);
    } catch (error: any) {
      console.error("Error generating sequence:", error);
      toast.error("Failed to generate sequence. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasAssessments = assessmentScores.phq9 !== null || 
                        assessmentScores.gad7 !== null || 
                        assessmentScores.who5 !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Generate Your Mind Sequence</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We'll create a personalized sequence based on your assessment scores and needs
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Your Assessment Profile</CardTitle>
            <CardDescription>
              Based on your latest screening results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasAssessments ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-6 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-2">Depression (PHQ-9)</p>
                    <p className="text-4xl font-bold text-primary">
                      {assessmentScores.phq9 !== null ? assessmentScores.phq9 : "—"}
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-2">Anxiety (GAD-7)</p>
                    <p className="text-4xl font-bold text-primary">
                      {assessmentScores.gad7 !== null ? assessmentScores.gad7 : "—"}
                    </p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground mb-2">Wellbeing (WHO-5)</p>
                    <p className="text-4xl font-bold text-primary">
                      {assessmentScores.who5 !== null ? assessmentScores.who5 : "—"}
                    </p>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• A personalized sequence tailored to your scores</li>
                    <li>• Step-by-step guided interventions</li>
                    <li>• Audio guidance using AI voice technology</li>
                    <li>• Progress tracking and completion rewards</li>
                    <li>• Evidence-based mental health techniques</li>
                  </ul>
                </div>

                <Button
                  onClick={handleGenerateSequence}
                  disabled={loading}
                  size="lg"
                  className="w-full gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Your Sequence...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Personalized Sequence
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">
                  You haven't completed any assessments yet. Complete at least one to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate("/depression-screening")} variant="outline">
                    PHQ-9 Assessment
                  </Button>
                  <Button onClick={() => navigate("/anxiety-screening")} variant="outline">
                    GAD-7 Assessment
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={() => navigate("/mind-sequencing")}
          className="w-full"
        >
          Back to Mind Sequencing
        </Button>
      </div>
    </div>
  );
};

export default MindSequencingGenerate;
