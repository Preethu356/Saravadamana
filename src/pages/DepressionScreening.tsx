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
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];

const options = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const DepressionScreening = () => {
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
        severity: "Minimal Depression",
        interpretation: "Your responses indicate minimal or no depression symptoms. This is a positive indicator of your current mental health status.",
        recommendations: [
          "Continue maintaining healthy lifestyle habits",
          "Regular exercise and balanced nutrition",
          "Maintain strong social connections",
          "Practice stress management techniques",
          "Annual mental health check-ins"
        ],
        clinicalAction: "No treatment necessary. Continue with routine wellness practices."
      };
    } else if (score <= 9) {
      return {
        severity: "Mild Depression",
        interpretation: "Your responses suggest mild depression symptoms. While concerning, these symptoms are manageable with appropriate self-care and support.",
        recommendations: [
          "Schedule consultation with a mental health professional",
          "Increase physical activity to 30 minutes daily",
          "Establish regular sleep schedule (7-9 hours)",
          "Practice mindfulness or meditation daily",
          "Connect with supportive friends/family regularly",
          "Monitor symptoms weekly"
        ],
        clinicalAction: "Watchful waiting with self-care strategies. Consider counseling if symptoms persist for 2+ weeks."
      };
    } else if (score <= 14) {
      return {
        severity: "Moderate Depression",
        interpretation: "Your responses indicate moderate depression symptoms that are significantly affecting your daily functioning and quality of life.",
        recommendations: [
          "Schedule appointment with mental health professional within 1 week",
          "Consider evidence-based therapy (CBT, IPT)",
          "Discuss treatment options including counseling",
          "Maintain daily routine and structure",
          "Avoid isolation - stay connected with support system",
          "Monitor symptoms daily",
          "Limit alcohol and avoid recreational drugs"
        ],
        clinicalAction: "Professional treatment recommended. Therapy is first-line treatment. Consider combined therapy approach if symptoms persist."
      };
    } else if (score <= 19) {
      return {
        severity: "Moderately Severe Depression",
        interpretation: "Your responses suggest moderately severe depression requiring prompt professional intervention. Your symptoms are having substantial impact on your daily life.",
        recommendations: [
          "Contact mental health professional within 2-3 days",
          "Immediate therapy recommended (CBT preferred)",
          "Medication evaluation may be necessary",
          "Create safety plan with therapist",
          "Daily check-ins with trusted person",
          "Avoid making major life decisions",
          "Emergency contact list readily available"
        ],
        clinicalAction: "Active treatment with therapy strongly recommended. Medication should be considered in consultation with psychiatrist. Close monitoring essential."
      };
    } else {
      return {
        severity: "Severe Depression",
        interpretation: "Your responses indicate severe depression requiring immediate professional help. Please reach out for support right away.",
        recommendations: [
          "URGENT: Contact mental health crisis line immediately",
          "Schedule emergency appointment with psychiatrist/psychologist",
          "Combined therapy and medication treatment recommended",
          "Daily monitoring by healthcare provider",
          "Inform trusted family member or friend",
          "Create comprehensive safety plan",
          "Remove access to means of self-harm",
          "24/7 crisis support: National Suicide Prevention Lifeline 988"
        ],
        clinicalAction: "IMMEDIATE professional intervention required. Combined pharmacotherapy and intensive psychotherapy. Consider intensive outpatient or inpatient treatment if safety concerns present."
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
    doc.text("PHQ-9 Depression Screening Report", 20, 20);
    
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
    doc.text(`Total Score: ${score}/27`, 20, 58);
    
    doc.setFontSize(14);
    doc.text(`Severity Level: ${result.severity}`, 20, 68);

    // Reference Values
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("PHQ-9 Score Interpretation Criteria:", 20, 80);
    doc.setFontSize(9);
    const criteria = [
      "0-4: Minimal Depression",
      "5-9: Mild Depression",
      "10-14: Moderate Depression",
      "15-19: Moderately Severe Depression",
      "20-27: Severe Depression"
    ];
    criteria.forEach((item, index) => {
      doc.text(`• ${item}`, 25, 88 + (index * 6));
    });

    // Interpretation
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Clinical Interpretation:", 20, 125);
    doc.setFontSize(9);
    const interpretationText = doc.splitTextToSize(result.interpretation, 170);
    doc.text(interpretationText, 20, 133);

    // Clinical Action
    doc.setFontSize(11);
    doc.text("Recommended Clinical Action:", 20, 155);
    doc.setFontSize(9);
    const actionText = doc.splitTextToSize(result.clinicalAction, 170);
    doc.text(actionText, 20, 163);

    // Recommendations
    doc.setFontSize(11);
    doc.text("Next Steps & Recommendations:", 20, 180);
    doc.setFontSize(9);
    let yPos = 188;
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
    doc.text("Reference: Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.", 20, 285);

    doc.save(`PHQ9-Depression-Screening-${today}.pdf`);
    
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
            PHQ-9 Depression Screening
          </h1>
          <p className="text-muted-foreground">
            Patient Health Questionnaire-9
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
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
                    Score: {score}/27
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
                  <li>0-4: Minimal Depression</li>
                  <li>5-9: Mild Depression</li>
                  <li>10-14: Moderate Depression</li>
                  <li>15-19: Moderately Severe Depression</li>
                  <li>20-27: Severe Depression</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Clinical Validity:</p>
                <p className="mt-2 text-muted-foreground">
                  The PHQ-9 is a validated, evidence-based screening tool widely used 
                  in clinical settings. Sensitivity: 88%, Specificity: 88% for major depression.
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

export default DepressionScreening;