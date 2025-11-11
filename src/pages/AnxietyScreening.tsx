import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertCircle, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
];

const options = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const AnxietyScreening = () => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (questionIndex: number, value: string) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
  };

  const getInterpretation = (score: number) => {
    if (score <= 4) {
      return {
        severity: "Minimal Anxiety",
        interpretation: "Your responses indicate minimal or no anxiety symptoms. This suggests good emotional regulation and stress management.",
        recommendations: [
          "Maintain current stress management practices",
          "Continue regular exercise and sleep hygiene",
          "Practice preventive relaxation techniques",
          "Build and maintain social support networks",
          "Annual mental health wellness check"
        ],
        clinicalAction: "No treatment necessary. Continue wellness practices and stress management."
      };
    } else if (score <= 9) {
      return {
        severity: "Mild Anxiety",
        interpretation: "Your responses suggest mild anxiety symptoms that may be impacting your daily comfort but are likely manageable with self-care strategies.",
        recommendations: [
          "Practice deep breathing exercises daily (5-10 minutes)",
          "Progressive muscle relaxation techniques",
          "Regular physical activity (30 minutes, 5 days/week)",
          "Limit caffeine and alcohol intake",
          "Maintain consistent sleep schedule",
          "Consider mindfulness or meditation apps",
          "Monitor symptoms for 2-4 weeks"
        ],
        clinicalAction: "Self-help strategies recommended. If symptoms persist beyond 4 weeks or worsen, consider professional consultation."
      };
    } else if (score <= 14) {
      return {
        severity: "Moderate Anxiety",
        interpretation: "Your responses indicate moderate anxiety symptoms that are likely interfering with your daily functioning and quality of life.",
        recommendations: [
          "Schedule appointment with mental health professional within 1-2 weeks",
          "Evidence-based therapy recommended (CBT, ACT)",
          "Daily relaxation practice (meditation, yoga)",
          "Identify and avoid anxiety triggers when possible",
          "Maintain structured daily routine",
          "Limit exposure to stressful media/news",
          "Keep anxiety journal to track patterns",
          "Inform close family/friends for support"
        ],
        clinicalAction: "Professional treatment recommended. Cognitive Behavioral Therapy (CBT) is first-line treatment. Monitor closely and consider medication if symptoms interfere significantly with functioning."
      };
    } else {
      return {
        severity: "Severe Anxiety",
        interpretation: "Your responses indicate severe anxiety requiring prompt professional intervention. Your symptoms are significantly impacting your daily life and well-being.",
        recommendations: [
          "Contact mental health professional within 2-3 days",
          "Immediate therapy strongly recommended (CBT preferred)",
          "Medication evaluation advised - consult psychiatrist",
          "Daily grounding techniques and breathing exercises",
          "Avoid caffeine, alcohol, and recreational drugs completely",
          "Create crisis management plan with therapist",
          "Daily check-ins with trusted support person",
          "Emergency contacts: Crisis Text Line (text HOME to 741741)"
        ],
        clinicalAction: "URGENT professional intervention recommended. Combined therapy and medication often most effective. Close monitoring essential. If experiencing panic attacks or agoraphobia, intensive treatment may be necessary."
      };
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before viewing results.",
        variant: "destructive"
      });
      return;
    }
    setShowResults(true);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const score = calculateScore();
    const result = getInterpretation(score);
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text("GAD-7 Anxiety Screening Report", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${today}`, 20, 28);

    // Disclaimer
    doc.setFontSize(9);
    doc.setTextColor(220, 53, 69);
    const disclaimer = doc.splitTextToSize(
      "DISCLAIMER: This screening tool is NOT a diagnostic instrument. It is designed for screening purposes only and should not replace professional clinical evaluation. Always consult a qualified mental health professional for proper diagnosis and treatment.",
      170
    );
    doc.text(disclaimer, 20, 38);

    // Score and Severity
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Score: ${score}/21`, 20, 58);
    
    doc.setFontSize(14);
    doc.text(`Severity Level: ${result.severity}`, 20, 68);

    // Reference Values
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("GAD-7 Score Interpretation Criteria:", 20, 80);
    doc.setFontSize(9);
    const criteria = [
      "0-4: Minimal Anxiety",
      "5-9: Mild Anxiety",
      "10-14: Moderate Anxiety",
      "15-21: Severe Anxiety"
    ];
    criteria.forEach((item, index) => {
      doc.text(`• ${item}`, 25, 88 + (index * 6));
    });

    // Interpretation
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Clinical Interpretation:", 20, 115);
    doc.setFontSize(9);
    const interpretationText = doc.splitTextToSize(result.interpretation, 170);
    doc.text(interpretationText, 20, 123);

    // Clinical Action
    doc.setFontSize(11);
    doc.text("Recommended Clinical Action:", 20, 145);
    doc.setFontSize(9);
    const actionText = doc.splitTextToSize(result.clinicalAction, 170);
    doc.text(actionText, 20, 153);

    // Recommendations
    doc.setFontSize(11);
    doc.text("Next Steps & Recommendations:", 20, 175);
    doc.setFontSize(9);
    let yPos = 183;
    result.recommendations.forEach((rec, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const recText = doc.splitTextToSize(`${index + 1}. ${rec}`, 165);
      doc.text(recText, 25, yPos);
      yPos += recText.length * 5 + 2;
    });

    // Response Details
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }
    
    doc.setFontSize(11);
    doc.text("Your Responses:", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(8);
    questions.forEach((q, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const answer = options.find(opt => opt.value === answers[index])?.label || "Not answered";
      const questionText = doc.splitTextToSize(`Q${index + 1}. ${q}`, 140);
      doc.text(questionText, 20, yPos);
      doc.text(`Response: ${answer} (${answers[index]} points)`, 20, yPos + (questionText.length * 4));
      yPos += questionText.length * 4 + 8;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Reference: Spitzer RL, Kroenke K, Williams JB, Löwe B. A brief measure for assessing generalized anxiety disorder. Arch Intern Med. 2006;166(10):1092-1097.", 20, 285);

    doc.save(`GAD7-Anxiety-Screening-${today}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Your screening report has been downloaded."
    });
  };

  const score = calculateScore();
  const result = showResults ? getInterpretation(score) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            GAD-7 Anxiety Screening
          </h1>
          <p className="text-muted-foreground">
            Generalized Anxiety Disorder Assessment
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Over the last 2 weeks, how often have you been bothered by the following problems?
          </AlertDescription>
        </Alert>

        {!showResults ? (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Questions</CardTitle>
              <CardDescription>Please answer all questions honestly based on the past 2 weeks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className="space-y-3 pb-4 border-b last:border-0">
                  <Label className="text-base font-medium">
                    {index + 1}. {question}
                  </Label>
                  <RadioGroup
                    value={answers[index] || ""}
                    onValueChange={(value) => handleAnswer(index, value)}
                  >
                    {options.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`q${index}-${option.value}`} />
                        <Label htmlFor={`q${index}-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

              <Button onClick={handleSubmit} className="w-full" size="lg">
                View Results
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Results</span>
                  <Button onClick={generatePDF} variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    Score: {score}/21
                  </div>
                  <div className="text-xl font-semibold mb-4">
                    {result?.severity}
                  </div>
                  <Alert>
                    <AlertDescription>{result?.interpretation}</AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Recommended Clinical Action:</h3>
                  <p className="text-muted-foreground">{result?.clinicalAction}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Next Steps & Recommendations:</h3>
                  <ul className="space-y-2">
                    {result?.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    <strong>Important Disclaimer:</strong> This screening tool is NOT a diagnosis. 
                    It is designed for screening purposes only. Please consult a qualified mental 
                    health professional for proper evaluation and treatment.
                  </AlertDescription>
                </Alert>

                <Button onClick={() => setShowResults(false)} variant="outline" className="w-full">
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Reference Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Score Range Interpretation:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>0-4: Minimal Anxiety</li>
                  <li>5-9: Mild Anxiety</li>
                  <li>10-14: Moderate Anxiety</li>
                  <li>15-21: Severe Anxiety</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Clinical Validity:</p>
                <p className="mt-2 text-muted-foreground">
                  The GAD-7 is a validated screening tool for generalized anxiety disorder. 
                  Sensitivity: 89%, Specificity: 82% at cutoff score of 10.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default AnxietyScreening;