import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, Heart, Briefcase, Users, Brain, CheckCircle, 
  ArrowRight, Download, AlertTriangle, Shield, FileText, BarChart3,
  ChevronRight, Clock, Target, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import BottomNav from "@/components/BottomNav";
import jsPDF from "jspdf";

interface ScreeningResult {
  id: string;
  screening_type: string;
  score: number;
  max_score: number;
  percentage_score: number | null;
  severity: string | null;
  created_at: string;
}

interface CategoryConfig {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  targetAge: string;
  description: string;
  scales: {
    name: string;
    key: string;
    description: string;
    duration: string;
    questions: number;
  }[];
}

const categories: CategoryConfig[] = [
  {
    id: "students",
    title: "Students",
    icon: GraduationCap,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    targetAge: "6-25 years",
    description: "Academic stress, exam anxiety, peer pressure",
    scales: [
      { name: "Student Stress Assessment", key: "students", description: "Academic stress & social pressure", duration: "5 min", questions: 10 },
      { name: "PHQ-9 Depression", key: "PHQ-9", description: "Depression symptoms screening", duration: "3 min", questions: 9 },
      { name: "GAD-7 Anxiety", key: "GAD-7", description: "Anxiety disorder screening", duration: "2 min", questions: 7 },
    ]
  },
  {
    id: "women",
    title: "Women's Health",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    targetAge: "18-55 years",
    description: "Perinatal, hormonal, work-life balance",
    scales: [
      { name: "Women's Wellness Assessment", key: "women", description: "Emotional & physical wellness", duration: "5 min", questions: 10 },
      { name: "PHQ-9 Depression", key: "PHQ-9", description: "Depression symptoms screening", duration: "3 min", questions: 9 },
      { name: "GAD-7 Anxiety", key: "GAD-7", description: "Anxiety disorder screening", duration: "2 min", questions: 7 },
    ]
  },
  {
    id: "workplace",
    title: "Workplace",
    icon: Briefcase,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    targetAge: "22-65 years",
    description: "Burnout, work stress, career satisfaction",
    scales: [
      { name: "Workplace Stress Assessment", key: "workplace", description: "Burnout & work-life balance", duration: "5 min", questions: 10 },
      { name: "WHO-5 Well-Being", key: "WHO-5", description: "Overall well-being index", duration: "2 min", questions: 5 },
      { name: "PHQ-9 Depression", key: "PHQ-9", description: "Depression symptoms screening", duration: "3 min", questions: 9 },
    ]
  },
  {
    id: "elderly",
    title: "Senior Health",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    targetAge: "60+ years",
    description: "Cognitive health, social isolation, life transitions",
    scales: [
      { name: "Senior Wellness Assessment", key: "elderly", description: "Cognitive & social wellness", duration: "5 min", questions: 10 },
      { name: "PHQ-9 Depression", key: "PHQ-9", description: "Depression symptoms screening", duration: "3 min", questions: 9 },
      { name: "WHO-5 Well-Being", key: "WHO-5", description: "Overall well-being index", duration: "2 min", questions: 5 },
    ]
  }
];

