import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Phone, Calendar, Shield, Heart, ArrowLeft, Play, Check } from "lucide-react";
import PracticeModal from "@/components/PracticeModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

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
