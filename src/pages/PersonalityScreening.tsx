import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplianceFooter from "@/components/ComplianceFooter";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface Question {
  id: string;
  question: string;
  cluster: string;
  disorder: string;
}

// DSM-5 based Personality Disorder Screening Questions
const clusterAQuestions: Question[] = [
  // Paranoid Personality Disorder
  { id: "a1", question: "I often suspect that people are lying to me or trying to deceive me", cluster: "A", disorder: "Paranoid" },
  { id: "a2", question: "I am reluctant to confide in others because I fear they will use information against me", cluster: "A", disorder: "Paranoid" },
  { id: "a3", question: "I read hidden meanings or threats into innocent remarks or events", cluster: "A", disorder: "Paranoid" },
  { id: "a4", question: "I bear grudges and find it hard to forgive perceived insults or slights", cluster: "A", disorder: "Paranoid" },
  
  // Schizoid Personality Disorder
  { id: "a5", question: "I prefer to be alone and rarely desire close relationships", cluster: "A", disorder: "Schizoid" },
  { id: "a6", question: "I have little interest in sexual experiences with another person", cluster: "A", disorder: "Schizoid" },
  { id: "a7", question: "I take pleasure in very few activities, if any", cluster: "A", disorder: "Schizoid" },
  { id: "a8", question: "I appear indifferent to praise or criticism from others", cluster: "A", disorder: "Schizoid" },
  
  // Schizotypal Personality Disorder
  { id: "a9", question: "I have unusual perceptual experiences or magical thinking", cluster: "A", disorder: "Schizotypal" },
  { id: "a10", question: "My behavior or appearance is odd, eccentric, or peculiar", cluster: "A", disorder: "Schizotypal" },
  { id: "a11", question: "I have strange beliefs or ideas that influence my behavior", cluster: "A", disorder: "Schizotypal" },
  { id: "a12", question: "I experience excessive social anxiety that doesn't diminish with familiarity", cluster: "A", disorder: "Schizotypal" }
];

const clusterBQuestions: Question[] = [
  // Antisocial Personality Disorder
  { id: "b1", question: "I often disregard the rights of others and social norms", cluster: "B", disorder: "Antisocial" },
  { id: "b2", question: "I frequently lie or use aliases for personal gain or pleasure", cluster: "B", disorder: "Antisocial" },
  { id: "b3", question: "I have little concern for the safety of myself or others", cluster: "B", disorder: "Antisocial" },
  { id: "b4", question: "I feel little remorse after hurting or mistreating others", cluster: "B", disorder: "Antisocial" },
  
  // Borderline Personality Disorder
  { id: "b5", question: "I go to great lengths to avoid real or imagined abandonment", cluster: "B", disorder: "Borderline" },
  { id: "b6", question: "My relationships are intense but unstable, alternating between extremes", cluster: "B", disorder: "Borderline" },
  { id: "b7", question: "My sense of self is markedly unstable and changes frequently", cluster: "B", disorder: "Borderline" },
  { id: "b8", question: "I engage in impulsive behaviors that could be self-damaging", cluster: "B", disorder: "Borderline" },
  { id: "b9", question: "I experience intense and rapidly changing moods", cluster: "B", disorder: "Borderline" },
  
  // Histrionic Personality Disorder
  { id: "b10", question: "I feel uncomfortable when I'm not the center of attention", cluster: "B", disorder: "Histrionic" },
  { id: "b11", question: "I often behave in sexually seductive or provocative ways", cluster: "B", disorder: "Histrionic" },
  { id: "b12", question: "My emotions shift rapidly and appear shallow to others", cluster: "B", disorder: "Histrionic" },
  { id: "b13", question: "I use my physical appearance to draw attention to myself", cluster: "B", disorder: "Histrionic" },
  
  // Narcissistic Personality Disorder
  { id: "b14", question: "I have a grandiose sense of self-importance", cluster: "B", disorder: "Narcissistic" },
  { id: "b15", question: "I am preoccupied with fantasies of unlimited success, power, or beauty", cluster: "B", disorder: "Narcissistic" },
  { id: "b16", question: "I believe I am special and can only be understood by other special people", cluster: "B", disorder: "Narcissistic" },
  { id: "b17", question: "I require excessive admiration from others", cluster: "B", disorder: "Narcissistic" },
  { id: "b18", question: "I lack empathy and am unwilling to recognize the feelings of others", cluster: "B", disorder: "Narcissistic" }
];

