import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, Heart, Zap, ArrowRight, Sparkles, 
  Lightbulb, Waves, Target, Activity
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";

const MindPhysics = () => {
  const modules = [
    {
      id: "thought",
      title: "Thought Module",
      subtitle: "Thoughts = Signals",
      description: "Label, reframe, and park your thoughts using CBT-based techniques",
      icon: Lightbulb,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      features: ["Label a thought", "Reframe a thought", "Park a thought (worry container)"],
      link: "/mind-physics/thought"
    },
    {
      id: "emotion",
      title: "Emotion Module",
      subtitle: "Emotions = Rhythms",
      description: "Regulate your emotional frequency through guided breathing and body awareness",
      icon: Heart,
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-500/10",
      textColor: "text-pink-500",
      features: ["Guided breathing (30s-2min)", "Emotion naming", "Body scan"],
      link: "/mind-physics/emotion"
    },
    {
      id: "behaviour",
      title: "Behaviour Module",
      subtitle: "Behaviour = Direction",
      description: "Build momentum through micro-actions and habit formation",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      features: ["2-minute action", "Avoidance breaker", "Habit micro-step"],
      link: "/mind-physics/behaviour"
    }
  ];

  const flowSteps = [
    { label: "Thought Focus", icon: Lightbulb, color: "text-blue-500" },
    { label: "Emotion", icon: Heart, color: "text-pink-500" },
    { label: "Action", icon: Zap, color: "text-green-500" },
    { label: "Outcome", icon: Target, color: "text-amber-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
      <PageNavigation />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Core Feature Flow
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-pink-500 to-green-500 bg-clip-text text-transparent">
              Mind Physics™ Engine
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transform your mental patterns through the science of thought, emotion, and behavior
            </p>
          </motion.div>

          {/* Flow Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-primary/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
                  {flowSteps.map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`p-4 bg-background/80 rounded-full shadow-lg border`}>
                          <step.icon className={`w-8 h-8 ${step.color}`} />
                        </div>
                        <span className="mt-2 font-medium text-sm">{step.label}</span>
                      </div>
                      {index < flowSteps.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-muted-foreground mx-2 hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground mt-6 max-w-2xl mx-auto">
                  The Mind Physics™ Engine guides you through a sequential process: 
                  regulate your thoughts, stabilize your emotions, then choose purposeful action.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modules Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {modules.map((module, index) => (
              <Link to={module.link} key={module.id}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${module.color}`} />
                  <CardHeader>
                    <div className={`p-3 ${module.bgColor} rounded-lg w-fit mb-2`}>
                      <module.icon className={`w-8 h-8 ${module.textColor}`} />
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {module.subtitle}
                    </Badge>
                    <CardDescription className="mt-2">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {module.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className={`w-4 h-4 ${module.textColor}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button variant="ghost" className="w-full gap-2 group-hover:bg-primary/10">
                      Start Module <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </motion.div>

          {/* Law of Attraction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-500/30">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/20 rounded-full">
                    <Target className="w-8 h-8 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle>What People Call "Attraction"</CardTitle>
                    <CardDescription>
                      A science-based reframe of manifestation
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background/50 rounded-lg p-6 border">
                  <p className="text-lg text-center italic text-muted-foreground">
                    "You don't attract outcomes magically.<br />
                    You notice, choose, and act differently."
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <Brain className="w-6 h-6 text-blue-500 mb-2" />
                    <h4 className="font-medium">Calm Mind</h4>
                    <p className="text-sm text-muted-foreground">→ Better decisions</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <Activity className="w-6 h-6 text-green-500 mb-2" />
                    <h4 className="font-medium">Consistent Habits</h4>
                    <p className="text-sm text-muted-foreground">→ Opportunities</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg border">
                    <Target className="w-6 h-6 text-amber-500 mb-2" />
                    <h4 className="font-medium">Clear Goals</h4>
                    <p className="text-sm text-muted-foreground">→ Focused attention</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link to="/mind-physics/attraction">
                    <Button size="lg" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Sparkles className="w-4 h-4" />
                      Apply to My Life
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MindPhysics;