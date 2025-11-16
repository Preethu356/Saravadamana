import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Sequence {
  id: string;
  title: string;
  description: string;
  total_steps: number;
  completed_steps: number;
  phq9_score: number | null;
  gad7_score: number | null;
  who5_score: number | null;
  status: string;
  created_at: string;
}

const MindSequencing = () => {
  const navigate = useNavigate();
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [latestScores, setLatestScores] = useState<{
    phq9: number | null;
    gad7: number | null;
    who5: number | null;
  }>({ phq9: null, gad7: null, who5: null });

  useEffect(() => {
    fetchSequences();
    fetchLatestAssessments();
  }, []);

  const fetchSequences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("sequences")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSequences(data || []);
    } catch (error: any) {
      toast.error("Failed to load sequences");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestAssessments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

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

      setLatestScores({
        phq9: phq9Data?.score || null,
        gad7: gad7Data?.score || null,
        who5: who5Data?.score || null
      });
    } catch (error) {
      console.error("Failed to fetch assessments:", error);
    }
  };

  const getProgressPercentage = (seq: Sequence) => {
    if (seq.total_steps === 0) return 0;
    return Math.round((seq.completed_steps / seq.total_steps) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Mind Sequencing
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Personalized step-by-step mental wellness interventions tailored to your unique needs
          </p>
        </div>

        {/* Assessment Scores Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Latest Assessment Scores
            </CardTitle>
            <CardDescription>
              These scores help us create your personalized sequence
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">PHQ-9 (Depression)</p>
              <p className="text-3xl font-bold text-primary">
                {latestScores.phq9 !== null ? latestScores.phq9 : "—"}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">GAD-7 (Anxiety)</p>
              <p className="text-3xl font-bold text-primary">
                {latestScores.gad7 !== null ? latestScores.gad7 : "—"}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">WHO-5 (Wellbeing)</p>
              <p className="text-3xl font-bold text-primary">
                {latestScores.who5 !== null ? latestScores.who5 : "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Generate Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={() => navigate("/mind-sequencing/generate")}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Generate My Sequence
          </Button>
        </div>

        {/* Sequences List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Sequences</h2>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading sequences...</p>
          ) : sequences.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  You haven't created any sequences yet
                </p>
                <Button onClick={() => navigate("/mind-sequencing/generate")}>
                  Create Your First Sequence
                </Button>
              </CardContent>
            </Card>
          ) : (
            sequences.map((seq) => (
              <Card key={seq.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{seq.title}</CardTitle>
                      <CardDescription>{seq.description}</CardDescription>
                    </div>
                    <Button
                      onClick={() => navigate(`/mind-sequencing/${seq.id}`)}
                      className="gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {seq.completed_steps === 0 ? "Start" : "Continue"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {seq.completed_steps} / {seq.total_steps} steps
                      </span>
                    </div>
                    <Progress value={getProgressPercentage(seq)} className="h-2" />
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    {seq.phq9_score !== null && (
                      <span className="bg-secondary px-2 py-1 rounded">
                        PHQ-9: {seq.phq9_score}
                      </span>
                    )}
                    {seq.gad7_score !== null && (
                      <span className="bg-secondary px-2 py-1 rounded">
                        GAD-7: {seq.gad7_score}
                      </span>
                    )}
                    {seq.who5_score !== null && (
                      <span className="bg-secondary px-2 py-1 rounded">
                        WHO-5: {seq.who5_score}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MindSequencing;
