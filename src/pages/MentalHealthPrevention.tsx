import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Heart, Activity, Brain, Users, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageNavigation from "@/components/PageNavigation";

const MentalHealthPrevention = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mental Health Prevention
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building resilience and preventing mental health challenges through evidence-based strategies
          </p>
        </div>

        {/* Prevention Levels */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow border-green-200 dark:border-green-800">
            <CardHeader>
              <Heart className="w-10 h-10 text-green-500 mb-2" />
              <CardTitle className="text-green-700 dark:text-green-300">Primary Prevention</CardTitle>
              <CardDescription>
                Preventing mental health issues before they occur
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Mental health education and awareness</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Building protective factors and resilience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Promoting healthy lifestyle habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>Stress management skills development</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/primary-care")} className="w-full mt-4" variant="outline">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-blue-200 dark:border-blue-800">
            <CardHeader>
              <Activity className="w-10 h-10 text-blue-500 mb-2" />
              <CardTitle className="text-blue-700 dark:text-blue-300">Secondary Prevention</CardTitle>
              <CardDescription>
                Early detection and intervention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Screening and assessment tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Recognizing early warning signs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Timely access to support services</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Brief intervention strategies</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/secondary-care")} className="w-full mt-4" variant="outline">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-purple-200 dark:border-purple-800">
            <CardHeader>
              <Brain className="w-10 h-10 text-purple-500 mb-2" />
              <CardTitle className="text-purple-700 dark:text-purple-300">Tertiary Prevention</CardTitle>
              <CardDescription>
                Managing and recovering from conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Treatment and therapy support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Relapse prevention strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Rehabilitation and recovery programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>Long-term wellness maintenance</span>
                </li>
              </ul>
              <Button onClick={() => navigate("/tertiary-care")} className="w-full mt-4" variant="outline">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Prevention Strategies */}
        <h2 className="text-2xl font-bold mb-6 text-center">Key Prevention Strategies</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-cyan-500 mb-2" />
              <CardTitle>Social Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Strong social connections are protective against mental health challenges
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Building meaningful relationships</li>
                <li>• Engaging with community</li>
                <li>• Seeking and offering support</li>
                <li>• Maintaining family connections</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle>Healthy Lifestyle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Physical health supports mental well-being
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Regular physical exercise</li>
                <li>• Balanced nutrition</li>
                <li>• Adequate sleep hygiene</li>
                <li>• Limiting alcohol and substances</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-pink-500 mb-2" />
              <CardTitle>Stress Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Effective coping skills reduce mental health risks
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mindfulness and meditation</li>
                <li>• Relaxation techniques</li>
                <li>• Time management skills</li>
                <li>• Problem-solving strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-indigo-500 mb-2" />
              <CardTitle>Mental Health Literacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Knowledge empowers prevention and early action
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Understanding mental health</li>
                <li>• Recognizing warning signs</li>
                <li>• Reducing stigma</li>
                <li>• Knowing when to seek help</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Start Your Prevention Journey</CardTitle>
            <CardDescription>
              Use our tools to build resilience and maintain mental wellness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/mood-tracker")} variant="default">
                Track Your Wellness
              </Button>
              <Button onClick={() => navigate("/personality-screening")} variant="secondary">
                Take Screening Assessment
              </Button>
              <Button onClick={() => navigate("/wellness-tools")} variant="outline">
                Explore Prevention Tools
              </Button>
              <Button onClick={() => navigate("/ai-support")} variant="outline">
                Get Personalized Guidance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <PageNavigation />
    </div>
  );
};

export default MentalHealthPrevention;