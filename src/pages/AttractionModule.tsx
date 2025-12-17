import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Target, Brain, Activity, Sparkles, ArrowRight, 
  ArrowDown, CheckCircle, Lightbulb, Heart, Zap,
  Eye, Star, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AttractionModule = () => {
  const [focusArea, setFocusArea] = useState("");
  const [thoughtFocus, setThoughtFocus] = useState("");
  const [emotionalState, setEmotionalState] = useState("");
  const [plannedActions, setPlannedActions] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const focusAreas = [
    { name: "Career Growth", icon: TrendingUp, color: "text-blue-500" },
    { name: "Relationships", icon: Heart, color: "text-pink-500" },
    { name: "Health & Fitness", icon: Activity, color: "text-green-500" },
    { name: "Financial Goals", icon: Star, color: "text-amber-500" },
    { name: "Personal Development", icon: Brain, color: "text-purple-500" },
    { name: "Creative Projects", icon: Sparkles, color: "text-cyan-500" }
  ];

  const scienceExplanations = [
    {
      myth: "You attract what you think about",
      reality: "You notice more of what you focus on (Reticular Activating System)",
      icon: Eye
    },
    {
      myth: "Positive thinking creates positive outcomes",
      reality: "Positive thinking + action creates better decision-making",
      icon: Brain
    },
    {
      myth: "The universe delivers what you desire",
      reality: "Clarity of goals increases focused action and opportunity recognition",
      icon: Target
    }
  ];

  const handleApply = () => {
    if (!focusArea || !thoughtFocus || !plannedActions) {
      toast({
        title: "Complete all fields",
        description: "Fill in your focus area, thoughts, and planned actions",
        variant: "destructive"
      });
      return;
    }

    setShowResults(true);
    toast({
      title: "Application Created!",
      description: "Your science-based manifestation plan is ready.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-amber-500/5 to-background">
      <PageNavigation currentPage="Law of Attraction" />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-amber-500/10 text-amber-500 border-amber-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Reframed Safely
            </Badge>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
              What People Call "Attraction"
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A science-based approach to manifestation
            </p>
          </motion.div>

          {/* Core Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
              <CardContent className="p-8 text-center">
                <p className="text-2xl font-medium italic text-foreground/90 mb-4">
                  "You don't attract outcomes magically.<br />
                  <span className="text-amber-500">You notice, choose, and act differently.</span>"
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Funnel Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-center">The Real Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-2">
                  {[
                    { label: "Thought Focus", icon: Lightbulb, color: "bg-blue-500", width: "w-64" },
                    { label: "Emotion", icon: Heart, color: "bg-pink-500", width: "w-52" },
                    { label: "Action", icon: Zap, color: "bg-green-500", width: "w-40" },
                    { label: "Outcome", icon: Target, color: "bg-amber-500", width: "w-28" }
                  ].map((step, index) => (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className={`${step.width} ${step.color} text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2`}>
                        <step.icon className="w-5 h-5" />
                        <span className="font-medium">{step.label}</span>
                      </div>
                      {index < 3 && (
                        <ArrowDown className="w-6 h-6 text-muted-foreground my-1" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Science Explanations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">The Science Behind It</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {scienceExplanations.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <item.icon className="w-8 h-8 text-amber-500 mb-2" />
                    <CardTitle className="text-sm text-muted-foreground line-through">
                      {item.myth}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-green-600">{item.reality}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>How It Actually Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Brain className="w-8 h-8 text-blue-500 mb-2" />
                    <h4 className="font-bold mb-1">Calm Mind</h4>
                    <p className="text-sm text-muted-foreground">→ Better decisions</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Reduced stress hormones improve prefrontal cortex function
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <Activity className="w-8 h-8 text-green-500 mb-2" />
                    <h4 className="font-bold mb-1">Consistent Habits</h4>
                    <p className="text-sm text-muted-foreground">→ Opportunities</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      Regular action increases surface area for luck
                    </p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <Target className="w-8 h-8 text-amber-500 mb-2" />
                    <h4 className="font-bold mb-1">Clear Goals</h4>
                    <p className="text-sm text-muted-foreground">→ Focused attention</p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      RAS filters information aligned with your intentions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Apply to My Life */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Apply to My Life
                </CardTitle>
                <CardDescription>
                  Create your science-based manifestation plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Focus Area Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">What area do you want to focus on?</label>
                  <div className="flex flex-wrap gap-2">
                    {focusAreas.map((area) => (
                      <Badge
                        key={area.name}
                        variant={focusArea === area.name ? "default" : "outline"}
                        className={`cursor-pointer py-2 px-4 transition-all ${focusArea === area.name ? 'bg-primary' : 'hover:bg-primary/10'}`}
                        onClick={() => setFocusArea(area.name)}
                      >
                        <area.icon className={`w-4 h-4 mr-2 ${area.color}`} />
                        {area.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Thought Focus */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Lightbulb className="w-4 h-4 inline mr-2 text-blue-500" />
                    What will you focus your thoughts on?
                  </label>
                  <Textarea
                    placeholder="e.g., I will focus on seeing opportunities for growth in every challenge..."
                    value={thoughtFocus}
                    onChange={(e) => setThoughtFocus(e.target.value)}
                  />
                </div>

                {/* Emotional State */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Heart className="w-4 h-4 inline mr-2 text-pink-500" />
                    What emotional state will you cultivate?
                  </label>
                  <Input
                    placeholder="e.g., Calm confidence, grateful optimism..."
                    value={emotionalState}
                    onChange={(e) => setEmotionalState(e.target.value)}
                  />
                </div>

                {/* Planned Actions */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Zap className="w-4 h-4 inline mr-2 text-green-500" />
                    What specific actions will you take?
                  </label>
                  <Textarea
                    placeholder="e.g., Apply to 3 jobs daily, network with 2 people weekly..."
                    value={plannedActions}
                    onChange={(e) => setPlannedActions(e.target.value)}
                  />
                </div>

                {/* Expected Outcome */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    <Target className="w-4 h-4 inline mr-2 text-amber-500" />
                    What outcome are you working toward?
                  </label>
                  <Input
                    placeholder="e.g., A fulfilling career that utilizes my strengths..."
                    value={expectedOutcome}
                    onChange={(e) => setExpectedOutcome(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={handleApply} 
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4" /> Apply to My Life
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Your Science-Based Manifestation Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg border">
                      <h4 className="font-bold text-blue-500 mb-2">Focus Area</h4>
                      <p>{focusArea}</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg border">
                      <h4 className="font-bold text-pink-500 mb-2">Emotional State</h4>
                      <p>{emotionalState || "Calm and focused"}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <h4 className="font-bold text-green-500 mb-2">Daily Actions</h4>
                    <p>{plannedActions}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg border border-amber-500/30">
                    <h4 className="font-bold text-amber-500 mb-2">Target Outcome</h4>
                    <p className="text-lg">{expectedOutcome}</p>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Remember: This isn't magic. It's focused attention + emotional regulation + consistent action = results.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <Link to="/mind-physics">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" /> Back to Mind Physics
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AttractionModule;