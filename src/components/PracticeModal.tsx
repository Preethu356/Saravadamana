import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, CheckCircle2, Volume2, VolumeX } from "lucide-react";

interface PracticeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  practice: {
    title: string;
    icon: string;
    type: "breathing" | "meditation" | "muscle-relaxation" | "grounding";
  };
}

const PracticeModal = ({ open, onOpenChange, practice }: PracticeModalProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !completed) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, completed]);

  const resetPractice = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimer(0);
    setCompleted(false);
  };

  const renderBreathingExercise = () => {
    const phases = [
      { name: "Inhale", duration: 4, instruction: "Breathe in slowly through your nose" },
      { name: "Hold", duration: 7, instruction: "Hold your breath gently" },
      { name: "Exhale", duration: 8, instruction: "Breathe out slowly through your mouth" },
      { name: "Rest", duration: 2, instruction: "Rest and prepare for the next cycle" },
    ];

    const totalCycles = 4;
    const phaseDuration = phases.reduce((acc, p) => acc + p.duration, 0);
    const totalDuration = phaseDuration * totalCycles;
    const currentCycle = Math.floor(timer / phaseDuration) + 1;
    const timeInCycle = timer % phaseDuration;
    
    let elapsed = 0;
    let currentPhaseIndex = 0;
    for (let i = 0; i < phases.length; i++) {
      if (timeInCycle < elapsed + phases[i].duration) {
        currentPhaseIndex = i;
        break;
      }
      elapsed += phases[i].duration;
    }
    
    const currentPhase = phases[currentPhaseIndex];
    const phaseProgress = ((timeInCycle - elapsed) / currentPhase.duration) * 100;
    const overallProgress = (timer / totalDuration) * 100;

    if (timer >= totalDuration && !completed) {
      setCompleted(true);
      setIsActive(false);
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4 animate-pulse">{practice.icon}</div>
          <h3 className="text-2xl font-bold">4-7-8 Breathing</h3>
          <p className="text-muted-foreground">Cycle {currentCycle} of {totalCycles}</p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
          <div className="text-4xl font-bold text-primary">{currentPhase.name}</div>
          <p className="text-lg">{currentPhase.instruction}</p>
          <Progress value={phaseProgress} className="h-3" />
          <div className="text-sm text-muted-foreground">
            {Math.ceil(currentPhase.duration - (timeInCycle - elapsed))}s remaining
          </div>
        </div>

        <Progress value={overallProgress} className="h-2" />
        <p className="text-center text-sm text-muted-foreground">
          Overall Progress: {Math.round(overallProgress)}%
        </p>
      </div>
    );
  };

  const renderMeditation = () => {
    const duration = 300; // 5 minutes
    const progress = (timer / duration) * 100;
    const remaining = Math.max(0, duration - timer);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    if (timer >= duration && !completed) {
      setCompleted(true);
      setIsActive(false);
    }

    const tips = [
      "Focus on your breath flowing in and out",
      "Notice any thoughts without judgment",
      "Gently return your attention to breathing",
      "Feel the present moment with kindness",
      "Let go of tension with each exhale"
    ];

    const currentTip = tips[Math.floor(timer / 60) % tips.length];

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">{practice.icon}</div>
          <h3 className="text-2xl font-bold">5-Minute Meditation</h3>
        </div>

        <div className="bg-muted/50 rounded-lg p-8 text-center space-y-4">
          <div className="text-6xl font-bold text-primary">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-lg italic">{currentTip}</p>
        </div>

        <Progress value={progress} className="h-3" />
        <p className="text-center text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </p>
      </div>
    );
  };

  const renderMuscleRelaxation = () => {
    const muscleGroups = [
      { name: "Feet & Toes", instruction: "Curl your toes tightly, hold for 5 seconds, then release" },
      { name: "Calves", instruction: "Point your toes upward, tense your calves, hold, then relax" },
      { name: "Thighs", instruction: "Squeeze your thighs together, hold the tension, then release" },
      { name: "Abdomen", instruction: "Pull your belly button toward your spine, hold, then relax" },
      { name: "Hands", instruction: "Make tight fists, hold for 5 seconds, then open and relax" },
      { name: "Arms", instruction: "Tense your entire arms, hold, then let them go limp" },
      { name: "Shoulders", instruction: "Raise shoulders to ears, hold the tension, then drop them" },
      { name: "Neck", instruction: "Gently tilt your head back, hold, then return to center" },
      { name: "Face", instruction: "Scrunch your face tight, hold, then relax all facial muscles" },
    ];

    const stepDuration = 15; // seconds per muscle group
    const stepIndex = Math.floor(timer / stepDuration);
    const timeInStep = timer % stepDuration;
    const totalDuration = muscleGroups.length * stepDuration;
    const progress = (timer / totalDuration) * 100;

    if (stepIndex >= muscleGroups.length && !completed) {
      setCompleted(true);
      setIsActive(false);
    }

    const currentGroup = muscleGroups[Math.min(stepIndex, muscleGroups.length - 1)];
    const phase = timeInStep < 5 ? "Tense" : timeInStep < 10 ? "Hold" : "Release";

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">{practice.icon}</div>
          <h3 className="text-2xl font-bold">Progressive Muscle Relaxation</h3>
          <p className="text-muted-foreground">
            Group {Math.min(stepIndex + 1, muscleGroups.length)} of {muscleGroups.length}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
          <div className="text-3xl font-bold text-primary">{currentGroup.name}</div>
          <div className="text-xl font-semibold">{phase}</div>
          <p className="text-lg">{currentGroup.instruction}</p>
          <div className="text-4xl font-bold text-primary">
            {stepDuration - timeInStep}s
          </div>
        </div>

        <Progress value={progress} className="h-3" />
        <p className="text-center text-sm text-muted-foreground">
          Overall Progress: {Math.round(progress)}%
        </p>
      </div>
    );
  };

  const renderGrounding = () => {
    const steps = [
      { count: 5, sense: "See", instruction: "Name 5 things you can see around you", items: [] as string[] },
      { count: 4, sense: "Touch", instruction: "Name 4 things you can touch", items: [] as string[] },
      { count: 3, sense: "Hear", instruction: "Name 3 things you can hear", items: [] as string[] },
      { count: 2, sense: "Smell", instruction: "Name 2 things you can smell", items: [] as string[] },
      { count: 1, sense: "Taste", instruction: "Name 1 thing you can taste", items: [] as string[] },
    ];

    const [userInputs, setUserInputs] = useState<string[][]>(steps.map(() => []));

    const totalSteps = steps.length;
    const progress = (currentStep / totalSteps) * 100;

    const handleNext = () => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCompleted(true);
      }
    };

    const handlePrevious = () => {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    };

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-6xl mb-4">{practice.icon}</div>
          <h3 className="text-2xl font-bold">5-4-3-2-1 Grounding</h3>
          <p className="text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <div className="text-center space-y-3">
            <div className="text-4xl font-bold text-primary">
              {steps[currentStep].count} Things You Can {steps[currentStep].sense}
            </div>
            <p className="text-lg">{steps[currentStep].instruction}</p>
          </div>

          <div className="space-y-2">
            {Array.from({ length: steps[currentStep].count }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Item {i + 1} (take your time to notice)
                </span>
              </div>
            ))}
          </div>
        </div>

        <Progress value={progress} className="h-3" />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {currentStep === totalSteps - 1 ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (completed) {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold">Practice Complete!</h3>
          <p className="text-lg text-muted-foreground">
            Great job! You've completed the {practice.title.toLowerCase()}.
          </p>
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm">
              Time spent: {Math.floor(timer / 60)}m {timer % 60}s
            </p>
          </div>
          <Button onClick={resetPractice} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
        </div>
      );
    }

    switch (practice.type) {
      case "breathing":
        return renderBreathingExercise();
      case "meditation":
        return renderMeditation();
      case "muscle-relaxation":
        return renderMuscleRelaxation();
      case "grounding":
        return renderGrounding();
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{practice.title}</DialogTitle>
        </DialogHeader>

        {renderContent()}

        {!completed && practice.type !== "grounding" && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              onClick={resetPractice}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restart
            </Button>
            <Button
              onClick={() => setIsActive(!isActive)}
              className="flex-1 gap-2"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {timer > 0 ? "Resume" : "Start"}
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PracticeModal;
