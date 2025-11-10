import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import moodGreat from "@/assets/mood-great.png";
import moodGood from "@/assets/mood-good.png";
import moodOkay from "@/assets/mood-okay.png";
import moodDown from "@/assets/mood-down.png";
import moodStruggling from "@/assets/mood-struggling.png";

const moods = [
  { image: moodGreat, label: "Great", color: "hover:bg-secondary/20" },
  { image: moodGood, label: "Good", color: "hover:bg-primary/20" },
  { image: moodOkay, label: "Okay", color: "hover:bg-accent/20" },
  { image: moodDown, label: "Down", color: "hover:bg-muted" },
  { image: moodStruggling, label: "Struggling", color: "hover:bg-destructive/20" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    
    // Update wellness stats if user is logged in
    if (userId) {
      const { data: stats, error: fetchError } = await supabase
        .from('user_wellness_stats')
        .select('mood_entries, total_sessions')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching stats:', fetchError);
        return;
      }

      if (stats) {
        const { error: updateError } = await supabase
          .from('user_wellness_stats')
          .update({ 
            mood_entries: (stats.mood_entries || 0) + 1,
            total_sessions: (stats.total_sessions || 0) + 1
          })
          .eq('user_id', userId);

        if (updateError) {
          console.error('Error updating stats:', updateError);
        } else {
          toast({
            title: "Mood tracked!",
            description: "Your wellness stats have been updated."
          });
        }
      }
    }
  };

  const scrollToAIChat = () => {
    const aiSection = document.getElementById("ai-chat");
    aiSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="mood-tracker" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
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
            {moods.map(({ image, label, color }) => (
              <button
                key={label}
                onClick={() => handleMoodSelect(label)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  selectedMood === label
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50"
                } ${color} group`}
              >
                <div className="w-20 h-20 transition-transform duration-300 group-hover:scale-110 group-hover:animate-pulse">
                  <img 
                    src={image} 
                    alt={`${label} mood`} 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
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
                <Button variant="default" onClick={() => navigate("/personality-screening")}>
                  Take Screening Assessment
                </Button>
                <Button variant="secondary" onClick={() => navigate("/journal")}>
                  Journal Your Thoughts
                </Button>
                <Button variant="outline" onClick={() => navigate("/ai-support")}>
                  Talk to AI Support
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default MoodTracker;
