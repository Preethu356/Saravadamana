import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";
import { useState, useEffect } from "react";

const SecondaryCare = () => {
  const [searchParams] = useSearchParams();
  const [phq9Score, setPhq9Score] = useState<number | null>(null);
  const [who5Score, setWho5Score] = useState<number | null>(null);
  const [gad7Score, setGad7Score] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const tool = searchParams.get('tool');
    if (tool === 'phq9') setActiveTab('phq9');
    else if (tool === 'who5') setActiveTab('who5');
    else if (tool === 'gad7') setActiveTab('gad7');
  }, [searchParams]);

  const who5Questions = [
    "I have felt cheerful and in good spirits",
    "I have felt calm and relaxed",
    "I have felt active and vigorous",
    "I woke up feeling fresh and rested",
    "My daily life has been filled with things that interest me"
  ];

  const gad7Questions = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid as if something awful might happen"
  ];

  const phq9Questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself or that you are a failure",
    "Trouble concentrating on things",
    "Moving or speaking slowly or being fidgety/restless",
    "Thoughts of being better off dead or hurting yourself"
  ];

  const [phq9Responses, setPhq9Responses] = useState<number[]>(Array(9).fill(-1));
  const [who5Responses, setWho5Responses] = useState<number[]>(Array(5).fill(-1));
  const [gad7Responses, setGad7Responses] = useState<number[]>(Array(7).fill(-1));

  const handlePhq9Response = (index: number, value: number) => {
    const newResponses = [...phq9Responses];
    newResponses[index] = value;
    setPhq9Responses(newResponses);
    
    if (newResponses.every(r => r >= 0)) {
      const total = newResponses.reduce((sum, val) => sum + val, 0);
      setPhq9Score(total);
    }
  };

  const handleWho5Response = (index: number, value: number) => {
    const newResponses = [...who5Responses];
    newResponses[index] = value;
    setWho5Responses(newResponses);
    
    if (newResponses.every(r => r >= 0)) {
      const total = newResponses.reduce((sum, val) => sum + val, 0);
      setWho5Score(total);
    }
  };

  const handleGad7Response = (index: number, value: number) => {
    const newResponses = [...gad7Responses];
    newResponses[index] = value;
    setGad7Responses(newResponses);
    
    if (newResponses.every(r => r >= 0)) {
      const total = newResponses.reduce((sum, val) => sum + val, 0);
      setGad7Score(total);
    }
  };

  const getPhq9Interpretation = (score: number) => {
    if (score <= 4) return { severity: "Minimal Depression", color: "text-green-600", recommendation: "Monitor symptoms" };
    if (score <= 9) return { severity: "Mild Depression", color: "text-yellow-600", recommendation: "Watchful waiting; repeat PHQ-9 at follow-up" };
    if (score <= 14) return { severity: "Moderate Depression", color: "text-orange-600", recommendation: "Treatment plan, considering counseling and follow-up" };
    if (score <= 19) return { severity: "Moderately Severe Depression", color: "text-red-600", recommendation: "Active treatment with psychotherapy and/or medication" };
    return { severity: "Severe Depression", color: "text-red-800", recommendation: "Immediate initiation of therapy and/or medication" };
  };

  const getWho5Interpretation = (score: number) => {
    const rawScore = score * 4; // Convert to 0-100 scale
    if (rawScore >= 50) return { severity: "Good Well-Being", color: "text-green-600", recommendation: "Maintain healthy lifestyle habits" };
    if (rawScore >= 28) return { severity: "Moderate Well-Being", color: "text-yellow-600", recommendation: "Consider lifestyle improvements and stress management" };
    return { severity: "Poor Well-Being", color: "text-red-600", recommendation: "Further evaluation recommended; consider professional support" };
  };

  const getGad7Interpretation = (score: number) => {
    if (score <= 4) return { severity: "Minimal Anxiety", color: "text-green-600", recommendation: "Monitor symptoms" };
    if (score <= 9) return { severity: "Mild Anxiety", color: "text-yellow-600", recommendation: "Watchful waiting; consider self-help strategies" };
    if (score <= 14) return { severity: "Moderate Anxiety", color: "text-orange-600", recommendation: "Probable anxiety disorder; consider counseling" };
    return { severity: "Severe Anxiety", color: "text-red-600", recommendation: "Active treatment with psychotherapy and/or medication recommended" };
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="phq9">PHQ-9</TabsTrigger>
            <TabsTrigger value="who5">WHO-5</TabsTrigger>
            <TabsTrigger value="gad7">GAD-7</TabsTrigger>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phq9" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>PHQ-9 Depression Screening</CardTitle>
                <CardDescription>
                  Over the last 2 weeks, how often have you been bothered by any of the following problems?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {phq9Questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium text-sm">{index + 1}. {question}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Not at all", "Several days", "More than half the days", "Nearly every day"].map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant={phq9Responses[index] === optIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePhq9Response(index, optIndex)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {phq9Score !== null && (
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
                          <p className="text-sm text-muted-foreground">Total Score</p>
                          <p className="text-3xl font-bold">{phq9Score} / 27</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Informal Assessment</p>
                          <p className={`text-xl font-semibold ${getPhq9Interpretation(phq9Score).color}`}>
                            {getPhq9Interpretation(phq9Score).severity}
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-1">Recommendation:</p>
                          <p className="text-sm">{getPhq9Interpretation(phq9Score).recommendation}</p>
                        </div>
                        <p className="text-xs text-muted-foreground border-t pt-4">
                          <strong>Important:</strong> This is an informal screening assessment only, not a diagnostic tool. 
                          Please consult a qualified mental health professional for proper diagnosis and treatment.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
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

          <TabsContent value="gad7" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GAD-7 Anxiety Screening</CardTitle>
                <CardDescription>
                  Over the last 2 weeks, how often have you been bothered by the following problems?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {gad7Questions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <p className="font-medium text-sm">{index + 1}. {question}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Not at all", "Several days", "More than half the days", "Nearly every day"].map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant={gad7Responses[index] === optIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleGad7Response(index, optIndex)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {gad7Score !== null && (
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
                          <p className="text-sm text-muted-foreground">Total Score</p>
                          <p className="text-3xl font-bold">{gad7Score} / 21</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Informal Assessment</p>
                          <p className={`text-xl font-semibold ${getGad7Interpretation(gad7Score).color}`}>
                            {getGad7Interpretation(gad7Score).severity}
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-1">Recommendation:</p>
                          <p className="text-sm">{getGad7Interpretation(gad7Score).recommendation}</p>
                        </div>
                        <p className="text-xs text-muted-foreground border-t pt-4">
                          <strong>Important:</strong> This is an informal screening assessment only, not a diagnostic tool. 
                          Please consult a qualified mental health professional for proper diagnosis and treatment.
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
