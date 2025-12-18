import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ChevronRight, Download, School, Baby, Briefcase, Users, AlertTriangle, Heart, Brain, Shield, Phone, Mail, ExternalLink, Crown, Star, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface RiskProfile {
  overallRisk: 'low' | 'moderate' | 'high' | 'critical';
  riskScore: number;
  factors: string[];
  protectiveFactors: string[];
}

const SecondaryCare = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [userId, setUserId] = useState<string | null>(null);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'services') setActiveTab('services');
    if (tab === 'programs') setActiveTab('programs');
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      if (session?.user?.id) {
        fetchScreeningResults(session.user.id);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (screeningResults.length > 0) {
      calculateRiskProfile();
    }
  }, [screeningResults]);

  const fetchScreeningResults = async (uid: string) => {
    const { data, error } = await supabase
      .from('screening_results')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setScreeningResults(data);
    }
  };

  const calculateRiskProfile = () => {
    const latestResults: Record<string, ScreeningResult> = {};
    screeningResults.forEach(result => {
      if (!latestResults[result.screening_type]) {
        latestResults[result.screening_type] = result;
      }
    });

    let totalRiskScore = 0;
    const factors: string[] = [];
    const protectiveFactors: string[] = [];

    // PHQ-9 Analysis
    if (latestResults['PHQ-9']) {
      const score = latestResults['PHQ-9'].score;
      if (score >= 20) { totalRiskScore += 40; factors.push('Severe depression symptoms'); }
      else if (score >= 15) { totalRiskScore += 30; factors.push('Moderately severe depression'); }
      else if (score >= 10) { totalRiskScore += 20; factors.push('Moderate depression symptoms'); }
      else if (score >= 5) { totalRiskScore += 10; factors.push('Mild depression symptoms'); }
      else { protectiveFactors.push('Minimal depression symptoms'); }
    }

    // GAD-7 Analysis
    if (latestResults['GAD-7']) {
      const score = latestResults['GAD-7'].score;
      if (score >= 15) { totalRiskScore += 35; factors.push('Severe anxiety symptoms'); }
      else if (score >= 10) { totalRiskScore += 25; factors.push('Moderate anxiety symptoms'); }
      else if (score >= 5) { totalRiskScore += 15; factors.push('Mild anxiety symptoms'); }
      else { protectiveFactors.push('Minimal anxiety symptoms'); }
    }

    // WHO-5 Analysis
    if (latestResults['WHO-5']) {
      const percentScore = (latestResults['WHO-5'].score / 25) * 100;
      if (percentScore < 28) { totalRiskScore += 25; factors.push('Poor overall well-being'); }
      else if (percentScore < 50) { totalRiskScore += 15; factors.push('Below average well-being'); }
      else { protectiveFactors.push('Good overall well-being'); }
    }

    // Determine risk level
    let overallRisk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (totalRiskScore >= 70) overallRisk = 'critical';
    else if (totalRiskScore >= 45) overallRisk = 'high';
    else if (totalRiskScore >= 20) overallRisk = 'moderate';

    setRiskProfile({
      overallRisk,
      riskScore: Math.min(totalRiskScore, 100),
      factors,
      protectiveFactors
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'default';
    }
  };

  const populationPrograms = [
    {
      id: "students",
      title: "Student Mental Health Program",
      icon: School,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      targetAge: "6-25 years",
      description: "Comprehensive screening for academic stress, social anxiety, and developmental challenges",
      screenings: [
        { name: "PHQ-A (Adolescent Depression)", tool: "PHQ-9", description: "Modified for adolescents" },
        { name: "GAD-7 (Anxiety Screening)", tool: "GAD-7", description: "General anxiety assessment" },
        { name: "SCARED (Screen for Child Anxiety)", tool: "SCARED", description: "Pediatric anxiety" },
        { name: "SDQ (Strengths & Difficulties)", tool: "SDQ", description: "Behavioral screening" }
      ],
      riskFactors: ["Academic pressure", "Bullying", "Social media impact", "Peer relationships"],
      referralServices: [
        { name: "School Counselor", type: "free", contact: "Contact school administration" },
        { name: "Child Psychologist", type: "premium", contact: "₹1,500-3,000/session" },
        { name: "Educational Therapist", type: "premium", contact: "₹1,200-2,500/session" }
      ]
    },
    {
      id: "women",
      title: "Women's Mental Health Program",
      icon: Baby,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      targetAge: "18-55 years",
      description: "Specialized screening for perinatal, hormonal, and gender-specific mental health needs",
      screenings: [
        { name: "EPDS (Edinburgh Postnatal)", tool: "EPDS", description: "Postnatal depression" },
        { name: "PHQ-9 (Depression)", tool: "PHQ-9", description: "General depression" },
        { name: "GAD-7 (Anxiety)", tool: "GAD-7", description: "General anxiety" },
        { name: "PSS (Perceived Stress Scale)", tool: "PSS", description: "Stress assessment" }
      ],
      riskFactors: ["Hormonal changes", "Perinatal period", "Work-life balance", "Caregiving burden"],
      referralServices: [
        { name: "Women's Health Clinic", type: "free", contact: "Government health centers" },
        { name: "Perinatal Specialist", type: "premium", contact: "₹2,000-4,000/session" },
        { name: "Hormone Therapy Consultant", type: "premium", contact: "₹1,800-3,500/session" }
      ]
    },
    {
      id: "workplace",
      title: "Workplace Mental Health Program",
      icon: Briefcase,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      targetAge: "22-65 years",
      description: "Corporate wellness screening for burnout, stress, and occupational mental health",
      screenings: [
        { name: "MBI (Maslach Burnout Inventory)", tool: "MBI", description: "Burnout assessment" },
        { name: "WHO-5 (Well-being Index)", tool: "WHO-5", description: "General well-being" },
        { name: "PSS-10 (Perceived Stress)", tool: "PSS", description: "Work stress" },
        { name: "WAI (Work Ability Index)", tool: "WAI", description: "Work capacity" }
      ],
      riskFactors: ["Work overload", "Job insecurity", "Poor work-life balance", "Toxic workplace"],
      referralServices: [
        { name: "EAP (Employee Assistance)", type: "free", contact: "HR Department" },
        { name: "Corporate Psychologist", type: "premium", contact: "₹2,500-5,000/session" },
        { name: "Executive Coach", type: "premium", contact: "₹3,000-8,000/session" }
      ]
    },
    {
      id: "elderly",
      title: "Senior Mental Health Program",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      targetAge: "60+ years",
      description: "Age-appropriate screening for cognitive decline, depression, and social isolation",
      screenings: [
        { name: "GDS (Geriatric Depression Scale)", tool: "GDS", description: "Senior depression" },
        { name: "MMSE (Mini Mental State)", tool: "MMSE", description: "Cognitive screening" },
        { name: "UCLA Loneliness Scale", tool: "UCLA-LS", description: "Social isolation" },
        { name: "Katz ADL (Daily Living)", tool: "ADL", description: "Functional assessment" }
      ],
      riskFactors: ["Social isolation", "Chronic illness", "Bereavement", "Cognitive decline"],
      referralServices: [
        { name: "Senior Day Care Center", type: "free", contact: "Municipal services" },
        { name: "Geriatric Psychiatrist", type: "premium", contact: "₹1,500-3,000/session" },
        { name: "Memory Care Specialist", type: "premium", contact: "₹2,000-4,500/session" }
      ]
    }
  ];

  const generateComprehensiveWellnessPDF = async (programId: string) => {
    setGeneratingPDF(programId);
    const program = populationPrograms.find(p => p.id === programId);
    if (!program) return;

    const doc = new jsPDF();
    const margin = 15;
    let yPos = margin;

    // Header with logo placeholder
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
    doc.text(`${program.title}`, margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Target Population: ${program.targetAge}`, margin, yPos);
    yPos += 5;
    doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, margin, yPos);
    yPos += 12;

    // Risk Assessment Section
    doc.setFillColor(245, 247, 250);
    doc.rect(margin - 5, yPos - 5, 185, 45, 'F');
    
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Risk Assessment Summary", margin, yPos + 3);
    yPos += 12;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (riskProfile) {
      const riskText = `Overall Risk Level: ${riskProfile.overallRisk.toUpperCase()} (Score: ${riskProfile.riskScore}/100)`;
      doc.text(riskText, margin, yPos);
      yPos += 8;

      if (riskProfile.factors.length > 0) {
        doc.text("Risk Factors Identified:", margin, yPos);
        yPos += 5;
        riskProfile.factors.forEach(factor => {
          doc.text(`  • ${factor}`, margin + 5, yPos);
          yPos += 5;
        });
      }
    } else {
      doc.text("Complete screenings to generate risk assessment", margin, yPos);
      yPos += 8;
    }

    yPos += 15;

    // Screening Results
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Your Screening Results", margin, yPos);
    yPos += 10;

    const relevantResults = screeningResults.filter(r => 
      program.screenings.some(s => s.tool === r.screening_type)
    );

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (relevantResults.length > 0) {
      relevantResults.slice(0, 5).forEach(result => {
        doc.text(`${result.screening_type}: ${result.score}/${result.max_score} - ${result.severity || 'Completed'}`, margin, yPos);
        yPos += 6;
      });
    } else {
      doc.text("No screening results available. Complete recommended screenings above.", margin, yPos);
      yPos += 6;
    }

    yPos += 10;

    // Recommended Screenings
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Recommended Screening Tools", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    program.screenings.forEach((screening, idx) => {
      doc.text(`${idx + 1}. ${screening.name}`, margin, yPos);
      yPos += 5;
      doc.setTextColor(120, 120, 120);
      doc.text(`   ${screening.description}`, margin, yPos);
      doc.setTextColor(60, 60, 60);
      yPos += 7;
    });

    // New page for recommendations
    doc.addPage();
    yPos = margin;

    // Header on new page
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Personalized Wellness Recommendations", margin, 13);
    yPos = 30;

    // Wellness Recommendations based on risk
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Personalized Wellness Plan", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const recommendations = getWellnessRecommendations(riskProfile?.overallRisk || 'low', programId);
    recommendations.forEach((rec, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, 175);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6) + 3;
    });

    yPos += 10;

    // Referral Services Section
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Referral Services", margin, yPos);
    yPos += 10;

    // Free Services
    doc.setFillColor(34, 197, 94);
    doc.rect(margin - 2, yPos - 4, 60, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("FREE SERVICES", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    program.referralServices.filter(s => s.type === 'free').forEach(service => {
      doc.text(`• ${service.name}`, margin + 5, yPos);
      yPos += 5;
      doc.setTextColor(100, 100, 100);
      doc.text(`  Contact: ${service.contact}`, margin + 5, yPos);
      doc.setTextColor(60, 60, 60);
      yPos += 7;
    });

    yPos += 5;

    // Premium Services
    doc.setFillColor(168, 85, 247);
    doc.rect(margin - 2, yPos - 4, 80, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("PREMIUM PAID SERVICES", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    program.referralServices.filter(s => s.type === 'premium').forEach(service => {
      doc.text(`• ${service.name}`, margin + 5, yPos);
      yPos += 5;
      doc.setTextColor(100, 100, 100);
      doc.text(`  Pricing: ${service.contact}`, margin + 5, yPos);
      doc.setTextColor(60, 60, 60);
      yPos += 7;
    });

    yPos += 10;

    // Crisis Resources
    doc.setFillColor(239, 68, 68);
    doc.rect(margin - 5, yPos - 5, 185, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Emergency & Crisis Resources", margin, yPos + 3);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("• National Mental Health Helpline: 1800-599-0019 (24/7, Toll-Free)", margin, yPos);
    yPos += 6;
    doc.text("• iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345", margin, yPos);
    yPos += 6;
    doc.text("• NIMHANS Helpline: 080-46110007 | Snehi: 044-24640050", margin, yPos);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("This report is for informational purposes only and does not constitute medical advice.", margin, 275);
    doc.text("Please consult a qualified mental health professional for diagnosis and treatment.", margin, 280);
    doc.text(`Generated by Sarvadamana Mental Health Platform | ${new Date().toLocaleDateString()}`, margin, 285);

    doc.save(`${programId}-wellness-report.pdf`);
    setGeneratingPDF(null);
    
    toast({
      title: "Wellness Report Generated!",
      description: `Your personalized ${program.title} report has been downloaded.`,
    });
  };

  const generateCombinedReportPDF = async () => {
    setGeneratingPDF('combined');
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
    doc.text("Comprehensive Mental Health Report", margin, 26);
    
    yPos = 45;

    // Title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("Combined Mental Health Assessment Report", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Report Generated: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}`, margin, yPos);
    yPos += 15;

    // Overall Risk Score Section
    doc.setFillColor(245, 247, 250);
    doc.rect(margin - 5, yPos - 5, 185, 35, 'F');
    
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Overall Mental Health Risk Assessment", margin, yPos + 3);
    yPos += 12;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    if (riskProfile) {
      const riskText = `Risk Level: ${riskProfile.overallRisk.toUpperCase()} | Score: ${riskProfile.riskScore}/100`;
      doc.text(riskText, margin, yPos);
      yPos += 8;
      
      const interpretation = getRiskInterpretation(riskProfile.overallRisk);
      const lines = doc.splitTextToSize(interpretation, 175);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6);
    }

    yPos += 15;

    // Individual Scale Results
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Individual Screening Results", margin, yPos);
    yPos += 12;

    const scales = [
      { name: 'PHQ-9', description: 'Depression Screening', maxScore: 27 },
      { name: 'GAD-7', description: 'Anxiety Screening', maxScore: 21 },
      { name: 'WHO-5', description: 'Well-Being Index', maxScore: 25 },
      { name: 'Personality', description: 'Personality Assessment', maxScore: 100 }
    ];

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    scales.forEach(scale => {
      const result = screeningResults.find(r => r.screening_type === scale.name);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(`${scale.name} (${scale.description})`, margin, yPos);
      yPos += 6;
      
      doc.setFont('helvetica', 'normal');
      if (result) {
        doc.text(`Score: ${result.score}/${result.max_score} | Severity: ${result.severity || 'Completed'}`, margin + 5, yPos);
        yPos += 5;
        const percentScore = Math.round((result.score / result.max_score) * 100);
        doc.text(`Percentage: ${percentScore}%`, margin + 5, yPos);
      } else {
        doc.setTextColor(150, 150, 150);
        doc.text("Not completed - Please complete this screening", margin + 5, yPos);
      }
      yPos += 10;
    });

    yPos += 5;

    // Risk Factors Section
    if (riskProfile && riskProfile.factors.length > 0) {
      doc.setTextColor(220, 53, 69);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Identified Risk Factors", margin, yPos);
      yPos += 8;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      riskProfile.factors.forEach(factor => {
        doc.text(`• ${factor}`, margin + 5, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Protective Factors Section
    if (riskProfile && riskProfile.protectiveFactors.length > 0) {
      doc.setTextColor(40, 167, 69);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Protective Factors", margin, yPos);
      yPos += 8;

      doc.setTextColor(60, 60, 60);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      riskProfile.protectiveFactors.forEach(factor => {
        doc.text(`• ${factor}`, margin + 5, yPos);
        yPos += 6;
      });
    }

    // New page for recommendations
    doc.addPage();
    yPos = margin;

    // Header on new page
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Recommendations & Action Plan", margin, 13);
    yPos = 30;

    // Recommendations
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Personalized Recommendations", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const recommendations = getCombinedRecommendations(riskProfile?.overallRisk || 'low');
    recommendations.forEach((rec, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${rec}`, 175);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6) + 3;
    });

    yPos += 10;

    // Next Steps
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Recommended Next Steps", margin, yPos);
    yPos += 10;

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const nextSteps = getNextSteps(riskProfile?.overallRisk || 'low');
    nextSteps.forEach((step, idx) => {
      const lines = doc.splitTextToSize(`${idx + 1}. ${step}`, 175);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 6) + 3;
    });

    yPos += 15;

    // Crisis Resources
    doc.setFillColor(239, 68, 68);
    doc.rect(margin - 5, yPos - 5, 185, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Emergency & Crisis Resources", margin, yPos + 3);
    yPos += 12;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("• National Mental Health Helpline: 1800-599-0019 (24/7, Toll-Free)", margin, yPos);
    yPos += 6;
    doc.text("• iCall: 9152987821 | Vandrevala Foundation: 1860-2662-345", margin, yPos);
    yPos += 6;
    doc.text("• NIMHANS Helpline: 080-46110007 | Snehi: 044-24640050", margin, yPos);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("This report is for informational purposes only and does not constitute medical advice.", margin, 275);
    doc.text("Please consult a qualified mental health professional for diagnosis and treatment.", margin, 280);
    doc.text(`Generated by Sarvadamana Mental Health Platform | ${new Date().toLocaleDateString()}`, margin, 285);

    doc.save('combined-mental-health-report.pdf');
    setGeneratingPDF(null);
    
    toast({
      title: "Report Generated!",
      description: "Your comprehensive mental health report has been downloaded.",
    });
  };

  const getRiskInterpretation = (risk: string): string => {
    switch (risk) {
      case 'critical': return 'Your assessment indicates significant mental health concerns that require immediate professional attention. Please reach out to a mental health professional or crisis helpline.';
      case 'high': return 'Your results suggest elevated mental health concerns. We strongly recommend consulting with a mental health professional for a thorough evaluation and support.';
      case 'moderate': return 'Your assessment shows some areas of concern. Consider speaking with a counselor or therapist to develop coping strategies and preventive measures.';
      default: return 'Your results indicate good overall mental health. Continue practicing self-care and maintain healthy habits to support your well-being.';
    }
  };

  const getCombinedRecommendations = (riskLevel: string): string[] => {
    const base = [
      "Maintain a consistent sleep schedule of 7-9 hours per night",
      "Practice mindfulness or meditation for 10-15 minutes daily",
      "Engage in regular physical activity for at least 30 minutes daily",
      "Stay connected with supportive friends and family",
      "Limit alcohol and caffeine consumption"
    ];
    
    if (riskLevel === 'critical' || riskLevel === 'high') {
      return [
        "Seek immediate consultation with a mental health professional",
        "Consider therapy or counseling sessions",
        "Share your concerns with a trusted person",
        ...base
      ];
    } else if (riskLevel === 'moderate') {
      return [
        "Consider speaking with a counselor about your concerns",
        "Join a support group or wellness program",
        ...base
      ];
    }
    return base;
  };

  const getNextSteps = (riskLevel: string): string[] => {
    if (riskLevel === 'critical') {
      return [
        "Contact a mental health professional within the next 24-48 hours",
        "If experiencing crisis symptoms, call a helpline immediately",
        "Complete any screenings you haven't taken yet",
        "Schedule a follow-up assessment in 2 weeks"
      ];
    } else if (riskLevel === 'high') {
      return [
        "Schedule an appointment with a mental health professional",
        "Complete any screenings you haven't taken yet",
        "Track your mood and symptoms daily",
        "Reassess your mental health in 4 weeks"
      ];
    } else if (riskLevel === 'moderate') {
      return [
        "Consider consulting with a counselor",
        "Complete all 4 screening tools for comprehensive assessment",
        "Implement the wellness recommendations above",
        "Reassess your mental health in 6-8 weeks"
      ];
    }
    return [
      "Continue with your current wellness practices",
      "Complete any remaining screenings for full assessment",
      "Reassess your mental health every 3 months",
      "Stay informed about mental health and self-care"
    ];
  };

  const getWellnessRecommendations = (riskLevel: string, programId: string): string[] => {
    const baseRecommendations: Record<string, string[]> = {
      students: [
        "Establish a consistent sleep schedule of 8-9 hours per night",
        "Practice 10-15 minutes of mindfulness or meditation daily",
        "Limit social media usage to 1-2 hours per day",
        "Engage in physical activity for at least 30 minutes daily",
        "Join peer support groups or school counseling sessions",
        "Practice time management techniques for academic work"
      ],
      women: [
        "Prioritize self-care activities and personal time",
        "Maintain regular sleep patterns and rest periods",
        "Connect with support groups for shared experiences",
        "Practice stress-reduction techniques like yoga or breathing exercises",
        "Schedule regular health check-ups including mental health screenings",
        "Build a support network of family, friends, and professionals"
      ],
      workplace: [
        "Set clear boundaries between work and personal time",
        "Take regular breaks during work hours (every 90 minutes)",
        "Practice stress management techniques during high-pressure periods",
        "Communicate openly with supervisors about workload concerns",
        "Utilize Employee Assistance Programs when available",
        "Engage in hobbies and activities outside of work"
      ],
      elderly: [
        "Maintain regular social connections with family and friends",
        "Engage in cognitive stimulation activities (puzzles, reading, games)",
        "Participate in group activities at community centers",
        "Establish a daily routine with meaningful activities",
        "Stay physically active with age-appropriate exercises",
        "Ensure regular medical check-ups and medication reviews"
      ]
    };

    const riskSpecificAdditions: Record<string, string[]> = {
      critical: [
        "URGENT: Seek immediate professional mental health support",
        "Consider intensive outpatient or inpatient treatment options",
        "Establish daily check-ins with a trusted support person",
        "Remove access to harmful substances or objects"
      ],
      high: [
        "Schedule an appointment with a mental health professional within 1 week",
        "Consider medication consultation with a psychiatrist",
        "Implement daily mood tracking and journaling",
        "Increase frequency of therapy sessions"
      ],
      moderate: [
        "Consider starting therapy or counseling sessions",
        "Implement weekly self-assessment using screening tools",
        "Build coping strategies for challenging situations"
      ]
    };

    const recommendations = [...(baseRecommendations[programId] || baseRecommendations.students)];
    
    if (riskLevel !== 'low' && riskSpecificAdditions[riskLevel]) {
      recommendations.unshift(...riskSpecificAdditions[riskLevel]);
    }

    return recommendations;
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
            Early Detection Through Comprehensive Screening Programs
          </p>
        </div>

        {/* Risk Profile Summary Card */}
        {riskProfile && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Your Risk Assessment Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Overall Risk Level</p>
                  <Badge variant={getRiskBadge(riskProfile.overallRisk) as any} className="text-lg px-4 py-1">
                    {riskProfile.overallRisk.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
                  <div className="flex items-center gap-3">
                    <Progress value={riskProfile.riskScore} className="flex-1" />
                    <span className="font-bold">{riskProfile.riskScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Screenings Completed</p>
                  <p className="text-2xl font-bold text-primary">{screeningResults.length}</p>
                </div>
              </div>
              
              {riskProfile.factors.length > 0 && (
                <div className="mt-4 p-4 bg-destructive/10 rounded-lg">
                  <p className="font-semibold text-destructive flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Factors Identified
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {riskProfile.factors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {riskProfile.protectiveFactors.length > 0 && (
                <div className="mt-4 p-4 bg-green-500/10 rounded-lg">
                  <p className="font-semibold text-green-600 flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4" />
                    Protective Factors
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {riskProfile.protectiveFactors.map((factor, idx) => (
                      <li key={idx}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Screening Tools</TabsTrigger>
            <TabsTrigger value="programs">Population Programs</TabsTrigger>
            <TabsTrigger value="services">Referral Services</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Combined Mental Health Risk Score */}
            <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  General Mental Health Risk Score
                </CardTitle>
                <CardDescription>
                  Combined analysis of all 4 screening scales (PHQ-9, GAD-7, WHO-5, Personality)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {riskProfile ? (
                  <>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-muted"
                          />
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${(riskProfile.riskScore / 100) * 352} 352`}
                            className={riskProfile.overallRisk === 'critical' ? 'text-red-500' : 
                                      riskProfile.overallRisk === 'high' ? 'text-orange-500' : 
                                      riskProfile.overallRisk === 'moderate' ? 'text-yellow-500' : 'text-green-500'}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold">{riskProfile.riskScore}</span>
                          <span className="text-xs text-muted-foreground">/100</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskBadge(riskProfile.overallRisk)} className="text-sm">
                            {riskProfile.overallRisk.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on your completed screenings across depression, anxiety, well-being, and personality assessments.
                        </p>
                      </div>
                    </div>

                    {/* Individual Scale Results */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {['PHQ-9', 'GAD-7', 'WHO-5', 'Personality'].map(scale => {
                        const result = screeningResults.find(r => r.screening_type === scale);
                        return (
                          <div key={scale} className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{scale}</span>
                              {result ? (
                                <Badge variant="outline" className="text-xs">
                                  {result.score}/{result.max_score}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">Not completed</Badge>
                              )}
                            </div>
                            {result ? (
                              <>
                                <Progress value={(result.score / result.max_score) * 100} className="h-2 mb-1" />
                                <p className="text-xs text-muted-foreground">{result.severity || 'Completed'}</p>
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground">Complete this screening to add to your risk profile</p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Risk Factors & Protective Factors */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {riskProfile.factors.length > 0 && (
                        <div className="p-4 bg-red-500/10 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            Risk Factors
                          </h4>
                          <ul className="space-y-1">
                            {riskProfile.factors.map((factor, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {riskProfile.protectiveFactors.length > 0 && (
                        <div className="p-4 bg-green-500/10 rounded-lg">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            Protective Factors
                          </h4>
                          <ul className="space-y-1">
                            {riskProfile.protectiveFactors.map((factor, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground">• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <Button onClick={() => generateCombinedReportPDF()} className="w-full gap-2" disabled={generatingPDF === 'combined'}>
                      {generatingPDF === 'combined' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download Combined Mental Health Report (PDF)
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="font-semibold mb-2">No Screenings Completed Yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete the screening tools below to generate your combined mental health risk score and comprehensive report.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Screening Tools</CardTitle>
                <CardDescription>
                  Evidence-based assessment tools to measure mental health risk - complete all 4 for comprehensive analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <Card className="border-2 border-primary/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="w-5 h-5 text-primary" />
                        PHQ-9 Depression Screening
                        <Badge variant="secondary">Gold Standard</Badge>
                        {screeningResults.find(r => r.screening_type === 'PHQ-9') && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        9-item questionnaire measuring depression severity. Scores range from 0-27 with clinical cut-offs for mild, moderate, moderately severe, and severe depression.
                      </p>
                      <div className="flex gap-2">
                        <Link to="/depression-screening" className="flex-1">
                          <Button className="w-full">Start PHQ-9 Screening</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-accent/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-accent" />
                        GAD-7 Anxiety Screening
                        <Badge variant="secondary">WHO Validated</Badge>
                        {screeningResults.find(r => r.screening_type === 'GAD-7') && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        7-item scale for detecting generalized anxiety disorder. Provides severity classification and treatment recommendations based on score thresholds.
                      </p>
                      <div className="flex gap-2">
                        <Link to="/anxiety-screening" className="flex-1">
                          <Button className="w-full" variant="secondary">Start GAD-7 Screening</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-500/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-green-500" />
                        WHO-5 Well-Being Index
                        <Badge variant="secondary">WHO Validated</Badge>
                        {screeningResults.find(r => r.screening_type === 'WHO-5') && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        5-item scale measuring psychological well-being over the past 2 weeks. Scores range from 0-25, with percentage scores indicating overall mental wellness.
                      </p>
                      <Link to="/screening-tools?scale=who5">
                        <Button className="w-full" variant="outline">Start WHO-5 Screening</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-500/20 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-purple-500" />
                        Personality Assessment
                        <Badge variant="outline">Comprehensive</Badge>
                        {screeningResults.find(r => r.screening_type === 'Personality') && (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Understand your personality traits, behavioral patterns, and psychological tendencies with personalized insights and growth recommendations.
                      </p>
                      <Link to="/personality-screening">
                        <Button className="w-full" variant="outline">Start Personality Screening</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            {/* Child Mental Health - Early Intervention */}
            <Card className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-cyan-500/20 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-cyan-500/20">
                      <Baby className="h-8 w-8 text-cyan-600" />
                    </div>
                    <div>
                      <Badge className="mb-2 bg-cyan-500/20 text-cyan-700 hover:bg-cyan-500/30">Early Intervention</Badge>
                      <h3 className="font-semibold text-lg mb-1">Child Mental Health - ASD & Developmental</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive early intervention center for children with Autism Spectrum Disorder (ASD) and developmental challenges. Includes the Mind Physics™ Engine for cognitive-behavioral tools.
                      </p>
                    </div>
                  </div>
                  <Link to="/child-mental-health">
                    <Button size="lg" className="gap-2 whitespace-nowrap bg-cyan-600 hover:bg-cyan-700">
                      <Brain className="h-4 w-4" />
                      Explore Program
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Population-Specific Screening Entry */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Population-Specific Screening Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      Select your category (Students, Women, Workplace, Elderly) for tailored screening tools with embedded risk scores, interpretations, and downloadable wellness PDF reports.
                    </p>
                  </div>
                  <Link to="/screening-tools">
                    <Button size="lg" className="gap-2 whitespace-nowrap">
                      <Users className="h-4 w-4" />
                      Start Screening
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              {populationPrograms.map((program) => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className={`h-2 ${program.bgColor.replace('/10', '')}`} />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${program.bgColor}`}>
                        <program.icon className={`h-6 w-6 ${program.color}`} />
                      </div>
                      <div>
                        <span>{program.title}</span>
                        <p className="text-sm font-normal text-muted-foreground mt-1">
                          Target: {program.targetAge}
                        </p>
                      </div>
                    </CardTitle>
                    <CardDescription>{program.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Screening Tools */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Recommended Screenings
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {program.screenings.map((screening, idx) => (
                          <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                            <p className="font-medium text-sm">{screening.name}</p>
                            <p className="text-xs text-muted-foreground">{screening.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Key Risk Factors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {program.riskFactors.map((factor, idx) => (
                          <Badge key={idx} variant="outline" className="bg-orange-500/10">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Referral Services Preview */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        Available Services
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {program.referralServices.slice(0, 2).map((service, idx) => (
                          <div key={idx} className={`p-3 rounded-lg flex items-center gap-2 ${service.type === 'free' ? 'bg-green-500/10' : 'bg-purple-500/10'}`}>
                            {service.type === 'premium' ? (
                              <Crown className="h-4 w-4 text-purple-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.contact}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Generate PDF Button */}
                    <Button
                      onClick={() => generateComprehensiveWellnessPDF(program.id)}
                      className="w-full gap-2"
                      disabled={generatingPDF === program.id}
                    >
                      {generatingPDF === program.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Generate Wellness Report (PDF)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Services */}
              <Card className="border-2 border-green-500/20">
                <CardHeader className="bg-green-500/10">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Free Referral Services
                  </CardTitle>
                  <CardDescription>Government and community-based support</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        National Mental Health Helpline
                      </h4>
                      <p className="text-2xl font-bold text-green-600 mt-1">1800-599-0019</p>
                      <p className="text-sm text-muted-foreground">24/7 Toll-Free | NIMHANS</p>
                    </div>
                    
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">iCall Psychosocial Helpline</h4>
                      <p className="text-lg font-bold text-green-600">9152987821</p>
                      <p className="text-sm text-muted-foreground">Mon-Sat, 8am-10pm</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">Vandrevala Foundation</h4>
                      <p className="text-lg font-bold text-green-600">1860-2662-345</p>
                      <p className="text-sm text-muted-foreground">24/7 Multilingual Support</p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">District Mental Health Program</h4>
                      <p className="text-sm text-muted-foreground">Free counseling at government hospitals</p>
                      <Button variant="link" className="p-0 h-auto text-green-600">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Find nearest center
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Services */}
              <Card className="border-2 border-purple-500/20">
                <CardHeader className="bg-purple-500/10">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Crown className="h-5 w-5" />
                    Premium Paid Services
                  </CardTitle>
                  <CardDescription>Professional specialized care</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Online Psychiatrist Consultation</h4>
                          <p className="text-sm text-muted-foreground">Video consultation with certified psychiatrists</p>
                        </div>
                        <Badge className="bg-purple-500">₹800-2000</Badge>
                      </div>
                      <Button variant="outline" className="w-full mt-3 gap-2">
                        <Star className="h-4 w-4" />
                        Book Appointment
                      </Button>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Clinical Psychologist</h4>
                          <p className="text-sm text-muted-foreground">Therapy & psychological assessment</p>
                        </div>
                        <Badge className="bg-purple-500">₹1500-3500</Badge>
                      </div>
                      <Button variant="outline" className="w-full mt-3 gap-2">
                        <Star className="h-4 w-4" />
                        Find Psychologist
                      </Button>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Wellness Retreat Programs</h4>
                          <p className="text-sm text-muted-foreground">Residential mental wellness programs</p>
                        </div>
                        <Badge className="bg-purple-500">₹15,000+</Badge>
                      </div>
                      <Button variant="outline" className="w-full mt-3 gap-2">
                        <Star className="h-4 w-4" />
                        View Programs
                      </Button>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="h-5 w-5 text-purple-500" />
                        <h4 className="font-semibold">Premium Care Package</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Includes: Monthly psychiatrist review + Weekly therapy + 24/7 crisis support
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">Most Popular</Badge>
                        <span className="font-bold text-purple-600">₹8,999/month</span>
                      </div>
                      <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700">
                        Subscribe Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Card */}
            <Card className="border-2 border-red-500/50 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-red-600 text-lg">Crisis & Emergency Services</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      If you or someone you know is in immediate danger, please contact emergency services immediately.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="font-bold text-red-600 text-xl">112</p>
                        <p className="text-xs">Emergency Services</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="font-bold text-red-600 text-xl">1800-599-0019</p>
                        <p className="text-xs">Mental Health Crisis</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="font-bold text-red-600 text-xl">9152987821</p>
                        <p className="text-xs">Suicide Prevention</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <PageNavigation />
    </div>
  );
};

export default SecondaryCare;
