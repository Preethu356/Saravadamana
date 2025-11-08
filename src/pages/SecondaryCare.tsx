import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SecondaryCare = () => {
  const [phq9Score, setPhq9Score] = useState<number | null>(null);

  const screeningTools = [
    {
      name: "WHO-5 Well-Being Index",
      description: "A short self-reported measure of current mental wellbeing",
      questions: 5,
      time: "2 minutes",
      purpose: "Screening for depression and monitoring mental wellbeing"
    },
    {
      name: "Patient Health Questionnaire (PHQ-9)",
      description: "Gold standard tool for depression screening",
      questions: 9,
      time: "5 minutes",
      purpose: "Assess severity of depressive symptoms"
    },
    {
      name: "Generalized Anxiety Disorder (GAD-7)",
      description: "Screening tool for anxiety disorders",
      questions: 7,
      time: "3 minutes",
      purpose: "Identify and measure severity of generalized anxiety disorder"
    },
    {
      name: "AUDIT (Alcohol Use)",
      description: "WHO screening for harmful alcohol consumption",
      questions: 10,
      time: "5 minutes",
      purpose: "Identify hazardous and harmful patterns of alcohol consumption"
    }
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

  const [responses, setResponses] = useState<number[]>(Array(9).fill(-1));

  const handleResponse = (index: number, value: number) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
    
    if (newResponses.every(r => r >= 0)) {
      const total = newResponses.reduce((sum, val) => sum + val, 0);
      setPhq9Score(total);
    }
  };

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return { severity: "Minimal", color: "text-green-600", recommendation: "Monitor symptoms" };
    if (score <= 9) return { severity: "Mild", color: "text-yellow-600", recommendation: "Watchful waiting; repeat PHQ-9 at follow-up" };
    if (score <= 14) return { severity: "Moderate", color: "text-orange-600", recommendation: "Treatment plan, considering counseling and follow-up" };
    if (score <= 19) return { severity: "Moderately Severe", color: "text-red-600", recommendation: "Active treatment with psychotherapy and/or medication" };
    return { severity: "Severe", color: "text-red-800", recommendation: "Immediate initiation of therapy and/or medication" };
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

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Screening Tools</TabsTrigger>
            <TabsTrigger value="phq9">PHQ-9 Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                  WHO-Recommended Screening Tools
                </CardTitle>
                <CardDescription>
                  Evidence-based tools for early detection of mental health conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {screeningTools.map((tool, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{tool.questions} questions • {tool.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tool.purpose}</p>
                        <Button className="w-full mt-4" variant="outline">
                          Start Assessment
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  Disease-Specific Screening
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Bipolar Disorder - MDQ</h4>
                    <p className="text-sm text-muted-foreground">Mood Disorder Questionnaire for bipolar spectrum disorders</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">PTSD - PCL-5</h4>
                    <p className="text-sm text-muted-foreground">PTSD Checklist for DSM-5 trauma screening</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">OCD - Y-BOCS</h4>
                    <p className="text-sm text-muted-foreground">Yale-Brown Obsessive Compulsive Scale</p>
                  </div>
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
                    <div className="flex gap-2">
                      {["Not at all", "Several days", "More than half", "Nearly every day"].map((option, optIndex) => (
                        <Button
                          key={optIndex}
                          variant={responses[index] === optIndex ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleResponse(index, optIndex)}
                          className="flex-1"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                {phq9Score !== null && (
                  <Card className="mt-6 border-2">
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
                          <p className="text-3xl font-bold">{phq9Score}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Severity</p>
                          <p className={`text-xl font-semibold ${getScoreInterpretation(phq9Score).color}`}>
                            {getScoreInterpretation(phq9Score).severity}
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm font-semibold mb-1">Recommendation:</p>
                          <p className="text-sm">{getScoreInterpretation(phq9Score).recommendation}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Note: This is a screening tool only. Please consult a mental health professional for proper diagnosis and treatment.
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
    </div>
  );
};

export default SecondaryCare;
