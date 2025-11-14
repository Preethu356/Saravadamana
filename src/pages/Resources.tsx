import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BookOpen, Users, Phone, Calendar, Shield, Heart, ArrowLeft, Play, Check, Download, Activity } from "lucide-react";
import PracticeModal from "@/components/PracticeModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import { User } from "@supabase/supabase-js";
import PageNavigation from "@/components/PageNavigation";

interface Community {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ResourcesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("self-care");
  const [activePractice, setActivePractice] = useState<{
    title: string;
    icon: string;
    type: "breathing" | "meditation" | "muscle-relaxation" | "grounding";
  } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [dualDiagnosisAnswers, setDualDiagnosisAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Get user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserMemberships();
    }
  }, [user]);

  const fetchCommunities = async () => {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching communities:', error);
    } else if (data) {
      setCommunities(data);
      // Fetch member counts for each community
      data.forEach(community => fetchMemberCount(community.id));
    }
  };

  const fetchMemberCount = async (communityId: string) => {
    const { count, error } = await supabase
      .from('community_members')
      .select('*', { count: 'exact', head: true })
      .eq('community_id', communityId);

    if (!error && count !== null) {
      setMemberCounts(prev => ({ ...prev, [communityId]: count }));
    }
  };

  const fetchUserMemberships = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching memberships:', error);
    } else if (data) {
      setJoinedCommunities(new Set(data.map(m => m.community_id)));
    }
  };

  const handleJoinCommunity = async (communityId: string, communityName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join communities.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from('community_members')
      .insert({
        community_id: communityId,
        user_id: user.id
      });

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast({
          title: "Already joined",
          description: "You're already a member of this community.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join community. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      setJoinedCommunities(prev => new Set([...prev, communityId]));
      fetchMemberCount(communityId);
      toast({
        title: "Welcome!",
        description: `You've joined ${communityName}`,
      });
    }
  };

  const handleLeaveCommunity = async (communityId: string, communityName: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to leave community. Please try again.",
        variant: "destructive"
      });
    } else {
      setJoinedCommunities(prev => {
        const newSet = new Set(prev);
        newSet.delete(communityId);
        return newSet;
      });
      fetchMemberCount(communityId);
      toast({
        title: "Left community",
        description: `You've left ${communityName}`,
      });
    }
  };

  const selfCareContent = [
    {
      title: "Breathing Exercises",
      description: "Deep breathing techniques to reduce anxiety and stress",
      content: "Practice 4-7-8 breathing: Inhale for 4 counts, hold for 7, exhale for 8. Repeat 4 times.",
      icon: "🫁",
      type: "breathing" as const
    },
    {
      title: "Guided Meditation",
      description: "5-minute mindfulness meditation for beginners",
      content: "Find a quiet space, close your eyes, and focus on your breath. When thoughts arise, gently return focus to breathing.",
      icon: "🧘",
      type: "meditation" as const
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Release physical tension throughout your body",
      content: "Tense each muscle group for 5 seconds, then release. Start from toes and work up to your head.",
      icon: "💪",
      type: "muscle-relaxation" as const
    },
    {
      title: "Grounding Techniques",
      description: "5-4-3-2-1 method for managing anxiety",
      content: "Identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
      icon: "🌿",
      type: "grounding" as const
    }
  ];

  const crisisResources = [
    {
      title: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 free and confidential support",
      type: "Call or Text"
    },
    {
      title: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Connect with a crisis counselor",
      type: "Text"
    },
    {
      title: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      type: "Call"
    },
    {
      title: "Veterans Crisis Line",
      number: "1-800-273-8255 (Press 1)",
      description: "Support for veterans and their families",
      type: "Call or Text"
    }
  ];

  const dualDiagnosisScreening = [
    { id: "q1", question: "Do you use alcohol or drugs to cope with stress, anxiety, or depression?" },
    { id: "q2", question: "Have you noticed your mental health symptoms worsen when using substances?" },
    { id: "q3", question: "Do you find it difficult to control your substance use?" },
    { id: "q4", question: "Have you experienced withdrawal symptoms when trying to stop?" },
    { id: "q5", question: "Has substance use interfered with your work, relationships, or daily activities?" },
    { id: "q6", question: "Do you continue using despite knowing it's harming your mental health?" },
    { id: "q7", question: "Have you tried to quit but found yourself using again?" },
    { id: "q8", question: "Do you need more of the substance to get the same effect?" },
  ];

  const indiaDeaddictionHelplines = [
    {
      name: "NIMHANS De-addiction Centre",
      phone: "080-26995000",
      location: "Bangalore, Karnataka",
      services: "24/7 Crisis intervention, Inpatient & Outpatient services"
    },
    {
      name: "National Drug Dependence Treatment Centre (NDDTC)",
      phone: "011-26593301",
      location: "AIIMS, New Delhi",
      services: "Treatment, Counseling, Rehabilitation"
    },
    {
      name: "Society for Nutrition, Education & Health Action (SNEHA)",
      phone: "91675-35020",
      location: "Mumbai, Maharashtra",
      services: "De-addiction counseling and support"
    },
    {
      name: "Muktangan Rehabilitation Center",
      phone: "020-24468810",
      location: "Pune, Maharashtra",
      services: "Residential treatment, Family therapy"
    },
    {
      name: "Kripa Foundation",
      phone: "1800-11-0031 (Toll-free)",
      location: "Pan-India",
      services: "De-addiction centers across India"
    },
    {
      name: "T.T. Ranganathan Clinical Research Foundation",
      phone: "044-24917781",
      location: "Chennai, Tamil Nadu",
      services: "Treatment & Rehabilitation"
    }
  ];

  const generateDualDiagnosisPDF = () => {
    const score = Object.values(dualDiagnosisAnswers).reduce((sum, val) => sum + val, 0);
    const totalQuestions = dualDiagnosisScreening.length;
    
    if (Object.keys(dualDiagnosisAnswers).length < totalQuestions) {
      toast({
        title: "Incomplete Assessment",
        description: "Please answer all questions before generating PDF.",
        variant: "destructive"
      });
      return;
    }

    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text("Dual Diagnosis Screening Report", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${today}`, 105, 28, { align: "center" });

    // Score
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Score: ${score}/${totalQuestions * 3}`, 20, 45);

    // Interpretation
    doc.setFontSize(12);
    doc.text("Assessment Results:", 20, 58);
    doc.setFontSize(10);
    
    let interpretation = "";
    if (score < 8) {
      interpretation = "Low Risk: Your responses suggest minimal concern for dual diagnosis.";
    } else if (score < 16) {
      interpretation = "Moderate Risk: Consider speaking with a healthcare professional.";
    } else {
      interpretation = "High Risk: Professional evaluation recommended. Please seek help.";
    }
    
    doc.text(interpretation, 20, 66, { maxWidth: 170 });

    // Resources
    doc.setFontSize(12);
    doc.text("India De-addiction Helplines:", 20, 82);
    doc.setFontSize(9);
    
    let yPos = 90;
    indiaDeaddictionHelplines.slice(0, 4).forEach((helpline) => {
      doc.setFont(undefined, "bold");
      doc.text(helpline.name, 20, yPos);
      doc.setFont(undefined, "normal");
      yPos += 5;
      doc.text(`Phone: ${helpline.phone}`, 20, yPos);
      yPos += 4;
      doc.text(`Location: ${helpline.location}`, 20, yPos);
      yPos += 4;
      doc.text(`Services: ${helpline.services}`, 20, yPos, { maxWidth: 170 });
      yPos += 10;
    });

    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      "Disclaimer: This is a screening tool only and not a diagnostic instrument. Please consult a healthcare professional for proper evaluation.",
      20, 
      yPos + 10,
      { maxWidth: 170 }
    );

    doc.save(`dual-diagnosis-screening-${today}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: "Your screening report has been downloaded."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Mental Health
            </span>{" "}
            Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and support for your mental wellness journey
          </p>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="self-care">
              <BookOpen className="w-4 h-4 mr-2" />
              Self-Care
            </TabsTrigger>
            <TabsTrigger value="support">
              <Users className="w-4 h-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="crisis">
              <Phone className="w-4 h-4 mr-2" />
              Crisis
            </TabsTrigger>
            <TabsTrigger value="dual-diagnosis">
              <Activity className="w-4 h-4 mr-2" />
              Dual Diagnosis
            </TabsTrigger>
            <TabsTrigger value="therapy">
              <Calendar className="w-4 h-4 mr-2" />
              Therapy
            </TabsTrigger>
            <TabsTrigger value="privacy">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="wellness">
              <Heart className="w-4 h-4 mr-2" />
              Wellness
            </TabsTrigger>
          </TabsList>

          <TabsContent value="self-care" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {selfCareContent.map((item, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="text-4xl mb-2">{item.icon}</div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{item.content}</p>
                    <Button 
                      className="w-full gap-2"
                      onClick={() => setActivePractice({ title: item.title, icon: item.icon, type: item.type })}
                    >
                      <Play className="w-4 h-4" />
                      Start Practice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            {!user && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <p className="text-center text-sm">
                    <Button variant="link" onClick={() => navigate("/login")} className="px-1">
                      Sign in
                    </Button>
                    to join communities and connect with others
                  </p>
                </CardContent>
              </Card>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {communities.map((community) => {
                const isJoined = joinedCommunities.has(community.id);
                const memberCount = memberCounts[community.id] || 0;
                
                return (
                  <Card key={community.id} className="border-2 hover:border-primary/50 transition-all">
                    <CardHeader>
                      <div className="text-4xl mb-2">{community.icon}</div>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription>{community.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {memberCount.toLocaleString()}+ members
                      </p>
                      {isJoined ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-2">
                            <Check className="w-4 h-4" />
                            You're a member
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleLeaveCommunity(community.id, community.name)}
                          >
                            Leave Community
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleJoinCommunity(community.id, community.name)}
                        >
                          Join Community
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <Card className="bg-destructive/10 border-destructive/50 border-2">
              <CardHeader>
                <CardTitle className="text-destructive">⚠️ If You're in Crisis</CardTitle>
                <CardDescription>
                  If you're having thoughts of suicide or self-harm, please reach out immediately. Help is available 24/7.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              {crisisResources.map((resource, index) => (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">{resource.number}</div>
                    <div className="text-sm text-muted-foreground mb-4">{resource.type}</div>
                    <Button variant="destructive" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Get Help Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="dual-diagnosis" className="space-y-6">
            {/* Overview Section */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="text-2xl">Understanding Dual Diagnosis</CardTitle>
                <CardDescription>
                  Co-occurring Mental Health and Substance Use Disorders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">
                  Dual diagnosis (also called co-occurring disorders) occurs when a person experiences both a mental health disorder and a substance use disorder simultaneously. These conditions often interact, making treatment more complex but recovery is absolutely possible with proper integrated care.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      Common Mental Health Conditions
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Depression</li>
                      <li>• Anxiety Disorders</li>
                      <li>• Bipolar Disorder</li>
                      <li>• Post-Traumatic Stress Disorder (PTSD)</li>
                      <li>• Schizophrenia</li>
                      <li>• Personality Disorders</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-background rounded-lg border">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-destructive" />
                      Commonly Abused Substances
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Alcohol</li>
                      <li>• Cannabis/Marijuana</li>
                      <li>• Opioids (prescription & illicit)</li>
                      <li>• Stimulants (cocaine, methamphetamine)</li>
                      <li>• Benzodiazepines</li>
                      <li>• Tobacco/Nicotine</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screening Tool */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Dual Diagnosis Screening Tool
                </CardTitle>
                <CardDescription>
                  This brief screening helps identify potential co-occurring disorders. Answer honestly - your responses are confidential.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dualDiagnosisScreening.map((item, index) => (
                  <div key={item.id} className="p-4 bg-muted/50 rounded-lg border">
                    <p className="font-medium mb-3">{index + 1}. {item.question}</p>
                    <RadioGroup
                      value={dualDiagnosisAnswers[item.id]?.toString()}
                      onValueChange={(value) => 
                        setDualDiagnosisAnswers(prev => ({ ...prev, [item.id]: parseInt(value) }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id={`${item.id}-never`} />
                        <Label htmlFor={`${item.id}-never`} className="cursor-pointer">Never (0)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id={`${item.id}-sometimes`} />
                        <Label htmlFor={`${item.id}-sometimes`} className="cursor-pointer">Sometimes (1)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2" id={`${item.id}-often`} />
                        <Label htmlFor={`${item.id}-often`} className="cursor-pointer">Often (2)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id={`${item.id}-always`} />
                        <Label htmlFor={`${item.id}-always`} className="cursor-pointer">Always (3)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}

                <Button 
                  className="w-full gap-2 mt-6" 
                  size="lg"
                  onClick={generateDualDiagnosisPDF}
                >
                  <Download className="w-5 h-5" />
                  Generate Screening Report (PDF)
                </Button>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mt-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> This screening tool is for educational purposes only and does not replace professional diagnosis. If you scored moderate to high, please consult a healthcare provider.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* De-addiction Helplines India */}
            <Card className="border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Phone className="w-6 h-6 text-green-600" />
                  India De-addiction Helplines
                </CardTitle>
                <CardDescription>
                  24/7 support and treatment centers across India for substance use disorders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {indiaDeaddictionHelplines.map((helpline, index) => (
                    <Card key={index} className="border-2 hover:border-green-500 transition-all">
                      <CardHeader>
                        <CardTitle className="text-lg">{helpline.name}</CardTitle>
                        <CardDescription className="text-xs">{helpline.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${helpline.phone.replace(/\s/g, '')}`} className="font-bold text-lg hover:underline">
                            {helpline.phone}
                          </a>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {helpline.services}
                        </p>
                        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                          <a href={`tel:${helpline.phone.replace(/\s/g, '')}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-background rounded-lg border">
                  <h4 className="font-semibold mb-2">Additional Resources:</h4>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• <strong>National Helpline:</strong> 1800-11-0031 (Kripa Foundation - Toll Free)</li>
                    <li>• <strong>Ministry of Social Justice:</strong> Visit local District Social Welfare Office</li>
                    <li>• <strong>Narcotics Anonymous India:</strong> Check local NA meetings in your city</li>
                    <li>• <strong>Alcoholics Anonymous India:</strong> AA meetings available nationwide</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Treatment Approaches */}
            <Card>
              <CardHeader>
                <CardTitle>Integrated Treatment Approach</CardTitle>
                <CardDescription>Effective treatment addresses both conditions simultaneously</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2">1. Medical Detox</h4>
                    <p className="text-sm text-muted-foreground">
                      Safe withdrawal management under medical supervision
                    </p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                    <h4 className="font-semibold mb-2">2. Psychotherapy</h4>
                    <p className="text-sm text-muted-foreground">
                      CBT, DBT, and trauma-informed therapy approaches
                    </p>
                  </div>
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <h4 className="font-semibold mb-2">3. Medication</h4>
                    <p className="text-sm text-muted-foreground">
                      Prescribed medications for mental health and substance use
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Recovery is Possible</h4>
                  <p className="text-sm text-muted-foreground">
                    With proper integrated treatment, individuals with dual diagnosis can achieve lasting recovery. Treatment should address both the mental health condition and substance use disorder together, not separately. Support groups, family therapy, and ongoing care are essential components of successful recovery.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="therapy">
            <Card>
              <CardHeader>
                <CardTitle>Find a Therapist</CardTitle>
                <CardDescription>Connect with licensed mental health professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">We partner with verified therapy platforms to help you find the right therapist for your needs.</p>
                <div className="space-y-3">
                  <Button className="w-full justify-start">Psychology Today - Find Local Therapists</Button>
                  <Button className="w-full justify-start" variant="secondary">BetterHelp - Online Therapy</Button>
                  <Button className="w-full justify-start" variant="secondary">Talkspace - Text & Video Therapy</Button>
                  <Button className="w-full justify-start" variant="outline">SAMHSA Treatment Locator</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>🔒 Your Privacy Matters</CardTitle>
                <CardDescription>How we protect your mental health data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
                    <p className="text-sm text-muted-foreground">All your conversations and data are encrypted and secure.</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Anonymous Use Available</h3>
                    <p className="text-sm text-muted-foreground">You can use our services without providing personal information.</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">HIPAA Compliant</h3>
                    <p className="text-sm text-muted-foreground">We follow strict healthcare privacy regulations.</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Your Data, Your Control</h3>
                    <p className="text-sm text-muted-foreground">Export or delete your data anytime.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wellness">
            <Card>
              <CardHeader>
                <CardTitle>Wellness Tracking Tools</CardTitle>
                <CardDescription>Monitor and improve your mental health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                    <h3 className="font-semibold mb-2">📊 Mood Tracker</h3>
                    <p className="text-sm text-muted-foreground">Track daily emotions and identify patterns</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                    <h3 className="font-semibold mb-2">📝 Digital Journal</h3>
                    <p className="text-sm text-muted-foreground">Express yourself through writing</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                    <h3 className="font-semibold mb-2">🎯 Goal Setting</h3>
                    <p className="text-sm text-muted-foreground">Set and track mental health goals</p>
                  </div>
                  <div className="p-4 border-2 rounded-lg hover:border-primary/50 transition-all cursor-pointer">
                    <h3 className="font-semibold mb-2">📈 Progress Reports</h3>
                    <p className="text-sm text-muted-foreground">Visualize your wellness journey</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {activePractice && (
        <PracticeModal
          open={!!activePractice}
          onOpenChange={(open) => !open && setActivePractice(null)}
          practice={activePractice}
        />
      )}
      <PageNavigation />
    </div>
  );
};

export default ResourcesPage;
