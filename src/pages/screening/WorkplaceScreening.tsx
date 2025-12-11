import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Briefcase, ArrowRight, CheckCircle, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import BottomNav from "@/components/BottomNav";

const questions = [
  {
    id: 1,
    category: "Work Stress",
    question: "How often do you feel stressed about your work responsibilities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 2,
    category: "Work Stress",
    question: "Do you have difficulty disconnecting from work during off-hours?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 3,
    category: "Burnout Risk",
    question: "How exhausted do you feel at the end of a workday?",
    options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
  },
  {
    id: 4,
    category: "Burnout Risk",
    question: "Do you feel cynical or detached from your work?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 5,
    category: "Work-Life Balance",
    question: "How satisfied are you with your work-life balance?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
  },
  {
    id: 6,
    category: "Work-Life Balance",
    question: "Do you have time for hobbies and personal activities?",
    options: ["Always", "Usually", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 7,
    category: "Workplace Relations",
    question: "How supportive is your work environment?",
    options: ["Very supportive", "Supportive", "Neutral", "Unsupportive", "Very unsupportive"],
  },
  {
    id: 8,
    category: "Workplace Relations",
    question: "Do you feel valued and appreciated at work?",
    options: ["Always", "Usually", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 9,
    category: "Physical Health",
    question: "How often do you experience physical symptoms from work stress (headaches, tension)?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Daily"],
  },
  {
    id: 10,
    category: "Career Satisfaction",
    question: "How satisfied are you with your career progress?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
  },
];

const WorkplaceScreening = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    const score = questions[currentQuestion].options.indexOf(value);
    setAnswers({ ...answers, [currentQuestion]: score });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = async () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    let severity = "Low";
    if (percentageScore >= 70) severity = "Severe";
    else if (percentageScore >= 50) severity = "Moderate";
    else if (percentageScore >= 30) severity = "Mild";

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("screening_results").insert({
          user_id: user.id,
          screening_type: "workplace",
          score: totalScore,
          max_score: maxScore,
          percentage_score: percentageScore,
          severity,
        });
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }

    setShowResults(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const getResultInterpretation = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = Math.round((totalScore / maxScore) * 100);

    if (percentage >= 70) {
      return {
        level: "High Burnout Risk",
        color: "text-destructive",
        message: "Your responses indicate significant work-related stress. Immediate intervention is recommended.",
        actions: ["Mind Sequencing", "Anxiety Screening", "CBT Consultation"],
      };
    } else if (percentage >= 50) {
      return {
        level: "Moderate Stress",
        color: "text-amber-500",
        message: "You're experiencing moderate work stress. Building resilience strategies can help.",
        actions: ["Mind Your Sleep", "Mind Gym", "Mood Tracking"],
      };
    } else if (percentage >= 30) {
      return {
        level: "Manageable Stress",
        color: "text-blue-500",
        message: "You're handling work stress reasonably well. Continue maintaining healthy boundaries.",
        actions: ["Mind Your Diet", "Journal", "Mind Reflection"],
      };
    }
    return {
      level: "Low Stress",
      color: "text-green-500",
      message: "Excellent! You have a healthy relationship with work. Keep it up!",
      actions: ["Dashboard", "Quotes"],
    };
  };

  const getRiskScore = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    return Math.round((totalScore / maxScore) * 100);
  };

  if (showResults) {
    const result = getResultInterpretation();
    const riskScore = getRiskScore();
    
    return (
      <div className="min-h-screen bg-background pb-24">
        <BackButton fallbackPath="/screening-tools?category=workplace" />
        
        <div className="container mx-auto px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto space-y-6"
          >
            <Card className={`p-6 ${
              riskScore >= 70 ? 'bg-destructive/10 border-destructive/30' :
              riskScore >= 50 ? 'bg-amber-500/10 border-amber-500/30' :
              riskScore >= 30 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-green-500/10 border-green-500/30'
            }`}>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h2 className="text-xl font-bold mb-1">Assessment Complete!</h2>
                <div className={`text-4xl font-bold ${result.color} mb-2`}>
                  {riskScore}%
                </div>
                <Badge variant={riskScore >= 50 ? "destructive" : "secondary"} className="mb-3">
                  {result.level}
                </Badge>
                <Progress value={riskScore} className="h-3 mb-3" />
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
            </Card>

            <Card className="p-4 bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Risk Interpretation
              </h3>
              <div className="space-y-2 text-sm">
                {riskScore >= 70 && (
                  <p className="text-destructive">• High burnout risk detected. Immediate intervention recommended.</p>
                )}
                {riskScore >= 50 && riskScore < 70 && (
                  <p className="text-amber-600">• Moderate work stress. Consider work-life balance strategies.</p>
                )}
                {riskScore >= 30 && riskScore < 50 && (
                  <p className="text-blue-600">• Manageable stress levels. Maintain healthy boundaries.</p>
                )}
                {riskScore < 30 && (
                  <p className="text-green-600">• Healthy work relationship! Continue current practices.</p>
                )}
                <p className="text-muted-foreground mt-2">Score saved to your wellness dashboard.</p>
              </div>
            </Card>

            <Card className="p-4 bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-3">Recommended Next Steps</h3>
              <div className="space-y-2">
                {result.actions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/${action.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {action}
                  </Button>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="default" onClick={() => navigate("/dashboard")}>
                View Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate("/screening-tools?category=workplace")}>
                More Screenings
              </Button>
            </div>

            <Button className="w-full" size="lg" onClick={() => navigate("/mind-plan")}>
              Generate My Mind Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
        
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <BackButton fallbackPath="/start-journey" />

      <div className="container mx-auto px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 mb-4">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm font-medium">Workplace Wellness</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Workplace Stress Assessment</h1>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="text-xs text-primary font-medium mb-2">
              {questions[currentQuestion].category}
            </div>
            <h3 className="text-lg font-medium text-foreground mb-6">
              {questions[currentQuestion].question}
            </h3>

            <RadioGroup
              value={questions[currentQuestion].options[answers[currentQuestion]] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    answers[currentQuestion] === index
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                className="flex-1"
              >
                {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default WorkplaceScreening;
