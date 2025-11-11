import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Brain, Users, Shield, TrendingUp, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkplaceMentalHealth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Workplace Mental Health
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creating healthy work environments and supporting employee well-being for sustainable productivity
          </p>
        </div>

        {/* Key Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Stress Management</CardTitle>
              <CardDescription>
                Managing workplace pressure, deadlines, and work-related stress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Time management techniques</li>
                <li>• Deadline pressure coping</li>
                <li>• Workload balance strategies</li>
                <li>• Stress reduction exercises</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Burnout Prevention</CardTitle>
              <CardDescription>
                Recognizing and preventing professional burnout
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Early warning signs recognition</li>
                <li>• Work-life boundaries setting</li>
                <li>• Energy management practices</li>
                <li>• Recovery and rest strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Workplace Relationships</CardTitle>
              <CardDescription>
                Building healthy professional relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Effective communication skills</li>
                <li>• Conflict resolution techniques</li>
                <li>• Team collaboration strategies</li>
                <li>• Professional boundary maintenance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle>Performance & Well-being</CardTitle>
              <CardDescription>
                Balancing productivity with mental health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sustainable performance practices</li>
                <li>• Goal setting without overwhelm</li>
                <li>• Self-compassion at work</li>
                <li>• Progress tracking methods</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-pink-500 mb-2" />
              <CardTitle>Work-Life Integration</CardTitle>
              <CardDescription>
                Creating harmony between career and personal life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Boundary setting strategies</li>
                <li>• Time allocation techniques</li>
                <li>• Personal priority management</li>
                <li>• Flexible work arrangements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-cyan-500 mb-2" />
              <CardTitle>Mental Health Support</CardTitle>
              <CardDescription>
                Accessing and utilizing workplace resources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Employee assistance programs</li>
                <li>• Mental health days utilization</li>
                <li>• Peer support networks</li>
                <li>• Professional counseling access</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Resources & Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Professional Wellness Tools</CardTitle>
            <CardDescription>
              Resources designed for working professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/mood-tracker")} variant="default">
                Track Your Stress
              </Button>
              <Button onClick={() => navigate("/ai-support")} variant="secondary">
                Talk to Mini Menti
              </Button>
              <Button onClick={() => navigate("/journal")} variant="outline">
                Work Journal
              </Button>
              <Button onClick={() => navigate("/wellness-tools")} variant="outline">
                Stress Relief Tools
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Remember:</strong> Your mental health is as important as your professional success. 
            If work-related stress is affecting your daily life or you're experiencing burnout, 
            consider reaching out to a mental health professional or your HR department about available support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkplaceMentalHealth;