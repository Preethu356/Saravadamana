import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Shield, Brain, Users, Activity, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";

const PrimaryCare = () => {
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

  const riskFactors = [
    {
      category: "Biological Risk Factors",
      factors: [
        "Genetic predisposition",
        "Neurochemical imbalances",
        "Chronic physical illness",
        "Substance use disorders"
      ],
      interventions: [
        "Regular health check-ups",
        "Medication management",
        "Substance abuse prevention",
        "Early intervention programs"
      ]
    },
    {
      category: "Psychological Risk Factors",
      factors: [
        "Low self-esteem",
        "Poor coping skills",
        "Trauma history",
        "Negative thought patterns"
      ],
      interventions: [
        "Cognitive behavioral therapy",
        "Mindfulness practices",
        "Trauma-informed care",
        "Positive psychology interventions"
      ]
    },
    {
      category: "Social Risk Factors",
      factors: [
        "Social isolation",
        "Discrimination and stigma",
        "Poverty and unemployment",
        "Family dysfunction"
      ],
      interventions: [
        "Community integration programs",
        "Anti-stigma campaigns",
        "Economic support services",
        "Family therapy and support"
      ]
    }
  ];

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

        <Tabs defaultValue="promotion" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="promotion">Mental Health Promotion</TabsTrigger>
            <TabsTrigger value="risk">Risk Factor Control</TabsTrigger>
          </TabsList>

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
                  {riskFactors.map((risk, index) => (
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
