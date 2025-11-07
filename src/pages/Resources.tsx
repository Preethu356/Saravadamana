import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Phone, Calendar, Shield, Heart, ArrowLeft, Play } from "lucide-react";
import Footer from "@/components/Footer";
import PracticeModal from "@/components/PracticeModal";

const ResourcesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("self-care");
  const [activePractice, setActivePractice] = useState<{
    title: string;
    icon: string;
    type: "breathing" | "meditation" | "muscle-relaxation" | "grounding";
  } | null>(null);

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

  const supportGroupsContent = [
    {
      title: "Anxiety Support Community",
      description: "Connect with others managing anxiety disorders",
      members: "12,450+ members",
      icon: "💙"
    },
    {
      title: "Depression Recovery Circle",
      description: "Peer support for depression and mood disorders",
      members: "8,920+ members",
      icon: "🌈"
    },
    {
      title: "Stress Management Group",
      description: "Share coping strategies for daily stress",
      members: "15,600+ members",
      icon: "🧠"
    },
    {
      title: "Mindfulness Community",
      description: "Practice mindfulness together",
      members: "20,100+ members",
      icon: "🕉️"
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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
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
            <div className="grid md:grid-cols-2 gap-6">
              {supportGroupsContent.map((group, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="text-4xl mb-2">{group.icon}</div>
                    <CardTitle>{group.title}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{group.members}</p>
                    <Button className="w-full">Join Community</Button>
                  </CardContent>
                </Card>
              ))}
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
    </div>
  );
};

export default ResourcesPage;
