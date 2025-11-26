import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Brain, Users, Activity, Sun, School, Briefcase, Baby, FileText, Download } from "lucide-react";
import { Link } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";
import { useState } from "react";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

const PrimaryCare = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const mentalHealthCategories = [
    {
      id: "school",
      title: "School Mental Health",
      icon: School,
      color: "text-blue-500",
      description: "Supporting students' emotional well-being and academic success",
      keyAreas: [
        "Academic Stress Management",
        "Social Development",
        "Early Intervention",
        "Mental Health Education",
        "Self-Care Practices"
      ],
      preventionStrategies: [
        "Implement mental health education in curriculum",
        "Create peer support programs",
        "Train teachers in recognizing warning signs",
        "Establish school counseling services",
        "Promote work-life balance for students"
      ]
    },
    {
      id: "women",
      title: "Women's Mental Health",
      icon: Baby,
      color: "text-pink-500",
      description: "Comprehensive support for women's unique mental health needs",
      keyAreas: [
        "Hormonal Health",
        "Reproductive Mental Health",
        "Life Transitions",
        "Trauma & Safety",
        "Self-Care & Empowerment"
      ],
      preventionStrategies: [
        "Educate on hormonal changes and mental health",
        "Provide prenatal and postpartum mental health screening",
        "Create safe spaces for women to share experiences",
        "Promote self-compassion and boundary setting",
        "Address gender-based violence and trauma"
      ]
    },
    {
      id: "workplace",
      title: "Workplace Mental Health",
      icon: Briefcase,
      color: "text-green-500",
      description: "Creating healthy work environments for employee well-being",
      keyAreas: [
        "Stress Management",
        "Burnout Prevention",
        "Workplace Relationships",
        "Performance & Well-being",
        "Work-Life Integration"
      ],
      preventionStrategies: [
        "Implement workplace wellness programs",
        "Promote flexible work arrangements",
        "Train managers in mental health awareness",
        "Create employee assistance programs (EAP)",
        "Encourage regular breaks and time off"
      ]
    },
    {
      id: "senior",
      title: "Senior Mental Health",
      icon: Users,
      color: "text-purple-500",
      description: "Promoting mental wellness and dignity in later years",
      keyAreas: [
        "Cognitive Health",
        "Emotional Well-being",
        "Social Connection",
        "Active Aging",
        "Health Management"
      ],
      preventionStrategies: [
        "Promote social engagement and community activities",
        "Provide cognitive stimulation programs",
        "Address loneliness and isolation",
        "Support meaningful life transitions",
        "Integrate physical and mental health care"
      ]
    }
  ];

  const promotionStrategies = [
    {
      title: "Mental Health Literacy",
      icon: Brain,
      description: "Education programs to increase awareness and understanding of mental health",
      activities: [
        "Community workshops on mental health awareness",
        "School-based mental health education",
        "Public campaigns to reduce stigma",
        "Digital literacy programs"
      ]
    },
    {
      title: "Life Skills Development",
      icon: Users,
      description: "WHO-recommended life skills training for resilience",
      activities: [
        "Problem-solving and decision-making skills",
        "Critical and creative thinking",
        "Communication and interpersonal skills",
        "Self-awareness and empathy building"
      ]
    },
    {
      title: "Healthy Lifestyle Promotion",
      icon: Activity,
      description: "Physical and mental wellness integration",
      activities: [
        "Regular physical activity programs",
        "Nutrition and diet education",
        "Sleep hygiene practices",
        "Stress management techniques"
      ]
    },
    {
      title: "Social Support Networks",
      icon: Heart,
      description: "Building protective community connections",
      activities: [
        "Peer support groups",
        "Family counseling services",
        "Community engagement activities",
        "Workplace wellness programs"
      ]
    }
  ];

  const generatePDF = (category: typeof mentalHealthCategories[0]) => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text("Primary Prevention Program", margin, yPos);
    yPos += 15;

    // Category Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(category.title, margin, yPos);
    yPos += 10;

    // Description
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(category.description, 170);
    doc.text(descLines, margin, yPos);
    yPos += (descLines.length * 6) + 10;

    // Key Areas
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Key Focus Areas:", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    category.keyAreas.forEach((area, index) => {
      doc.text(`${index + 1}. ${area}`, margin + 5, yPos);
      yPos += 6;
    });
    yPos += 10;

    // Prevention Strategies
    doc.setFontSize(14);
    doc.text("Prevention Strategies:", margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    category.preventionStrategies.forEach((strategy, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${strategy}`, 165);
      doc.text(lines, margin + 5, yPos);
      yPos += (lines.length * 6);
      
      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
    });

    // WHO Framework Section
    if (yPos > 200) {
      doc.addPage();
      yPos = margin;
    } else {
      yPos += 15;
    }

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.text("WHO Mental Health Promotion Framework", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    promotionStrategies.forEach((strategy) => {
      doc.setFontSize(12);
      doc.text(strategy.title, margin, yPos);
      yPos += 6;
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      strategy.activities.forEach((activity) => {
        const activityLines = doc.splitTextToSize(`• ${activity}`, 165);
        doc.text(activityLines, margin + 5, yPos);
        yPos += (activityLines.length * 5);
      });
      yPos += 8;

      if (yPos > 270) {
        doc.addPage();
        yPos = margin;
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Sarvadamana Mental Health Platform", margin, 285);
    doc.text(new Date().toLocaleDateString(), 170, 285);

    doc.save(`${category.id}-primary-prevention-program.pdf`);
    
    toast({
      title: "PDF Generated!",
      description: `Your ${category.title} prevention program has been downloaded.`,
    });
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
          <h1 className="text-4xl font-bold mb-4 text-foreground">Primary Prevention</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mental Health Promotion and Risk Factor Control - WHO Guidelines
          </p>
        </div>

        <Tabs defaultValue="categories" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Population Categories</TabsTrigger>
            <TabsTrigger value="promotion">Mental Health Promotion</TabsTrigger>
            <TabsTrigger value="risk">Risk Factor Control</TabsTrigger>
          </TabsList>

          {/* Population Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  Target Population Groups
                </CardTitle>
                <CardDescription>
                  Specialized prevention strategies for different populations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {mentalHealthCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <category.icon className={`h-6 w-6 ${category.color}`} />
                          {category.title}
                        </CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Key Focus Areas:</h4>
                          <ul className="space-y-1">
                            {category.keyAreas.map((area, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {area}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm mb-2">Prevention Strategies:</h4>
                          <ul className="space-y-1">
                            {category.preventionStrategies.slice(0, 3).map((strategy, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2 text-muted-foreground">
                                <span className="text-primary mt-1">✓</span>
                                {strategy}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          onClick={() => generatePDF(category)}
                          className="w-full gap-2"
                          variant="outline"
                        >
                          <Download className="h-4 w-4" />
                          Download Prevention Program (PDF)
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mental Health Promotion Tab */}
          <TabsContent value="promotion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-6 w-6 text-primary" />
                  WHO Mental Health Promotion Framework
                </CardTitle>
                <CardDescription>
                  Evidence-based strategies to promote positive mental health and well-being in communities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {promotionStrategies.map((strategy, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <strategy.icon className="h-5 w-5 text-primary" />
                          {strategy.title}
                        </CardTitle>
                        <CardDescription>{strategy.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {strategy.activities.map((activity, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Factor Control Tab */}
          <TabsContent value="risk" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Risk Factor Control Methods
                </CardTitle>
                <CardDescription>
                  Identifying and managing risk factors for mental health disorders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      category: "Biological Risk Factors",
                      factors: ["Genetic predisposition", "Neurochemical imbalances", "Chronic physical illness", "Substance use disorders"],
                      interventions: ["Regular health check-ups", "Medication management", "Substance abuse prevention", "Early intervention programs"]
                    },
                    {
                      category: "Psychological Risk Factors",
                      factors: ["Low self-esteem", "Poor coping skills", "Trauma history", "Negative thought patterns"],
                      interventions: ["Cognitive behavioral therapy", "Mindfulness practices", "Trauma-informed care", "Positive psychology interventions"]
                    },
                    {
                      category: "Social Risk Factors",
                      factors: ["Social isolation", "Discrimination and stigma", "Poverty and unemployment", "Family dysfunction"],
                      interventions: ["Community integration programs", "Anti-stigma campaigns", "Economic support services", "Family therapy and support"]
                    }
                  ].map((risk, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">{risk.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Risk Factors:</h4>
                            <ul className="space-y-1">
                              {risk.factors.map((factor, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-destructive mt-1">⚠</span>
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2 text-sm">Interventions:</h4>
                            <ul className="space-y-1">
                              {risk.interventions.map((intervention, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-primary mt-1">✓</span>
                                  {intervention}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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

export default PrimaryCare;
