import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Brain, Heart, Activity, Home, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OldAgeMentalHealth = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <Users className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Senior Mental Health & Well-being
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Promoting mental wellness, dignity, and quality of life in later years
          </p>
        </div>

        {/* Key Areas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="w-8 h-8 text-blue-500 mb-2" />
              <CardTitle>Cognitive Health</CardTitle>
              <CardDescription>
                Maintaining mental sharpness and addressing cognitive changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Memory support strategies</li>
                <li>• Cognitive stimulation activities</li>
                <li>• Dementia awareness and support</li>
                <li>• Mental fitness exercises</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-red-500 mb-2" />
              <CardTitle>Emotional Well-being</CardTitle>
              <CardDescription>
                Managing emotions and preventing depression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Depression screening and support</li>
                <li>• Loneliness prevention strategies</li>
                <li>• Grief and loss processing</li>
                <li>• Purpose and meaning cultivation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-green-500 mb-2" />
              <CardTitle>Social Connection</CardTitle>
              <CardDescription>
                Building and maintaining meaningful relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Community engagement programs</li>
                <li>• Intergenerational activities</li>
                <li>• Social skills maintenance</li>
                <li>• Support group participation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="w-8 h-8 text-orange-500 mb-2" />
              <CardTitle>Active Aging</CardTitle>
              <CardDescription>
                Staying physically and mentally active
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gentle exercise programs</li>
                <li>• Hobby and leisure activities</li>
                <li>• Learning new skills</li>
                <li>• Volunteer opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Home className="w-8 h-8 text-purple-500 mb-2" />
              <CardTitle>Life Transitions</CardTitle>
              <CardDescription>
                Adapting to retirement and lifestyle changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Retirement adjustment support</li>
                <li>• Role identity transitions</li>
                <li>• Living arrangement changes</li>
                <li>• Independence maintenance</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-cyan-500 mb-2" />
              <CardTitle>Health Management</CardTitle>
              <CardDescription>
                Coping with chronic conditions and health changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Chronic illness adjustment</li>
                <li>• Medication management support</li>
                <li>• Pain and discomfort coping</li>
                <li>• Healthcare navigation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Resources & Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle>Senior Wellness Resources</CardTitle>
            <CardDescription>
              Tools and support for mental well-being in later life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/mood-tracker")} variant="default">
                Daily Mood Check
              </Button>
              <Button onClick={() => navigate("/ai-support")} variant="secondary">
                Talk to Mini Menti
              </Button>
              <Button onClick={() => navigate("/journal")} variant="outline">
                Memory Journal
              </Button>
              <Button onClick={() => navigate("/wellness-tools")} variant="outline">
                Wellness Activities
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Age with dignity:</strong> Mental health is important at every stage of life. 
            Depression, anxiety, and cognitive changes are not a normal part of aging and should be addressed. 
            If you or a loved one is experiencing concerning symptoms, please consult with a healthcare provider 
            or mental health professional specializing in geriatric care.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OldAgeMentalHealth;