const clusterCQuestions: Question[] = [
  // Avoidant Personality Disorder
  { id: "c1", question: "I avoid work or social activities that involve interpersonal contact", cluster: "C", disorder: "Avoidant" },
  { id: "c2", question: "I am unwilling to get involved unless I'm certain of being liked", cluster: "C", disorder: "Avoidant" },
  { id: "c3", question: "I am preoccupied with being criticized or rejected in social situations", cluster: "C", disorder: "Avoidant" },
  { id: "c4", question: "I view myself as socially inept, inferior, or unappealing", cluster: "C", disorder: "Avoidant" },
  
  // Dependent Personality Disorder
  { id: "c5", question: "I have difficulty making everyday decisions without excessive advice", cluster: "C", disorder: "Dependent" },
  { id: "c6", question: "I need others to assume responsibility for most areas of my life", cluster: "C", disorder: "Dependent" },
  { id: "c7", question: "I have difficulty expressing disagreement due to fear of loss of support", cluster: "C", disorder: "Dependent" },
  { id: "c8", question: "I urgently seek another relationship when a close one ends", cluster: "C", disorder: "Dependent" },
  
  // Obsessive-Compulsive Personality Disorder
  { id: "c9", question: "I am preoccupied with details, rules, lists, and order", cluster: "C", disorder: "OCPD" },
  { id: "c10", question: "I show perfectionism that interferes with task completion", cluster: "C", disorder: "OCPD" },
  { id: "c11", question: "I am excessively devoted to work and productivity", cluster: "C", disorder: "OCPD" },
  { id: "c12", question: "I am rigid and stubborn about values, morals, and ethics", cluster: "C", disorder: "OCPD" }
];

