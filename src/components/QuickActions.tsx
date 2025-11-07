import { Button } from "@/components/ui/button";
import { Heart, Wind, BookOpen, Sparkles } from "lucide-react";

interface QuickActionsProps {
  onAction: (prompt: string) => void;
  disabled?: boolean;
}

const QuickActions = ({ onAction, disabled }: QuickActionsProps) => {
  const actions = [
    {
      icon: <Heart className="w-4 h-4" />,
      label: "Mood Check-in",
      prompt: "I'd like to check in on how I'm feeling today. Can you help me explore my current mood?"
    },
    {
      icon: <Wind className="w-4 h-4" />,
      label: "Breathing Exercise",
      prompt: "I'm feeling stressed. Can you guide me through a calming breathing exercise?"
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      label: "Journal Prompt",
      prompt: "Can you give me a thoughtful journaling prompt to help me reflect on my feelings?"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      label: "Positive Affirmation",
      prompt: "I could use some encouragement. Can you share a positive affirmation with me?"
    }
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground text-center mb-3">
        Quick actions to get started:
      </p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onAction(action.prompt)}
            disabled={disabled}
            className="justify-start gap-2 h-auto py-3 px-4 text-left"
          >
            <div className="text-primary">{action.icon}</div>
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
