import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Heart, 
  Sun, 
  Music, 
  Smile, 
  Sparkles,
  TreePine,
  Waves,
  Coffee,
  Moon,
  X,
  Play,
  Pause,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MicroIntervention {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  steps?: string[];
}

const microInterventions: MicroIntervention[] = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "Calm your nervous system in 60 seconds",
    duration: "1 min",
    icon: Wind,
    color: "text-primary",
    bgColor: "bg-primary/10",
    steps: ["Breathe in for 4 seconds", "Hold for 4 seconds", "Breathe out for 4 seconds", "Hold for 4 seconds"]
  },
  {
    id: "gratitude-moment",
    title: "Gratitude Moment",
    description: "Shift your perspective with gratitude",
    duration: "2 min",
    icon: Heart,
    color: "text-warm",
    bgColor: "bg-warm/10",
    steps: ["Think of one thing you're grateful for", "Feel the warmth of appreciation", "Notice how your body feels", "Carry this feeling forward"]
  },
  {
    id: "sunshine-break",
    title: "Sunshine Break",
    description: "Energize with a quick stretch",
    duration: "3 min",
    icon: Sun,
    color: "text-comfort",
    bgColor: "bg-comfort/10",
    steps: ["Stand up and stretch arms overhead", "Roll your shoulders back", "Take 3 deep breaths", "Smile and continue your day"]
  },
  {
    id: "calming-sounds",
    title: "Calming Sounds",
    description: "Immerse in peaceful audio",
    duration: "5 min",
    icon: Music,
    color: "text-accent",
    bgColor: "bg-accent/10",
    steps: ["Close your eyes", "Listen to nature sounds", "Let thoughts pass like clouds", "Return feeling refreshed"]
  },
  {
    id: "positive-affirmation",
    title: "Positive Affirmation",
    description: "Strengthen your inner voice",
    duration: "1 min",
    icon: Smile,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    steps: ["I am capable and strong", "I choose peace over worry", "I am worthy of happiness", "I embrace this moment"]
  },
  {
    id: "grounding-exercise",
    title: "5-4-3-2-1 Grounding",
    description: "Anchor yourself to the present",
    duration: "3 min",
    icon: TreePine,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    steps: ["Name 5 things you can see", "Name 4 things you can touch", "Name 3 things you can hear", "Name 2 things you can smell", "Name 1 thing you can taste"]
  }
];

interface MicroInterventionsProps {
  compact?: boolean;
  showAll?: boolean;
}

const MicroInterventions = ({ compact = false, showAll = false }: MicroInterventionsProps) => {
  const [activeIntervention, setActiveIntervention] = useState<MicroIntervention | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  const displayedInterventions = showAll ? microInterventions : microInterventions.slice(0, 4);

  const startIntervention = (intervention: MicroIntervention) => {
    setActiveIntervention(intervention);
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const nextStep = () => {
    if (activeIntervention && currentStep < (activeIntervention.steps?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeIntervention();
    }
  };

  const completeIntervention = () => {
    if (activeIntervention) {
      setCompleted(prev => [...prev, activeIntervention.id]);
    }
    setActiveIntervention(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const progress = activeIntervention?.steps 
    ? ((currentStep + 1) / activeIntervention.steps.length) * 100 
    : 0;

  return (
    <div className="space-y-4">
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Quick Calm</h3>
            <p className="text-sm text-muted-foreground">Micro-interventions for instant relief</p>
          </div>
          <Sparkles className="w-5 h-5 text-comfort animate-pulse-soft" />
        </div>
      )}

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        {displayedInterventions.map((intervention, index) => (
          <motion.div
            key={intervention.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 hover:shadow-soft hover:scale-[1.02] border-border/50 ${
                completed.includes(intervention.id) ? 'ring-2 ring-secondary/50' : ''
              }`}
              onClick={() => startIntervention(intervention)}
            >
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl ${intervention.bgColor} flex items-center justify-center mb-3`}>
                  <intervention.icon className={`w-5 h-5 ${intervention.color}`} />
                </div>
                <h4 className="font-medium text-sm text-foreground mb-1">{intervention.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{intervention.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{intervention.duration}</span>
                  {completed.includes(intervention.id) && (
                    <CheckCircle2 className="w-4 h-4 text-secondary" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Intervention Modal */}
      <AnimatePresence>
        {activeIntervention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setActiveIntervention(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl ${activeIntervention.bgColor} flex items-center justify-center`}>
                      <activeIntervention.icon className={`w-6 h-6 ${activeIntervention.color}`} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setActiveIntervention(null)}
                      className="rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {activeIntervention.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{activeIntervention.description}</p>

                  <Progress value={progress} className="h-2 mb-6" />

                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-muted rounded-xl p-6 mb-6 text-center"
                  >
                    <motion.p 
                      className="text-lg font-medium text-foreground"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {activeIntervention.steps?.[currentStep]}
                    </motion.p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Step {currentStep + 1} of {activeIntervention.steps?.length}
                    </p>
                  </motion.div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isPlaying ? "Pause" : "Resume"}
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-to-r from-primary to-accent"
                      onClick={nextStep}
                    >
                      {currentStep < (activeIntervention.steps?.length || 0) - 1 ? "Next" : "Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MicroInterventions;