const ScreeningTools = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        setUserId(session.user.id);
        fetchScreeningResults(session.user.id);
      }
    });
  }, []);

  const fetchScreeningResults = async (uid: string) => {
    const { data, error } = await supabase
      .from('screening_results')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setScreeningResults(data);
    }
  };

  const getLatestResultForScale = (scaleKey: string): ScreeningResult | null => {
    return screeningResults.find(r => r.screening_type === scaleKey) || null;
  };

  const getRiskInterpretation = (result: ScreeningResult) => {
    const percentage = result.percentage_score || Math.round((result.score / result.max_score) * 100);
    
    if (percentage >= 70) {
      return { level: "High Risk", color: "text-destructive", bgColor: "bg-destructive/10", badge: "destructive" };
    } else if (percentage >= 50) {
      return { level: "Moderate Risk", color: "text-amber-500", bgColor: "bg-amber-500/10", badge: "secondary" };
    } else if (percentage >= 30) {
      return { level: "Low Risk", color: "text-blue-500", bgColor: "bg-blue-500/10", badge: "outline" };
    }
    return { level: "Minimal Risk", color: "text-green-500", bgColor: "bg-green-500/10", badge: "default" };
  };

  const calculateOverallRisk = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;

    const relevantResults = category.scales
      .map(scale => getLatestResultForScale(scale.key))
      .filter(Boolean) as ScreeningResult[];

    if (relevantResults.length === 0) return null;

    const avgPercentage = relevantResults.reduce((sum, r) => {
      return sum + (r.percentage_score || Math.round((r.score / r.max_score) * 100));
    }, 0) / relevantResults.length;

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (avgPercentage >= 70) riskLevel = 'critical';
    else if (avgPercentage >= 50) riskLevel = 'high';
    else if (avgPercentage >= 30) riskLevel = 'moderate';

    return { riskLevel, avgPercentage, completedCount: relevantResults.length };
  };

  const getScaleRoute = (scaleKey: string) => {
    switch (scaleKey) {
      case 'students': return '/screening/students';
      case 'women': return '/screening/women';
      case 'workplace': return '/screening/workplace';
      case 'elderly': return '/screening/elderly';
      case 'PHQ-9': return '/depression-screening';
      case 'GAD-7': return '/anxiety-screening';
      case 'WHO-5': return '/secondary-care?tool=who5';
      default: return '/secondary-care';
    }
  };

  const generateWellnessReport = async (categoryId: string) => {
    setGeneratingPDF(true);
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;

    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("SARVADAMANA", margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("Mental Health & Wellness Platform", margin, 26);
    
    yPos = 45;

    // Title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`${category.title} Wellness Report`, margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Target Population: ${category.targetAge}`, margin, yPos);
    yPos += 5;
    doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, margin, yPos);
    yPos += 12;

    // Risk Assessment
    const overallRisk = calculateOverallRisk(categoryId);
    doc.setFillColor(245, 247, 250);
    doc.rect(margin - 5, yPos - 5, 185, 35, 'F');
    
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Overall Risk Assessment", margin, yPos + 3);
    yPos += 12;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (overallRisk) {
      doc.text(`Risk Level: ${overallRisk.riskLevel.toUpperCase()} (Score: ${Math.round(overallRisk.avgPercentage)}%)`, margin, yPos);
      yPos += 6;
      doc.text(`Screenings Completed: ${overallRisk.completedCount} of ${category.scales.length}`, margin, yPos);
    } else {
      doc.text("Complete screenings to generate risk assessment", margin, yPos);
    }
    yPos += 20;

    // Screening Results
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Screening Results", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    category.scales.forEach(scale => {
      const result = getLatestResultForScale(scale.key);
      if (result) {
        const interpretation = getRiskInterpretation(result);
        doc.text(`${scale.name}: ${result.score}/${result.max_score} - ${interpretation.level}`, margin, yPos);
        yPos += 6;
      } else {
        doc.text(`${scale.name}: Not completed`, margin, yPos);
        yPos += 6;
      }
    });

    yPos += 10;

    // Recommendations
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Personalized Recommendations", margin, yPos);
    yPos += 10;

    const recommendations = getRecommendations(categoryId, overallRisk?.riskLevel || 'low');
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    recommendations.forEach((rec, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, 175);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 5) + 3;
    });

    // Referral Services
    doc.addPage();
    yPos = 25;

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Referral Services & Resources", margin, 13);

    // Free Services
    yPos = 35;
    doc.setFillColor(34, 197, 94);
    doc.rect(margin - 2, yPos - 4, 60, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("FREE SERVICES", margin, yPos);
    yPos += 12;

    const freeServices = [
      { name: "iCall Helpline", contact: "9152987821" },
      { name: "NIMHANS Helpline", contact: "080-46110007" },
      { name: "Vandrevala Foundation", contact: "1860-2662-345" },
    ];

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    freeServices.forEach(service => {
      doc.text(`• ${service.name}: ${service.contact}`, margin + 5, yPos);
      yPos += 6;
    });

    yPos += 10;

    // Premium Services
    doc.setFillColor(168, 85, 247);
    doc.rect(margin - 2, yPos - 4, 80, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("PREMIUM PAID SERVICES", margin, yPos);
    yPos += 12;

    const premiumServices = [
      { name: "Psychiatrist Consultation", price: "₹1,500-3,000/session" },
      { name: "Psychologist Session", price: "₹1,200-2,500/session" },
      { name: "Wellness Coaching", price: "₹800-1,500/session" },
    ];

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    premiumServices.forEach(service => {
      doc.text(`• ${service.name}: ${service.price}`, margin + 5, yPos);
      yPos += 6;
    });

    // Crisis Resources
    yPos += 15;
    doc.setFillColor(239, 68, 68);
    doc.rect(margin - 5, yPos - 5, 185, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Emergency & Crisis Resources", margin, yPos + 3);
    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("• National Mental Health Helpline: 1800-599-0019 (24/7, Toll-Free)", margin, yPos);
    yPos += 6;
    doc.text("• Snehi: 044-24640050 | AASRA: 9820466726", margin, yPos);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("This report is for informational purposes only and does not constitute medical advice.", margin, 275);
    doc.text(`Generated by Sarvadamana Mental Health Platform | ${new Date().toLocaleDateString()}`, margin, 280);

    doc.save(`${categoryId}-wellness-report.pdf`);
    setGeneratingPDF(false);

    toast({
      title: "Report Generated!",
      description: "Your personalized wellness report has been downloaded.",
    });
  };

  const getRecommendations = (categoryId: string, riskLevel: string): string[] => {
    const base: Record<string, string[]> = {
      students: [
        "Practice study-break intervals using the Pomodoro technique",
        "Engage in 30 minutes of physical activity daily",
        "Maintain consistent sleep schedule (8-9 hours)",
        "Join peer support or study groups",
        "Limit social media to 1-2 hours per day",
      ],
      women: [
        "Schedule regular self-care activities weekly",
        "Practice stress-reduction techniques like yoga",
        "Maintain social connections and support networks",
        "Get regular health check-ups including mental health",
        "Set boundaries between work and personal time",
      ],
      workplace: [
        "Take regular breaks every 90 minutes during work",
        "Set clear boundaries between work and personal life",
        "Practice stress management during high-pressure periods",
        "Utilize Employee Assistance Programs if available",
        "Engage in hobbies outside of work",
      ],
      elderly: [
        "Maintain regular social connections with family and friends",
        "Engage in cognitive stimulation activities daily",
        "Participate in community group activities",
        "Stay physically active with age-appropriate exercises",
        "Ensure regular medical check-ups",
      ],
    };

    const riskAdditions: Record<string, string[]> = {
      critical: ["URGENT: Seek immediate professional mental health support", "Consider intensive support options"],
      high: ["Schedule appointment with mental health professional within 1 week", "Implement daily mood tracking"],
      moderate: ["Consider starting therapy or counseling sessions", "Build coping strategies for challenging situations"],
    };

    const recommendations = [...(base[categoryId] || base.students)];
    if (riskLevel !== 'low' && riskAdditions[riskLevel]) {
      recommendations.unshift(...riskAdditions[riskLevel]);
    }
    return recommendations;
  };

  const renderCategorySelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Select Your Category</h1>
        <p className="text-muted-foreground">Choose the population-specific screening that best fits you</p>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const overallRisk = calculateOverallRisk(category.id);
          const Icon = category.icon;

          return (
            <Card 
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${category.bgColor}`}>
                    <Icon className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Target: {category.targetAge}</p>
                  </div>
                  <div className="text-right">
                    {overallRisk ? (
                      <Badge variant={overallRisk.riskLevel === 'critical' || overallRisk.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                        {overallRisk.completedCount}/{category.scales.length} completed
                      </Badge>
                    ) : (
                      <Badge variant="outline">Not started</Badge>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-2 ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );

  const renderCategoryScreenings = () => {
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    const overallRisk = calculateOverallRisk(category.id);
    const Icon = category.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="mb-2">
          ← Back to Categories
        </Button>

        {/* Category Header */}
        <Card className={`border-2 ${category.bgColor.replace('/10', '/20')}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-xl ${category.bgColor}`}>
                <Icon className={`h-8 w-8 ${category.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{category.title} Screening</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>

            {/* Overall Risk Display */}
            {overallRisk && (
              <div className={`p-4 rounded-lg ${
                overallRisk.riskLevel === 'critical' ? 'bg-destructive/10' :
                overallRisk.riskLevel === 'high' ? 'bg-orange-500/10' :
                overallRisk.riskLevel === 'moderate' ? 'bg-amber-500/10' : 'bg-green-500/10'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Overall Risk Level
                  </span>
                  <Badge variant={
                    overallRisk.riskLevel === 'critical' || overallRisk.riskLevel === 'high' 
                      ? 'destructive' : 'secondary'
                  }>
                    {overallRisk.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <Progress value={overallRisk.avgPercentage} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Risk Score: {Math.round(overallRisk.avgPercentage)}% | 
                  Completed: {overallRisk.completedCount}/{category.scales.length} screenings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screening Scales */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Recommended Screening Scales
          </h3>

          {category.scales.map((scale) => {
            const result = getLatestResultForScale(scale.key);
            const interpretation = result ? getRiskInterpretation(result) : null;

            return (
              <Card key={scale.key} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">{scale.name}</h4>
                        <p className="text-sm text-muted-foreground">{scale.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {scale.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {scale.questions} questions
                          </span>
                        </div>
                      </div>
                      {result ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : null}
                    </div>

                    {/* Embedded Result Display */}
                    {result && interpretation && (
                      <div className={`p-3 rounded-lg ${interpretation.bgColor} mb-3`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-semibold ${interpretation.color}`}>
                            {interpretation.level}
                          </span>
                          <span className="text-sm font-medium">
                            Score: {result.score}/{result.max_score}
                          </span>
                        </div>
                        <Progress 
                          value={result.percentage_score || Math.round((result.score / result.max_score) * 100)} 
                          className="h-2" 
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Completed: {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        variant={result ? "outline" : "default"}
                        onClick={() => navigate(getScaleRoute(scale.key))}
                      >
                        {result ? "Retake Screening" : "Start Screening"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid gap-3 pt-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => generateWellnessReport(category.id)}
            disabled={generatingPDF || !overallRisk}
          >
            {generatingPDF ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download Wellness Report PDF
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/secondary-care?tab=services')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Referral Services
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <BackButton fallbackPath="/secondary-care" />

      <div className="container mx-auto px-4 pt-16 max-w-lg">
        {selectedCategory ? renderCategoryScreenings() : renderCategorySelection()}
      </div>

      <BottomNav />
    </div>
  );
};

export default ScreeningTools;
