import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Baby, Users, Sparkles, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";

const WomenMentalHealth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Heart className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Women's Mental Health
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive mental health support addressing the unique experiences and challenges faced by women
          </p>
        </div>

        {/* Key Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-pink-500 mb-2" />
              <CardTitle>Hormonal Health</CardTitle>
              <CardDescription>
                Understanding the mental health impact of hormonal changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Menstrual cycle mood management</li>
                <li>• PMS and PMDD support</li>
                <li>• Perimenopause mental health</li>
                <li>• Menopause emotional wellness</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Baby className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Reproductive Mental Health</CardTitle>
              <CardDescription>
                Support during pregnancy, postpartum, and fertility journeys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Prenatal anxiety and depression</li>
                <li>• Postpartum mental health</li>
                <li>• Fertility-related stress</li>
                <li>• Pregnancy loss support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Life Transitions</CardTitle>
              <CardDescription>
                Navigating major life changes and role adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Career and motherhood balance</li>
                <li>• Empty nest syndrome</li>
                <li>• Relationship transitions</li>
                <li>• Identity and self-discovery</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-500 mb-2" />
              <CardTitle>Trauma & Safety</CardTitle>
              <CardDescription>
                Healing from trauma and building emotional safety
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Trauma-informed care</li>
                <li>• Abuse recovery support</li>
                <li>• Safety planning strategies</li>
                <li>• Empowerment and advocacy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
              <CardTitle>Self-Care & Empowerment</CardTitle>
              <CardDescription>
                Building resilience and prioritizing well-being
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Self-compassion practices</li>
                <li>• Boundary setting skills</li>
                <li>• Stress management techniques</li>
                <li>• Personal growth strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-pink-500 mb-2" />
              <CardTitle>Body & Mind Connection</CardTitle>
              <CardDescription>
                Holistic approach to women's wellness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Body image and self-esteem</li>
                <li>• Eating disorder awareness</li>
                <li>• Physical health integration</li>
                <li>• Mindfulness practices</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Resources & Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Women's Wellness Resources</CardTitle>
            <CardDescription>
              Supportive tools designed for women's unique mental health needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/mood-tracker")} variant="default">
                Track Your Cycle & Mood
              </Button>
              <Button onClick={() => navigate("/ai-support")} variant="secondary">
                Talk to Mini Menti
              </Button>
              <Button onClick={() => navigate("/journal")} variant="outline">
                Personal Journal
              </Button>
              <Button onClick={() => navigate("/wellness-tools")} variant="outline">
                Self-Care Tools
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Your well-being matters:</strong> Women's mental health is influenced by biological, 
            psychological, and social factors. If you're experiencing persistent symptoms or crisis, 
            please reach out to a mental health professional specializing in women's health. 
            You deserve compassionate, specialized care.
          </p>
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};

export default WomenMentalHealth;