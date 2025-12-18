import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, Timer, Shield, Footprints, ArrowRight, 
  CheckCircle, Play, RotateCcw, Sparkles, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const BehaviourModule = () => {
  const [activeMode, setActiveMode] = useState<"action" | "avoidance" | "habit" | null>(null);
  const [actionTimer, setActionTimer] = useState(120);
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120);
  const [customAction, setCustomAction] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [avoidanceItem, setAvoidanceItem] = useState("");
  const [microStep, setMicroStep] = useState("");
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const { toast } = useToast();

  const quickActions = [
    { label: "Send one text message", duration: 30 },
    { label: "Do 5 jumping jacks", duration: 30 },
    { label: "Drink a glass of water", duration: 60 },
    { label: "Write 3 gratitude items", duration: 60 },
    { label: "Stretch for 2 minutes", duration: 120 },
    { label: "Tidy one surface", duration: 120 },
    { label: "Take a short walk", duration: 120 },
    { label: "Practice deep breaths", duration: 60 }
  ];

  const avoidanceExamples = [
    "Checking email",
    "Making a phone call",
    "Starting a project",
    "Having a conversation",
    "Going outside",
    "Exercise",
    "Cleaning",
    "Studying"
  ];

  const habitCategories = [
    { name: "Health", examples: ["Take vitamins", "Drink water", "Stretch"] },
    { name: "Productivity", examples: ["Check calendar", "Write one task", "Clear inbox"] },
    { name: "Connection", examples: ["Text a friend", "Call family", "Share appreciation"] },
    { name: "Self-care", examples: ["5 min meditation", "Journal one line", "Skincare routine"] }
  ];

  const startTimer = (action: string, duration: number) => {
    setSelectedAction(action);
    setRemainingTime(duration);
    setTimerRunning(true);
    
    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          completeAction(action);
          return duration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const completeAction = (action: string) => {
    setCompletedActions(prev => [...prev, action]);
    toast({
      title: "Action Complete! 🎉",
      description: `You did it! "${action}" is done.`,
    });
    setTimerRunning(false);
    setSelectedAction("");
  };

  const handleAvoidanceBreak = () => {
    if (!avoidanceItem.trim()) {
      toast({ title: "Enter what you're avoiding", variant: "destructive" });
      return;
    }
    
    toast({
      title: "Avoidance Acknowledged",
      description: `Starting with just 2 minutes of "${avoidanceItem}"`,
    });
    startTimer(`Break avoidance: ${avoidanceItem}`, 120);
    setAvoidanceItem("");
  };

  const handleMicroStepCommit = () => {
    if (!microStep.trim()) {
      toast({ title: "Enter your micro-step", variant: "destructive" });
      return;
    }

    toast({
      title: "Micro-step Committed!",
      description: `Your habit micro-step: "${microStep}"`,
    });
    setCompletedActions(prev => [...prev, `Micro-step: ${microStep}`]);
    setMicroStep("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-green-500/5 to-background">
      <PageNavigation />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
              <Zap className="w-4 h-4 mr-2" />
              Mind Physics™ Engine
            </Badge>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Behaviour Module
            </h1>
            <p className="text-xl text-muted-foreground">
              Behaviour = Direction • Momentum
            </p>
          </motion.div>

          {/* Active Timer Display */}
          <AnimatePresence>
            {timerRunning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="mb-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                  <CardContent className="p-8 text-center">
                    <p className="text-lg mb-2 text-muted-foreground">{selectedAction}</p>
                    <p className="text-6xl font-bold text-green-500 mb-4">{formatTime(remainingTime)}</p>
                    <Progress value={((actionTimer - remainingTime) / actionTimer) * 100} className="h-3 mb-4" />
                    <div className="flex justify-center gap-3">
                      <Button 
                        onClick={() => completeAction(selectedAction)} 
                        className="gap-2 bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4" /> Done Early
                      </Button>
                      <Button 
                        onClick={() => { setTimerRunning(false); setSelectedAction(""); }} 
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tool Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mb-6"
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'action' ? 'ring-2 ring-green-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'action' ? null : 'action')}
            >
              <CardContent className="p-6 text-center">
                <Timer className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">2-Minute Action</h3>
                <p className="text-sm text-muted-foreground">Quick momentum builder</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'avoidance' ? 'ring-2 ring-orange-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'avoidance' ? null : 'avoidance')}
            >
              <CardContent className="p-6 text-center">
                <Shield className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Avoidance Breaker</h3>
                <p className="text-sm text-muted-foreground">Face what you're avoiding</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'habit' ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'habit' ? null : 'habit')}
            >
              <CardContent className="p-6 text-center">
                <Footprints className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Habit Micro-Step</h3>
                <p className="text-sm text-muted-foreground">Tiny consistent action</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2-Minute Action Panel */}
          <AnimatePresence>
            {activeMode === 'action' && !timerRunning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-green-500/30">
                  <CardHeader>
                    <CardTitle>Choose Your 2-Minute Action</CardTitle>
                    <CardDescription>One tap to start momentum</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {quickActions.map((action) => (
                        <Button
                          key={action.label}
                          variant="outline"
                          className="h-auto py-3 px-4 text-left flex flex-col items-start hover:bg-green-500/10 hover:border-green-500"
                          onClick={() => startTimer(action.label, action.duration)}
                        >
                          <span className="text-sm font-medium">{action.label}</span>
                          <span className="text-xs text-muted-foreground">{action.duration}s</span>
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or type your own action..."
                        value={customAction}
                        onChange={(e) => setCustomAction(e.target.value)}
                      />
                      <Button 
                        onClick={() => {
                          if (customAction.trim()) {
                            startTimer(customAction, 120);
                            setCustomAction("");
                          }
                        }}
                        className="gap-2"
                      >
                        <Play className="w-4 h-4" /> Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Avoidance Breaker Panel */}
          <AnimatePresence>
            {activeMode === 'avoidance' && !timerRunning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-orange-500/30">
                  <CardHeader>
                    <CardTitle>What Are You Avoiding?</CardTitle>
                    <CardDescription>Start with just 2 minutes to break the pattern</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {avoidanceExamples.map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="cursor-pointer hover:bg-orange-500/10 hover:border-orange-500"
                          onClick={() => setAvoidanceItem(example)}
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="What have you been putting off?"
                        value={avoidanceItem}
                        onChange={(e) => setAvoidanceItem(e.target.value)}
                      />
                      <Button 
                        onClick={handleAvoidanceBreak}
                        className="gap-2 bg-orange-500 hover:bg-orange-600"
                      >
                        <Shield className="w-4 h-4" /> Break It
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      "The hardest part is starting. Just 2 minutes changes everything."
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Habit Micro-Step Panel */}
          <AnimatePresence>
            {activeMode === 'habit' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Define Your Micro-Step</CardTitle>
                    <CardDescription>Make it so small you can't say no</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {habitCategories.map((category) => (
                        <div key={category.name} className="p-4 bg-background/50 rounded-lg border">
                          <h4 className="font-medium mb-2">{category.name}</h4>
                          <div className="flex flex-wrap gap-1">
                            {category.examples.map((example) => (
                              <Badge
                                key={example}
                                variant="secondary"
                                className="cursor-pointer text-xs"
                                onClick={() => setMicroStep(example)}
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="My micro-step is..."
                        value={microStep}
                        onChange={(e) => setMicroStep(e.target.value)}
                      />
                      <Button 
                        onClick={handleMicroStepCommit}
                        className="gap-2 bg-purple-500 hover:bg-purple-600"
                      >
                        <Footprints className="w-4 h-4" /> Commit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completed Actions */}
          {completedActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-6 bg-green-500/5 border-green-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-green-500" />
                    Today's Wins ({completedActions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {completedActions.map((action, index) => (
                      <Badge key={index} className="bg-green-500/20 text-green-600 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {action}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Done / Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Done!</h3>
              <p className="text-muted-foreground mb-4">
                You've completed the Mind Physics™ flow: Thought → Emotion → Behaviour
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/mind-physics">
                  <Button variant="outline" className="gap-2">
                    <RotateCcw className="w-4 h-4" /> Start Over
                  </Button>
                </Link>
                <Link to="/attraction-module">
                  <Button className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Sparkles className="w-4 h-4" /> Apply to My Life
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BehaviourModule;