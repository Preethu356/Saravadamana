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

  const analyzePersonality = () => {
    const traits = {
      analytical: 0,
      intuitive: 0,
      social: 0,
      action: 0
    };

    // Analyze responses
    questions.forEach(q => {
      const answer = answers[q.id];
      if (!answer) return;

      if (answer.includes("logically") || answer.includes("Planning") || answer.includes("Logic")) traits.analytical++;
      if (answer.includes("intuition") || answer.includes("feelings") || answer.includes("emotions") || answer.includes("creative")) traits.intuitive++;
      if (answer.includes("others") || answer.includes("Socializing") || answer.includes("large group") || answer.includes("Helping")) traits.social++;
      if (answer.includes("action") || answer.includes("activities") || answer.includes("physical") || answer.includes("efficiency")) traits.action++;
    });

    const maxTrait = Math.max(traits.analytical, traits.intuitive, traits.social, traits.action);
    
    if (traits.analytical === maxTrait) return "analytical";
    if (traits.intuitive === maxTrait) return "intuitive";
    if (traits.social === maxTrait) return "social";
    return "action";
  };

  const getPersonalityInterpretation = (type: string) => {
    const interpretations = {
      analytical: {
        title: "Analytical Thinker",
        description: "You have a strong preference for logical reasoning and systematic problem-solving. You value facts, data, and structured approaches to challenges.",
        remedies: [
          "Practice mindfulness to balance logic with emotional awareness",
          "Engage in creative activities to develop your intuitive side",
          "Set aside time for spontaneous, unplanned activities",
          "Journal about your feelings to strengthen emotional intelligence"
        ]
      },
      intuitive: {
        title: "Intuitive Feeler",
        description: "You trust your instincts and value emotional connections. You're guided by your feelings and have a strong sense of empathy and creativity.",
        remedies: [
          "Ground yourself with structured routines and planning",
          "Practice fact-checking your intuitions with research",
          "Develop problem-solving skills through logic puzzles",
          "Balance emotion with rational decision-making techniques"
        ]
      },
      social: {
        title: "Social Connector",
        description: "You thrive in social environments and value relationships. You're naturally collaborative and find energy in connecting with others.",
        remedies: [
          "Schedule regular alone time for self-reflection",
          "Practice setting healthy boundaries in relationships",
          "Develop independent hobbies and interests",
          "Learn to be comfortable with solitude through meditation"
        ]
      },
      action: {
        title: "Action-Oriented Doer",
        description: "You're energized by taking action and achieving results. You prefer hands-on experiences and value efficiency and productivity.",
        remedies: [
          "Practice patience through mindful breathing exercises",
          "Allocate time for reflection before making decisions",
          "Engage in activities that require sitting still (reading, meditation)",
          "Balance activity with rest and recovery periods"
        ]
      }
    };

    return interpretations[type as keyof typeof interpretations];
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

    const personalityType = analyzePersonality();
    const interpretation = getPersonalityInterpretation(personalityType);

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
    
    // Disclaimer Section
    doc.setFillColor(255, 243, 224);
    doc.rect(20, 75, 170, 25, "F");
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.setTextColor(200, 100, 0);
    doc.text("IMPORTANT DISCLAIMER", 105, 82, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text("This is a self-assessment tool for personal insight and is NOT a diagnostic tool.", 105, 89, { align: "center" });
    doc.text("It should not replace professional psychological evaluation or clinical diagnosis.", 105, 95, { align: "center" });
    
    // Personality Type Interpretation Section
    doc.setFillColor(236, 240, 255);
    doc.rect(20, 107, 170, 60, "F");
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("Your Personality Type", 105, 117, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(interpretation.title, 105, 127, { align: "center" });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    const descLines = doc.splitTextToSize(interpretation.description, 160);
    doc.text(descLines, 25, 137);
    
    // Brief Remedies Section
    let yPos = 175;
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("Recommended Practices for Balance:", 20, yPos);
    
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    
    interpretation.remedies.forEach((remedy, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${remedy}`, 25, yPos, { maxWidth: 165 });
      yPos += 10;
    });
    
    // Responses
    yPos += 10;
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("Your Responses:", 20, yPos);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    questions.forEach((q, index) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont(undefined, "bold");
      doc.text(`${index + 1}. ${q.question}`, 20, yPos, { maxWidth: 170 });
      yPos += 7;
      
      doc.setFont(undefined, "normal");
      const answer = answers[q.id] || "Not answered";
      doc.text(`   ${answer}`, 20, yPos, { maxWidth: 170 });
      yPos += 12;
    });
    
    // Signature section
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 20;
    }
    
    doc.setDrawColor(139, 92, 246);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.setFont(undefined, "italic");
    doc.text("Dr. Preetham", 140, yPos);
    yPos += 7;
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("Clinical Psychologist", 140, yPos);
    yPos += 5;
    doc.text("Digital Signature", 140, yPos);
    
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
