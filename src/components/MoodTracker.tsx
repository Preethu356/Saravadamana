import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Angry, Heart } from "lucide-react";
import { useState } from "react";

const moods = [
  { icon: Heart, label: "Great", color: "text-secondary hover:bg-secondary/20" },
  { icon: Smile, label: "Good", color: "text-primary hover:bg-primary/20" },
  { icon: Meh, label: "Okay", color: "text-accent hover:bg-accent/20" },
  { icon: Frown, label: "Down", color: "text-muted-foreground hover:bg-muted" },
  { icon: Angry, label: "Struggling", color: "text-destructive hover:bg-destructive/20" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            How Are You <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Feeling Today?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your emotional wellness journey. Your feelings are valid, and we're here to support you.
          </p>
        </div>

        <Card className="p-8 shadow-card border-2 bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moods.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => setSelectedMood(label)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  selectedMood === label
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50"
                } ${color}`}
              >
                <Icon className="w-12 h-12" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border animate-in fade-in slide-in-from-top-2">
              <p className="text-center text-muted-foreground mb-4">
                Thank you for sharing. Would you like to:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="default">Journal Your Thoughts</Button>
                <Button variant="secondary">Talk to AI Support</Button>
                <Button variant="outline">View Resources</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default MoodTracker;
