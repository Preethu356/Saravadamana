import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { School, Brain, Users, AlertCircle, BookOpen, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";

const SchoolMentalHealth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <School className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            School Mental Health
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Supporting students' emotional well-being and academic success through evidence-based mental health practices
          </p>
        </div>

        {/* Key Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Academic Stress Management</CardTitle>
              <CardDescription>
                Tools and strategies to manage exam anxiety, homework pressure, and performance expectations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Study skills and time management</li>
                <li>• Test anxiety reduction techniques</li>
                <li>• Goal setting and achievement strategies</li>
                <li>• Balance between academics and life</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Social Development</CardTitle>
              <CardDescription>
                Building healthy relationships, peer support, and social skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Friendship building and maintenance</li>
                <li>• Bullying prevention and intervention</li>
                <li>• Communication skills development</li>
                <li>• Peer pressure resistance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertCircle className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle>Early Intervention</CardTitle>
              <CardDescription>
                Identifying and addressing mental health concerns early
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Recognizing warning signs</li>
                <li>• School counselor support</li>
                <li>• Parent-teacher collaboration</li>
                <li>• Crisis intervention protocols</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Mental Health Education</CardTitle>
              <CardDescription>
                Teaching emotional intelligence and mental wellness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Emotional literacy programs</li>
                <li>• Stress management workshops</li>
                <li>• Self-awareness activities</li>
                <li>• Coping skills training</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-pink-500 mb-2" />
              <CardTitle>Self-Care Practices</CardTitle>
              <CardDescription>
                Daily habits for mental and emotional well-being
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sleep hygiene for students</li>
                <li>• Healthy eating habits</li>
                <li>• Physical activity routines</li>
                <li>• Mindfulness and relaxation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-cyan-500 mb-2" />
              <CardTitle>Special Challenges</CardTitle>
              <CardDescription>
                Addressing unique school-related concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Transition support (school changes)</li>
                <li>• Learning difficulties accommodation</li>
                <li>• Identity and self-esteem</li>
                <li>• Digital wellness and screen time</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Resources & Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Get Support Now</CardTitle>
            <CardDescription>
              Access tools and resources designed for student mental health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/mood-tracker")} variant="default">
                Track Your Mood
              </Button>
              <Button onClick={() => navigate("/ai-support")} variant="secondary">
                Talk to Mini Menti
              </Button>
              <Button onClick={() => navigate("/journal")} variant="outline">
                Start Journaling
              </Button>
              <Button onClick={() => navigate("/wellness-tools")} variant="outline">
                Explore Wellness Tools
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Important:</strong> If you're experiencing a mental health crisis or having thoughts of self-harm, 
            please reach out to a trusted adult, school counselor, or call emergency services immediately. 
            This platform is for support and education, not emergency intervention.
          </p>
        </div>
      </div>
      <PageNavigation />
    </div>
  );
};

export default SchoolMentalHealth;