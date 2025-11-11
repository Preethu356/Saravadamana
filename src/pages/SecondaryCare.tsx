import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ChevronRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SecondaryCare = () => {
  const [searchParams] = useSearchParams();
  const [who5Score, setWho5Score] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool === 'who5') setActiveTab('who5');
    
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });
  }, [searchParams]);

  const who5Questions = [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me"
  ];

  const [who5Responses, setWho5Responses] = useState<number[]>(Array(5).fill(-1));

  const handleWho5Response = async (index: number, value: number) => {
    const newResponses = [...who5Responses];
    newResponses[index] = value;
    setWho5Responses(newResponses);
    
    if (newResponses.every(r => r >= 0)) {
      const total = newResponses.reduce((sum, val) => sum + val, 0);
      setWho5Score(total);
      
      // Save to database
      if (userId) {
        await saveWho5Results(total);
      }
    }
  };

  const saveWho5Results = async (score: number) => {
    if (!userId) return;

    const percentageScore = score * 4;
    const interpretation = getWho5Interpretation(score);

    const { error } = await supabase
      .from('screening_results')
      .insert({
        user_id: userId,
        screening_type: 'WHO-5',
        score: score,
        max_score: 25,
        percentage_score: percentageScore,
        severity: interpretation.severity
      });

    if (error) {
      console.error('Error saving WHO-5 results:', error);
      toast({
        title: "Error",
        description: "Failed to save screening results",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "WHO-5 screening results saved to your progress",
      });
    }
  };

  const getWho5Interpretation = (score: number) => {
    const rawScore = score * 4; // Convert to 0-100 scale
    if (rawScore >= 50) return { severity: "Good Well-Being", color: "text-green-600", recommendation: "Maintain healthy lifestyle habits" };
    if (rawScore >= 28) return { severity: "Moderate Well-Being", color: "text-yellow-600", recommendation: "Consider lifestyle improvements and stress management" };
    return { severity: "Poor Well-Being", color: "text-red-600", recommendation: "Further evaluation recommended; consider professional support" };
  };

  const handleNextClick = () => {
    setActiveTab("who5");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Secondary Prevention</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Early Detection Through Screening - WHO Recommended Tools
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="who5">WHO-5</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Secondary Prevention Overview</CardTitle>
                <CardDescription>
                  Early detection and intervention for mental health conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Secondary prevention focuses on early identification of mental health issues through 
                  validated screening tools. Early detection allows for timely intervention and better outcomes.
                </p>
                
                <div className="grid gap-4 mt-6">
                  <Card className="border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Depression Screening (PHQ-9)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive depression assessment with detailed interpretation, clinical guidelines, 
                        and personalized recommendations. Downloadable PDF report included.
                      </p>
                      <Link to="/depression-screening">
                        <Button className="w-full">
                          Start PHQ-9 Depression Screening
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        Anxiety Screening (GAD-7)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Evidence-based anxiety assessment with severity classification, treatment recommendations, 
                        and next steps for care. Full PDF report available.
                      </p>
                      <Link to="/anxiety-screening">
                        <Button className="w-full" variant="secondary">
                          Start GAD-7 Anxiety Screening
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-secondary/20">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                        Personality Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Understand your personality traits and behavioral patterns with personalized insights 
                        and growth recommendations.
                      </p>
                      <Link to="/personality-screening">
                        <Button className="w-full" variant="outline">
                          Start Personality Screening
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={handleNextClick} className="gap-2">
                    Continue to WHO-5 <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="who5" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WHO-5 Well-Being Index</CardTitle>
                <CardDescription>
                  Over the last 2 weeks, how much of the time...
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {who5Questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium text-sm">{index + 1}. {question}</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {["All of the time", "Most of the time", "More than half", "Less than half", "Some of the time", "At no time"].map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant={who5Responses[index] === (5 - optIndex) ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleWho5Response(index, 5 - optIndex)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {who5Score !== null && (
                  <Card className="mt-6 border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Your Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Raw Score</p>
                          <p className="text-3xl font-bold">{who5Score} / 25</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Percentage Score</p>
                          <p className="text-2xl font-bold">{(who5Score * 4)}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Informal Assessment</p>
                          <p className={`text-xl font-semibold ${getWho5Interpretation(who5Score).color}`}>
                            {getWho5Interpretation(who5Score).severity}
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-1">Recommendation:</p>
                          <p className="text-sm">{getWho5Interpretation(who5Score).recommendation}</p>
                        </div>
                        <p className="text-xs text-muted-foreground border-t pt-4">
                          <strong>Important:</strong> This is an informal screening assessment only, not a diagnostic tool. 
                          A score below 50% may indicate poor well-being and warrants further evaluation by a mental health professional.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <PageNavigation />
    </div>
  );
};

export default SecondaryCare;
