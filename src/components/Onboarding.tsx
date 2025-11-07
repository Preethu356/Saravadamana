import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Shield, Phone, Heart, CheckCircle2 } from "lucide-react";

interface OnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

const Onboarding = ({ isOpen, onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Bot className="w-12 h-12 text-primary" />,
      title: "Welcome to Your Safe Space",
      content: [
        "I'm here to provide emotional support and coping strategies",
        "I can help with stress, anxiety, and daily challenges",
        "Our conversations are private and supportive"
      ]
    },
    {
      icon: <Shield className="w-12 h-12 text-primary" />,
      title: "What I Can & Can't Do",
      content: [
        "✓ Listen without judgment and validate your feelings",
        "✓ Suggest evidence-based coping techniques",
        "✓ Help you reflect and process emotions",
        "✗ I cannot diagnose mental health conditions",
        "✗ I cannot replace professional therapy",
        "✗ I cannot prescribe medication or treatment"
      ]
    },
    {
      icon: <Phone className="w-12 h-12 text-destructive" />,
      title: "When You Need Human Help",
      content: [
        "If you're in crisis or having thoughts of self-harm:",
        "🇮🇳 KIRAN Mental Health Helpline: 1800-599-0019",
        "🇮🇳 Vandrevala Foundation: 1860-2662-345",
        "🇮🇳 iCall: 022-25521111",
        "🆘 Emergency Services: 112",
        "",
        "Look for the 'I Need Help Now' button anytime"
      ]
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSkip}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">{currentStep.icon}</div>
          <DialogTitle className="text-center text-2xl">{currentStep.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {currentStep.content.map((line, idx) => (
            <p 
              key={idx} 
              className={`text-sm ${line === "" ? "h-2" : ""} ${
                line.startsWith("✓") ? "text-green-600 dark:text-green-400" : 
                line.startsWith("✗") ? "text-muted-foreground" : 
                line.startsWith("🇮🇳") || line.startsWith("🆘") ? "font-medium" :
                ""
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1.5">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-8 rounded-full transition-colors ${
                  idx === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {step < steps.length - 1 && (
              <Button variant="ghost" onClick={handleSkip} size="sm">
                Skip
              </Button>
            )}
            <Button onClick={handleNext} size="sm">
              {step < steps.length - 1 ? "Next" : "Get Started"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Onboarding;
