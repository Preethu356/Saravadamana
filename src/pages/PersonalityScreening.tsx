import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ComplianceFooter from "@/components/ComplianceFooter";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface Question {
  id: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: "q1",
    question: "When faced with a problem, I prefer to:",
    options: [
      "Analyze it logically and systematically",
      "Trust my intuition and feelings",
      "Seek advice from others",
      "Take immediate action"
    ]
  },
  {
    id: "q2",
    question: "In social situations, I tend to:",
    options: [
      "Be the center of attention",
      "Observe and listen more than talk",
      "Connect deeply with a few people",
      "Adapt to different groups easily"
    ]
  },
  {
    id: "q3",
    question: "I feel most energized when:",
    options: [
      "Spending time alone",
      "Being with a large group",
      "Having meaningful conversations",
      "Engaging in activities"
    ]
  },
  {
    id: "q4",
    question: "My ideal way to spend free time is:",
    options: [
      "Reading or learning something new",
      "Socializing with friends",
      "Pursuing creative projects",
      "Relaxing and doing nothing"
    ]
  },
  {
    id: "q5",
    question: "When making decisions, I prioritize:",
    options: [
      "Logic and facts",
      "Personal values and emotions",
      "What's best for everyone involved",
      "Quick results and efficiency"
    ]
  },
  {
    id: "q6",
    question: "I handle stress by:",
    options: [
      "Planning and organizing",
      "Talking to someone I trust",
      "Engaging in physical activity",
      "Taking time alone to reflect"
    ]
  },
  {
    id: "q7",
    question: "I'm most motivated by:",
    options: [
      "Achievement and success",
      "Helping others",
      "Personal growth",
      "Stability and security"
    ]
  },
  {
    id: "q8",
    question: "In a team, I usually:",
    options: [
      "Take the leadership role",
      "Support and encourage others",
      "Contribute creative ideas",
      "Focus on completing tasks"
    ]
  }
];

const PersonalityScreening = () => {
  const [userName, setUserName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const generatePDF = () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before generating the report.",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before generating the report.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("Personality Screening Report", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text("Who Am I?", 105, 30, { align: "center" });
    
    // Patient Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 20, 55);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 65);
    
    // Responses
    doc.setFontSize(14);
    doc.text("Your Responses:", 20, 80);
    
    let yPosition = 95;
    doc.setFontSize(10);
    
    questions.forEach((q, index) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${q.question}`, 20, yPosition, { maxWidth: 170 });
      yPosition += 7;
      
      doc.setFont(undefined, "normal");
      const answer = answers[q.id] || "Not answered";
      doc.text(`   ${answer}`, 20, yPosition, { maxWidth: 170 });
      yPosition += 12;
    });
    
    // Signature section
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    } else {
      yPosition += 20;
    }
    
    doc.setDrawColor(139, 92, 246);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, "italic");
    doc.text("Dr. Preetham", 140, yPosition);
    yPosition += 7;
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("Clinical Psychologist", 140, yPosition);
    yPosition += 5;
    doc.text("Digital Signature", 140, yPosition);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a self-assessment tool and does not constitute a clinical diagnosis.", 105, 285, { align: "center" });
    
    doc.save(`Personality_Screening_${userName.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Your personality screening report has been downloaded."
    });
    
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Who Am I?
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover your personality traits through this screening questionnaire
          </p>
        </div>

        <Card className="p-8 shadow-xl border-2 mb-8">
          <div className="mb-8">
            <Label htmlFor="userName" className="text-lg font-semibold mb-2 block">
              Your Name
            </Label>
            <Input
              id="userName"
              placeholder="Enter your full name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="text-lg"
              disabled={submitted}
            />
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="border-b pb-6 last:border-b-0">
                <Label className="text-base font-semibold mb-4 block">
                  {index + 1}. {q.question}
                </Label>
                <RadioGroup
                  value={answers[q.id] || ""}
                  onValueChange={(value) => handleAnswerChange(q.id, value)}
                  disabled={submitted}
                  className="space-y-3"
                >
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value={option} id={`${q.id}-${optIndex}`} />
                      <Label htmlFor={`${q.id}-${optIndex}`} className="cursor-pointer flex-1 font-normal">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={generatePDF}
              className="flex-1"
              size="lg"
              disabled={submitted}
            >
              Generate PDF Report
            </Button>
            {submitted && (
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setAnswers({});
                  setUserName("");
                }}
                variant="outline"
                size="lg"
              >
                Start Over
              </Button>
            )}
          </div>

          <p className="text-sm text-muted-foreground mt-6 text-center">
            <strong>Note:</strong> This is a self-assessment tool for personal insight. 
            It is not a diagnostic tool and should not replace professional psychological evaluation.
          </p>
        </Card>
      </div>
      <ComplianceFooter />
    </div>
  );
};

export default PersonalityScreening;
