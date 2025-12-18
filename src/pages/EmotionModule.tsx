import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Heart, Wind, Eye, Activity, ArrowRight, 
  Play, Pause, RotateCcw, Sparkles, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const EmotionModule = () => {
  const [activeMode, setActiveMode] = useState<"breathing" | "naming" | "bodyscan" | null>(null);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [breathingProgress, setBreathingProgress] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingDuration, setBreathingDuration] = useState(60);
  const [remainingTime, setRemainingTime] = useState(60);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  const [bodyScanStep, setBodyScanStep] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const emotions = [
    { name: "Joy", color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
    { name: "Sadness", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
    { name: "Anger", color: "bg-red-500/20 text-red-600 border-red-500/30" },
    { name: "Fear", color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
    { name: "Anxiety", color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
    { name: "Calm", color: "bg-green-500/20 text-green-600 border-green-500/30" },
    { name: "Excitement", color: "bg-pink-500/20 text-pink-600 border-pink-500/30" },
    { name: "Frustration", color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
    { name: "Gratitude", color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
    { name: "Overwhelm", color: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30" }
  ];

  const bodyScanAreas = [
    { area: "Head & Face", instruction: "Notice any tension in your forehead, jaw, or around your eyes. Allow these muscles to soften." },
    { area: "Neck & Shoulders", instruction: "Feel the weight of your shoulders. Let them drop away from your ears. Release any holding." },
    { area: "Chest & Heart", instruction: "Observe your heartbeat. Notice your breath expanding your chest. Let your heart area feel open." },
    { area: "Stomach & Core", instruction: "Soften your belly. Release any gripping. Allow your center to feel supported and relaxed." },
    { area: "Arms & Hands", instruction: "Feel the length of your arms. Notice your palms and fingers. Let them feel heavy and relaxed." },
    { area: "Legs & Feet", instruction: "Ground through your legs. Feel your connection to the earth. Let tension flow downward and out." }
  ];

  useEffect(() => {
    if (isBreathing && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            setIsBreathing(false);
            toast({ title: "Breathing Complete", description: "Great job! Your nervous system thanks you." });
            return breathingDuration;
          }
          return prev - 1;
        });
        
        // Breathing cycle: 4s inhale, 4s hold, 4s exhale, 4s rest = 16s total
        const cyclePosition = (breathingDuration - remainingTime) % 16;
        if (cyclePosition < 4) {
          setBreathingPhase("inhale");
          setBreathingProgress((cyclePosition / 4) * 100);
        } else if (cyclePosition < 8) {
          setBreathingPhase("hold");
          setBreathingProgress(((cyclePosition - 4) / 4) * 100);
        } else if (cyclePosition < 12) {
          setBreathingPhase("exhale");
          setBreathingProgress(((cyclePosition - 8) / 4) * 100);
        } else {
          setBreathingPhase("rest");
          setBreathingProgress(((cyclePosition - 12) / 4) * 100);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isBreathing, remainingTime, breathingDuration]);

  const startBreathing = () => {
    setRemainingTime(breathingDuration);
    setIsBreathing(true);
    setActiveMode("breathing");
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetBreathing = () => {
    stopBreathing();
    setRemainingTime(breathingDuration);
    setBreathingProgress(0);
    setBreathingPhase("inhale");
  };

  const handleEmotionSelect = (emotion: string) => {
    setSelectedEmotion(emotion);
    setActiveMode("naming");
    toast({
      title: "Emotion Acknowledged",
      description: `You're feeling ${emotion}. That's valid.`,
    });
  };

  const nextBodyScanStep = () => {
    if (bodyScanStep < bodyScanAreas.length - 1) {
      setBodyScanStep(prev => prev + 1);
    } else {
      toast({
        title: "Body Scan Complete",
        description: "You've completed a full body awareness scan.",
      });
      setBodyScanStep(0);
      setActiveMode(null);
    }
  };

  const getBreathingScale = () => {
    if (breathingPhase === "inhale") return 1 + (breathingProgress / 100) * 0.3;
    if (breathingPhase === "exhale") return 1.3 - (breathingProgress / 100) * 0.3;
    return breathingPhase === "hold" ? 1.3 : 1;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-pink-500/5 to-background">
      <PageNavigation />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-pink-500/10 text-pink-500 border-pink-500/20">
              <Heart className="w-4 h-4 mr-2" />
              Mind Physics™ Engine
            </Badge>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Emotion Module
            </h1>
            <p className="text-xl text-muted-foreground">
              Emotions = Rhythms • Regulation / "Frequency"
            </p>
          </motion.div>

          {/* Wave Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center h-32">
                  <motion.div
                    animate={{ scale: getBreathingScale() }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 blur-sm"
                  />
                  <motion.div
                    animate={{ scale: getBreathingScale() }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 absolute"
                  />
                </div>
                <p className="text-center text-muted-foreground mt-4">
                  {isBreathing ? (
                    <span className="text-2xl font-bold text-primary capitalize">{breathingPhase}</span>
                  ) : (
                    "Wave stabilizing metaphor"
                  )}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tool Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mb-6"
          >
            {/* Breathing Card */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'breathing' ? 'ring-2 ring-pink-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'breathing' ? null : 'breathing')}
            >
              <CardContent className="p-6 text-center">
                <Wind className="w-10 h-10 text-pink-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Guided Breathing</h3>
                <p className="text-sm text-muted-foreground">30 seconds to 2 minutes</p>
              </CardContent>
            </Card>

            {/* Naming Card */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'naming' ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'naming' ? null : 'naming')}
            >
              <CardContent className="p-6 text-center">
                <Heart className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Emotion Naming</h3>
                <p className="text-sm text-muted-foreground">Identify what you feel</p>
              </CardContent>
            </Card>

            {/* Body Scan Card */}
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'bodyscan' ? 'ring-2 ring-cyan-500' : ''}`}
              onClick={() => { setActiveMode('bodyscan'); setBodyScanStep(0); }}
            >
              <CardContent className="p-6 text-center">
                <Eye className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Body Scan</h3>
                <p className="text-sm text-muted-foreground">Awareness practice</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Breathing Panel */}
          <AnimatePresence>
            {activeMode === 'breathing' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-pink-500/30">
                  <CardHeader>
                    <CardTitle>Box Breathing Exercise</CardTitle>
                    <CardDescription>4-4-4-4 pattern: Inhale, Hold, Exhale, Rest</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration: {breathingDuration}s</label>
                      <Slider
                        value={[breathingDuration]}
                        onValueChange={([v]) => { setBreathingDuration(v); setRemainingTime(v); }}
                        min={30}
                        max={120}
                        step={30}
                        disabled={isBreathing}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>30s</span>
                        <span>60s</span>
                        <span>90s</span>
                        <span>2min</span>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-4xl font-bold mb-2">{remainingTime}s</p>
                      <Progress value={((breathingDuration - remainingTime) / breathingDuration) * 100} className="h-2" />
                    </div>

                    <div className="flex justify-center gap-3">
                      {!isBreathing ? (
                        <Button onClick={startBreathing} className="gap-2">
                          <Play className="w-4 h-4" /> Start
                        </Button>
                      ) : (
                        <Button onClick={stopBreathing} variant="secondary" className="gap-2">
                          <Pause className="w-4 h-4" /> Pause
                        </Button>
                      )}
                      <Button onClick={resetBreathing} variant="outline" className="gap-2">
                        <RotateCcw className="w-4 h-4" /> Reset
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Emotion Naming Panel */}
          <AnimatePresence>
            {activeMode === 'naming' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-purple-500/30">
                  <CardHeader>
                    <CardTitle>Name Your Emotion</CardTitle>
                    <CardDescription>Naming an emotion reduces its intensity by 50%</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {emotions.map((emotion) => (
                        <Badge
                          key={emotion.name}
                          className={`cursor-pointer text-sm py-2 px-4 transition-all hover:scale-105 ${emotion.color} ${selectedEmotion === emotion.name ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => handleEmotionSelect(emotion.name)}
                        >
                          {emotion.name}
                        </Badge>
                      ))}
                    </div>

                    {selectedEmotion && (
                      <div className="space-y-3 p-4 bg-background/50 rounded-lg border">
                        <p className="font-medium">How intense is this {selectedEmotion}?</p>
                        <Slider
                          value={[emotionIntensity]}
                          onValueChange={([v]) => setEmotionIntensity(v)}
                          min={0}
                          max={100}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mild</span>
                          <span>Moderate</span>
                          <span>Intense</span>
                        </div>
                        <p className="text-center text-2xl font-bold">{emotionIntensity}%</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Body Scan Panel */}
          <AnimatePresence>
            {activeMode === 'bodyscan' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-cyan-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Body Scan</CardTitle>
                        <CardDescription>Step {bodyScanStep + 1} of {bodyScanAreas.length}</CardDescription>
                      </div>
                      <Progress value={((bodyScanStep + 1) / bodyScanAreas.length) * 100} className="w-32 h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
                      <h3 className="text-xl font-bold mb-3 text-cyan-500">
                        {bodyScanAreas[bodyScanStep].area}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {bodyScanAreas[bodyScanStep].instruction}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={nextBodyScanStep} className="gap-2">
                        {bodyScanStep < bodyScanAreas.length - 1 ? (
                          <>Continue <ArrowRight className="w-4 h-4" /></>
                        ) : (
                          <>Complete <Check className="w-4 h-4" /></>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Step */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to="/mind-physics/behaviour">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-500 to-green-500 hover:from-pink-600 hover:to-green-600">
                Choose Behaviour
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Continue to the Behaviour Module
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EmotionModule;