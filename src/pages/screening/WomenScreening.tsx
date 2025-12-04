import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import BottomNav from "@/components/BottomNav";

const questions = [
  {
    id: 1,
    category: "Emotional Balance",
    question: "How often do you experience mood swings?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Very often"],
  },
  {
    id: 2,
    category: "Emotional Balance",
    question: "Do you feel emotionally supported in your relationships?",
    options: ["Always", "Usually", "Sometimes", "Rarely", "Never"],
  },
  {
    id: 3,
    category: "Physical Wellness",
    question: "How would you rate your overall energy levels?",
    options: ["Excellent", "Good", "Fair", "Poor", "Very poor"],
  },
  {
    id: 4,
    category: "Physical Wellness",
    question: "Do hormonal changes affect your mood or well-being?",
    options: ["Not at all", "Slightly", "Moderately", "Significantly", "Severely"],
  },
  {
    id: 5,
    category: "Self-Care",
    question: "How often do you prioritize self-care activities?",
    options: ["Daily", "Several times a week", "Weekly", "Rarely", "Never"],
  },
  {
    id: 6,
    category: "Self-Care",
    question: "Do you feel guilty when taking time for yourself?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 7,
    category: "Work-Life Balance",
    question: "How well do you balance personal and professional responsibilities?",
    options: ["Very well", "Well", "Fair", "Poorly", "Very poorly"],
  },
  {
    id: 8,
    category: "Work-Life Balance",
    question: "Do you feel overwhelmed by daily responsibilities?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
  {
    id: 9,
    category: "Social Connection",
    question: "How satisfied are you with your social support network?",
    options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"],
  },
  {
    id: 10,
    category: "Mental Wellness",
    question: "How often do you experience anxiety or worry?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
  },
];

const WomenScreening = () => {
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
          screening_type: "women",
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
        level: "Needs Attention",
        color: "text-destructive",
        message: "Your responses suggest you may benefit from focused self-care and support strategies.",
        actions: ["Mind Sequencing", "Mood Tracking", "CBT Consultation"],
      };
    } else if (percentage >= 50) {
      return {
        level: "Moderate Wellness",
        color: "text-amber-500",
        message: "You're doing okay but could benefit from enhanced self-care practices.",
        actions: ["Mind Your Sleep", "Mind Your Diet", "Journal"],
      };
    } else if (percentage >= 30) {
      return {
        level: "Good Wellness",
        color: "text-blue-500",
        message: "You're managing well. Continue nurturing your well-being.",
        actions: ["Mind Gym", "Mind Reflection", "Quotes"],
      };
    }
    return {
      level: "Excellent Wellness",
      color: "text-green-500",
      message: "You're thriving! Keep up your wonderful self-care practices.",
      actions: ["Dashboard", "Mind Plan"],
    };
  };

  if (showResults) {
    const result = getResultInterpretation();
    return (
      <div className="min-h-screen bg-background pb-24">
        <BackButton fallbackPath="/start-journey" />
        
        <div className="container mx-auto px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto"
          >
            <Card className="p-6 text-center bg-card/50 backdrop-blur-sm">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
              <div className={`text-3xl font-bold ${result.color} mb-4`}>
                {result.level}
              </div>
              <p className="text-muted-foreground mb-6">{result.message}</p>
              
              <div className="space-y-3">
                <p className="font-medium text-foreground">Recommended Next Steps:</p>
                {result.actions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/${action.toLowerCase().replace(/\s+/g, "-")}`)}
                  >
                    {action}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => navigate("/mind-plan")}
              >
                Generate My Mind Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 mb-4">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-medium">Women's Wellness</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Women's Wellness Assessment</h1>
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

export default WomenScreening;
