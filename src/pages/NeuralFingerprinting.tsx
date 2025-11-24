import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Brain, AlertTriangle, Shield, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "How often do you experience persistent sadness or hopelessness?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very Often" }
    ]
  },
  {
    id: 2,
    question: "Do you have a family history of mental health conditions?",
    options: [
      { value: 0, label: "No known history" },
      { value: 2, label: "Distant relatives" },
      { value: 3, label: "Immediate family" },
      { value: 4, label: "Multiple family members" }
    ]
  },
  {
    id: 3,
    question: "How would you rate your current stress level?",
    options: [
      { value: 0, label: "Very Low" },
      { value: 1, label: "Low" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "High" },
      { value: 4, label: "Very High" }
    ]
  },
  {
    id: 4,
    question: "How often do you experience sleep disturbances?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Every night" }
    ]
  },
  {
    id: 5,
    question: "Do you have a strong social support network?",
    options: [
      { value: 0, label: "Very strong support" },
      { value: 1, label: "Good support" },
      { value: 2, label: "Moderate support" },
      { value: 3, label: "Limited support" },
      { value: 4, label: "No support" }
    ]
  },
  {
    id: 6,
    question: "How often do you engage in physical exercise?",
    options: [
      { value: 0, label: "Daily" },
      { value: 1, label: "4-6 times/week" },
      { value: 2, label: "2-3 times/week" },
      { value: 3, label: "Once a week" },
      { value: 4, label: "Rarely/Never" }
    ]
  },
  {
    id: 7,
    question: "Have you experienced significant trauma or loss?",
    options: [
      { value: 0, label: "No" },
      { value: 2, label: "Minor events" },
      { value: 3, label: "Significant event" },
      { value: 4, label: "Multiple traumatic events" }
    ]
  },
  {
    id: 8,
    question: "How often do you experience anxiety or excessive worry?",
    options: [
      { value: 0, label: "Never" },
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Constantly" }
    ]
  },
  {
    id: 9,
    question: "Do you practice regular self-care and relaxation techniques?",
    options: [
      { value: 0, label: "Daily practice" },
      { value: 1, label: "Several times/week" },
      { value: 2, label: "Occasionally" },
      { value: 3, label: "Rarely" },
      { value: 4, label: "Never" }
    ]
  },
  {
    id: 10,
    question: "How would you rate your overall life satisfaction?",
    options: [
      { value: 0, label: "Very satisfied" },
      { value: 1, label: "Satisfied" },
      { value: 2, label: "Neutral" },
      { value: 3, label: "Dissatisfied" },
      { value: 4, label: "Very dissatisfied" }
    ]
  }
];

export default function NeuralFingerprinting() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (answers[questions[currentQuestion].id] !== undefined) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults();
      }
    } else {
      toast.error("Please select an answer before continuing");
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    setIsSubmitting(true);
    const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);
    const maxScore = questions.length * 4;
    const vulnerabilityScore = Math.round((totalScore / maxScore) * 100);

    let riskLevel = "Low";
    let riskColor = "bg-green-500";
    if (vulnerabilityScore > 70) {
      riskLevel = "High";
      riskColor = "bg-red-500";
    } else if (vulnerabilityScore > 40) {
      riskLevel = "Moderate";
      riskColor = "bg-yellow-500";
    }

    const riskFactors = [];
    const protectiveFactors = [];
    const recommendations = [];

    // Analyze risk factors
    if (answers[1] >= 2) riskFactors.push("Family history of mental health conditions");
    if (answers[3] >= 3) riskFactors.push("High stress levels");
    if (answers[4] >= 3) riskFactors.push("Sleep disturbances");
    if (answers[7] >= 3) riskFactors.push("History of trauma");
    if (answers[8] >= 3) riskFactors.push("High anxiety levels");

    // Analyze protective factors
    if (answers[5] <= 2) protectiveFactors.push("Regular physical activity");
    if (answers[2] <= 2) protectiveFactors.push("Manageable stress levels");
    if (answers[9] <= 2) protectiveFactors.push("Self-care practices");
    if (answers[6] <= 1) protectiveFactors.push("Strong social support");

    // Generate recommendations
    if (vulnerabilityScore > 50) {
      recommendations.push("Consider speaking with a mental health professional");
      recommendations.push("Explore our Mind Sequencing tools for personalized interventions");
    }
    if (answers[6] >= 3) recommendations.push("Build stronger social connections through support groups");
    if (answers[5] >= 3) recommendations.push("Incorporate regular physical exercise into your routine");
    if (answers[9] >= 3) recommendations.push("Practice mindfulness and relaxation techniques daily");
    if (answers[4] >= 3) recommendations.push("Focus on improving sleep hygiene");

    const resultData = {
      vulnerability_score: vulnerabilityScore,
      risk_level: riskLevel,
      risk_color: riskColor,
      risk_factors: riskFactors,
      protective_factors: protectiveFactors,
      recommendations: recommendations
    };

    setResults(resultData);
    setIsCompleted(true);

    // Save to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("neural_fingerprinting").insert({
          user_id: user.id,
          vulnerability_score: vulnerabilityScore,
          risk_level: riskLevel,
          risk_factors: riskFactors,
          protective_factors: protectiveFactors,
          recommendations: recommendations
        });

        if (error) throw error;
        toast.success("Neural fingerprinting results saved");
      }
    } catch (error) {
      console.error("Error saving results:", error);
      toast.error("Failed to save results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-2">
            <CardHeader className="text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-3xl">Your Neural Fingerprint</CardTitle>
              <CardDescription>Mental Health Vulnerability Assessment Results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-48 h-48 mx-auto rounded-full border-8 border-muted flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">{results.vulnerability_score}%</div>
                      <div className="text-sm text-muted-foreground mt-2">Vulnerability Score</div>
                    </div>
                  </div>
                </div>
                
                <Badge className={`${results.risk_color} text-white text-lg px-6 py-2`}>
                  {results.risk_level} Risk
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      Risk Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.risk_factors.length > 0 ? (
                      <ul className="space-y-2">
                        {results.risk_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No significant risk factors identified</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <Shield className="w-5 h-5" />
                      Protective Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.protective_factors.length > 0 ? (
                      <ul className="space-y-2">
                        {results.protective_factors.map((factor: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">Consider building protective factors</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Personalized Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center pt-6">
                <Button onClick={() => navigate("/mind-sequencing")} size="lg">
                  Start Mind Sequencing
                </Button>
                <Button onClick={() => navigate("/dashboard")} variant="outline" size="lg">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Neural Fingerprinting</CardTitle>
                <CardDescription>Assess your mental health vulnerability and risk factors</CardDescription>
              </div>
              <Brain className="w-12 h-12 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-6 py-6">
              <h3 className="text-xl font-semibold">{questions[currentQuestion].question}</h3>
              
              <RadioGroup
                value={answers[questions[currentQuestion].id]?.toString()}
                onValueChange={(val) => handleAnswer(parseInt(val))}
              >
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[questions[currentQuestion].id] === undefined || isSubmitting}
              >
                {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}