const PersonalityScreening = () => {
  const [userName, setUserName] = useState("");
  const [answersA, setAnswersA] = useState<Record<string, number>>({});
  const [answersB, setAnswersB] = useState<Record<string, number>>({});
  const [answersC, setAnswersC] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const handleAnswerChange = (cluster: string, questionId: string, value: number) => {
    if (cluster === "A") setAnswersA(prev => ({ ...prev, [questionId]: value }));
    if (cluster === "B") setAnswersB(prev => ({ ...prev, [questionId]: value }));
    if (cluster === "C") setAnswersC(prev => ({ ...prev, [questionId]: value }));
  };

  const analyzeCluster = (questions: Question[], answers: Record<string, number>) => {
    const disorders: Record<string, number> = {};
    
    questions.forEach(q => {
      const score = answers[q.id] || 0;
      if (!disorders[q.disorder]) disorders[q.disorder] = 0;
      disorders[q.disorder] += score;
    });

    return disorders;
  };

  const getTherapyRecommendations = (disorder: string, severity: string) => {
    const therapies: Record<string, any> = {
      Paranoid: {
        primaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        duration: "12-24 months",
        benefits: "Helps challenge paranoid thoughts and develop trust",
        secondaryTherapy: "Schema Therapy",
        additionalSupport: ["Trust-building exercises", "Social skills training", "Mindfulness meditation"],
        timeline: "Initial progress in 3-6 months, significant improvement in 12-18 months"
      },
      Schizoid: {
        primaryTherapy: "Psychodynamic Therapy",
        duration: "18-36 months",
        benefits: "Explores underlying emotions and builds social connection",
        secondaryTherapy: "Group Therapy",
        additionalSupport: ["Social skills training", "Emotional awareness exercises", "Gradual social exposure"],
        timeline: "Early engagement in 6-12 months, meaningful change in 18-24 months"
      },
      Schizotypal: {
        primaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        duration: "12-24 months",
        benefits: "Addresses unusual thoughts and improves social functioning",
        secondaryTherapy: "Social Cognition Training",
        additionalSupport: ["Reality testing exercises", "Anxiety management", "Structured social activities"],
        timeline: "Symptom reduction in 6-12 months, functional improvement in 18-24 months"
      },
      Antisocial: {
        primaryTherapy: "Mentalization-Based Therapy (MBT)",
        duration: "24-48 months",
        benefits: "Develops empathy and understanding of others' perspectives",
        secondaryTherapy: "Dialectical Behavior Therapy (DBT)",
        additionalSupport: ["Anger management", "Impulse control training", "Moral reasoning development"],
        timeline: "Initial behavioral changes in 12-18 months, deeper change in 24-36 months"
      },
      Borderline: {
        primaryTherapy: "Dialectical Behavior Therapy (DBT)",
        duration: "12-24 months",
        benefits: "Teaches emotion regulation and distress tolerance",
        secondaryTherapy: "Mentalization-Based Therapy (MBT)",
        additionalSupport: ["Crisis management skills", "Interpersonal effectiveness", "Mindfulness practice"],
        timeline: "Crisis reduction in 3-6 months, emotional stability in 12-18 months"
      },
      Histrionic: {
        primaryTherapy: "Psychodynamic Therapy",
        duration: "18-36 months",
        benefits: "Explores underlying needs and develops authentic self-expression",
        secondaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        additionalSupport: ["Emotional depth training", "Identity development", "Authentic communication skills"],
        timeline: "Self-awareness increases in 6-12 months, behavioral change in 18-24 months"
      },
      Narcissistic: {
        primaryTherapy: "Schema Therapy",
        duration: "24-48 months",
        benefits: "Addresses core beliefs and develops empathy",
        secondaryTherapy: "Mentalization-Based Therapy (MBT)",
        additionalSupport: ["Empathy training", "Self-compassion exercises", "Realistic self-appraisal"],
        timeline: "Initial insight in 12-18 months, meaningful change in 24-36 months"
      },
      Avoidant: {
        primaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        duration: "12-24 months",
        benefits: "Reduces social anxiety and builds self-esteem",
        secondaryTherapy: "Exposure Therapy",
        additionalSupport: ["Gradual social exposure", "Self-esteem building", "Assertiveness training"],
        timeline: "Anxiety reduction in 6-12 months, social confidence in 12-18 months"
      },
      Dependent: {
        primaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        duration: "12-24 months",
        benefits: "Builds independence and decision-making skills",
        secondaryTherapy: "Assertiveness Training",
        additionalSupport: ["Independence exercises", "Self-efficacy building", "Problem-solving skills"],
        timeline: "Decision-making improves in 6-12 months, autonomy develops in 12-18 months"
      },
      OCPD: {
        primaryTherapy: "Cognitive Behavioral Therapy (CBT)",
        duration: "12-24 months",
        benefits: "Increases flexibility and reduces perfectionism",
        secondaryTherapy: "Relaxation Training",
        additionalSupport: ["Flexibility exercises", "Work-life balance", "Mindfulness meditation"],
        timeline: "Rigidity reduces in 6-12 months, flexibility increases in 12-18 months"
      }
    };

    return therapies[disorder] || null;
  };

  const getSeverityLevel = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    if (percentage < 25) return "Minimal";
    if (percentage < 50) return "Mild";
    if (percentage < 75) return "Moderate";
    return "Significant";
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

    const totalQuestions = clusterAQuestions.length + clusterBQuestions.length + clusterCQuestions.length;
    const totalAnswered = Object.keys(answersA).length + Object.keys(answersB).length + Object.keys(answersC).length;

    if (totalAnswered < totalQuestions) {
      toast({
        title: "Incomplete Assessment",
        description: "Please complete all clusters before generating the report.",
        variant: "destructive"
      });
      return;
    }

    const clusterAResults = analyzeCluster(clusterAQuestions, answersA);
    const clusterBResults = analyzeCluster(clusterBQuestions, answersB);
    const clusterCResults = analyzeCluster(clusterCQuestions, answersC);

    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFillColor(139, 92, 246);
    doc.rect(0, 0, 210, 50, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text("COMPREHENSIVE PERSONALITY", 105, 22, { align: "center" });
    doc.text("ASSESSMENT REPORT", 105, 34, { align: "center" });
    
    doc.setFontSize(12);
    doc.text("Based on DSM-5 Personality Disorder Criteria", 105, 43, { align: "center" });

    // Patient Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    yPos = 65;
    doc.text(`Name: ${userName}`, 20, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, yPos);
    yPos += 10;
    doc.text(`Assessment Type: DSM-5 Personality Screening`, 20, yPos);

    // Disclaimer
    yPos += 15;
    doc.setFillColor(255, 243, 224);
    doc.rect(15, yPos - 5, 180, 30, "F");
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.setTextColor(200, 100, 0);
    doc.text("CLINICAL DISCLAIMER", 105, yPos, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    yPos += 7;
    doc.text("This is a screening tool based on DSM-5 criteria for educational purposes only.", 105, yPos, { align: "center" });
    yPos += 5;
    doc.text("It is NOT a diagnostic instrument. Only qualified mental health professionals", 105, yPos, { align: "center" });
    yPos += 5;
    doc.text("can diagnose personality disorders through comprehensive clinical assessment.", 105, yPos, { align: "center" });

    // Cluster A Results
    yPos += 20;
    doc.addPage();
    yPos = 20;
    doc.setFillColor(236, 240, 255);
    doc.rect(15, yPos - 5, 180, 15, "F");
    doc.setFontSize(16);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("CLUSTER A: ODD/ECCENTRIC DISORDERS", 105, yPos + 5, { align: "center" });
    
    yPos += 20;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");

    Object.entries(clusterAResults).forEach(([disorder, score]) => {
      const maxScore = clusterAQuestions.filter(q => q.disorder === disorder).length * 4;
      const severity = getSeverityLevel(score as number, maxScore);
      const therapy = getTherapyRecommendations(disorder, severity);
      
      doc.setFont(undefined, "bold");
      doc.text(`${disorder} Personality Pattern:`, 20, yPos);
      yPos += 7;
      doc.setFont(undefined, "normal");
      doc.text(`Score: ${score}/${maxScore} (${severity} level)`, 25, yPos);
      
      if (therapy && severity !== "Minimal") {
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("Recommended Therapy:", 25, yPos);
        doc.setFont(undefined, "normal");
        yPos += 6;
        doc.text(`Primary: ${therapy.primaryTherapy}`, 30, yPos);
        yPos += 5;
        doc.text(`Duration: ${therapy.duration}`, 30, yPos);
        yPos += 5;
        doc.text(`Benefits: ${therapy.benefits}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
        doc.text(`Timeline: ${therapy.timeline}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
      }
      
      yPos += 8;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Cluster B Results
    doc.addPage();
    yPos = 20;
    doc.setFillColor(236, 240, 255);
    doc.rect(15, yPos - 5, 180, 15, "F");
    doc.setFontSize(16);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("CLUSTER B: DRAMATIC/ERRATIC DISORDERS", 105, yPos + 5, { align: "center" });
    
    yPos += 20;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");

    Object.entries(clusterBResults).forEach(([disorder, score]) => {
      const maxScore = clusterBQuestions.filter(q => q.disorder === disorder).length * 4;
      const severity = getSeverityLevel(score as number, maxScore);
      const therapy = getTherapyRecommendations(disorder, severity);
      
      doc.setFont(undefined, "bold");
      doc.text(`${disorder} Personality Pattern:`, 20, yPos);
      yPos += 7;
      doc.setFont(undefined, "normal");
      doc.text(`Score: ${score}/${maxScore} (${severity} level)`, 25, yPos);
      
      if (therapy && severity !== "Minimal") {
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("Recommended Therapy:", 25, yPos);
        doc.setFont(undefined, "normal");
        yPos += 6;
        doc.text(`Primary: ${therapy.primaryTherapy}`, 30, yPos);
        yPos += 5;
        doc.text(`Duration: ${therapy.duration}`, 30, yPos);
        yPos += 5;
        doc.text(`Benefits: ${therapy.benefits}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
        doc.text(`Timeline: ${therapy.timeline}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
      }
      
      yPos += 8;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    // Cluster C Results
    doc.addPage();
    yPos = 20;
    doc.setFillColor(236, 240, 255);
    doc.rect(15, yPos - 5, 180, 15, "F");
    doc.setFontSize(16);
    doc.setTextColor(139, 92, 246);
    doc.setFont(undefined, "bold");
    doc.text("CLUSTER C: ANXIOUS/FEARFUL DISORDERS", 105, yPos + 5, { align: "center" });
    
    yPos += 20;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");

    Object.entries(clusterCResults).forEach(([disorder, score]) => {
      const maxScore = clusterCQuestions.filter(q => q.disorder === disorder).length * 4;
      const severity = getSeverityLevel(score as number, maxScore);
      const therapy = getTherapyRecommendations(disorder, severity);
      
      doc.setFont(undefined, "bold");
      doc.text(`${disorder} Personality Pattern:`, 20, yPos);
      yPos += 7;
      doc.setFont(undefined, "normal");
      doc.text(`Score: ${score}/${maxScore} (${severity} level)`, 25, yPos);
      
      if (therapy && severity !== "Minimal") {
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        doc.text("Recommended Therapy:", 25, yPos);
        doc.setFont(undefined, "normal");
        yPos += 6;
        doc.text(`Primary: ${therapy.primaryTherapy}`, 30, yPos);
        yPos += 5;
        doc.text(`Duration: ${therapy.duration}`, 30, yPos);
        yPos += 5;
        doc.text(`Benefits: ${therapy.benefits}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
        doc.text(`Timeline: ${therapy.timeline}`, 30, yPos, { maxWidth: 160 });
        yPos += 8;
      }
      
      yPos += 8;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
    });

    // References
    doc.addPage();
    yPos = 20;
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.setTextColor(139, 92, 246);
    doc.text("REFERENCES & RESOURCES", 105, yPos, { align: "center" });
    
    yPos += 15;
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    
    const references = [
      "American Psychiatric Association. (2013). Diagnostic and Statistical Manual of Mental",
      "Disorders (5th ed.). Arlington, VA: American Psychiatric Publishing.",
      "",
      "Livesley, W. J., & Larstone, R. (Eds.). (2018). Handbook of Personality Disorders:",
      "Theory, Research, and Treatment. New York: Guilford Press.",
      "",
      "Beck, A. T., Freeman, A., & Davis, D. D. (2015). Cognitive Therapy of Personality",
      "Disorders (3rd ed.). New York: Guilford Press.",
      "",
      "Linehan, M. M. (2015). DBT Skills Training Manual (2nd ed.). New York: Guilford Press.",
      "",
      "Young, J. E., Klosko, J. S., & Weishaar, M. E. (2003). Schema Therapy:",
      "A Practitioner's Guide. New York: Guilford Press.",
      "",
      "Bateman, A., & Fonagy, P. (2016). Mentalization-Based Treatment for Personality",
      "Disorders: A Practical Guide. Oxford: Oxford University Press."
    ];

    references.forEach(ref => {
      doc.text(ref, 20, yPos, { maxWidth: 170 });
      yPos += 5;
    });

    // Professional Signature
    yPos += 15;
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
    doc.text("License #: [Digital Assessment]", 140, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Screening tool for educational purposes only. Not a substitute for professional diagnosis.", 105, 285, { align: "center" });

    doc.save(`Personality_Assessment_${userName.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "Assessment Complete",
      description: "Your comprehensive personality report has been generated."
    });
  };

  const renderQuestions = (questions: Question[], answers: Record<string, number>, cluster: string) => {
    return (
      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="border-b pb-6 last:border-b-0">
            <Label className="text-base font-semibold mb-4 block">
              {index + 1}. {q.question}
            </Label>
            <RadioGroup
              value={answers[q.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(cluster, q.id, parseInt(value))}
              className="space-y-3"
            >
              {[
                { value: 0, label: "Not at all true" },
                { value: 1, label: "Rarely true" },
                { value: 2, label: "Sometimes true" },
                { value: 3, label: "Often true" },
                { value: 4, label: "Very often true" }
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`${q.id}-${option.value}`} />
                  <Label htmlFor={`${q.id}-${option.value}`} className="cursor-pointer flex-1 font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Who Am I?
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Comprehensive DSM-5 Personality Assessment
          </p>
          <p className="text-sm text-muted-foreground">
            Cluster A (Odd/Eccentric) • Cluster B (Dramatic/Erratic) • Cluster C (Anxious/Fearful)
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
            />
          </div>

          <Tabs defaultValue="clusterA" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="clusterA">Cluster A</TabsTrigger>
              <TabsTrigger value="clusterB">Cluster B</TabsTrigger>
              <TabsTrigger value="clusterC">Cluster C</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clusterA" className="mt-6">
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Cluster A: Odd/Eccentric</h3>
                <p className="text-sm text-muted-foreground">
                  Includes Paranoid, Schizoid, and Schizotypal patterns characterized by odd or eccentric thinking and behavior.
                </p>
              </div>
              {renderQuestions(clusterAQuestions, answersA, "A")}
            </TabsContent>
            
            <TabsContent value="clusterB" className="mt-6">
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Cluster B: Dramatic/Erratic</h3>
                <p className="text-sm text-muted-foreground">
                  Includes Antisocial, Borderline, Histrionic, and Narcissistic patterns characterized by dramatic, emotional, or erratic behavior.
                </p>
              </div>
              {renderQuestions(clusterBQuestions, answersB, "B")}
            </TabsContent>
            
            <TabsContent value="clusterC" className="mt-6">
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Cluster C: Anxious/Fearful</h3>
                <p className="text-sm text-muted-foreground">
                  Includes Avoidant, Dependent, and Obsessive-Compulsive patterns characterized by anxious or fearful thinking and behavior.
                </p>
              </div>
              {renderQuestions(clusterCQuestions, answersC, "C")}
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <Button
              onClick={generatePDF}
              className="w-full"
              size="lg"
            >
              Generate Comprehensive Assessment Report
            </Button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-900 dark:text-amber-200">
              <strong>Important:</strong> This is a screening tool based on DSM-5 criteria for educational purposes only. 
              It is NOT a diagnostic instrument and should not replace professional clinical assessment by a qualified mental health professional.
            </p>
          </div>
        </Card>
      </div>
      <ComplianceFooter />
    </div>
  );
};

export default PersonalityScreening;
