import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Moon, Play, Save } from "lucide-react";
import { toast } from "sonner";

const bedtimeRoutine = [
  { step: "Digital Detox", duration: 15, description: "Turn off all screens 30 min before bed", audioScript: "Power down your devices. The blue light interferes with melatonin production." },
  { step: "Gentle Stretching", duration: 5, description: "Release physical tension", audioScript: "Gently stretch your neck, shoulders, and back. Release the day's tension." },
  { step: "Breathing Exercise", duration: 5, description: "4-7-8 breathing technique", audioScript: "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times." },
  { step: "Gratitude Reflection", duration: 5, description: "Write 3 things you're grateful for", audioScript: "Reflect on three positive moments from today. This primes your mind for rest." },
  { step: "Cool Down", duration: 5, description: "Lower room temperature to 65-68°F", audioScript: "A cooler room temperature helps signal your body it's time to sleep." }
];

const psqiQuestions = [
  "During the past month, how would you rate your sleep quality overall?",
  "How many hours of actual sleep did you get per night?",
  "How often did you have trouble falling asleep?",
  "How often did you wake up in the middle of the night?"
];

const MindYourSleep = () => {
  const [sleepQuality, setSleepQuality] = useState(5);
  const [bodyImageReflection, setBodyImageReflection] = useState("");
  const [playingStep, setPlayingStep] = useState<number | null>(null);

  const handleSaveRoutine = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save your routine");
        return;
      }

      const { error } = await supabase.from("sleep_routines").insert({
        user_id: user.id,
        bedtime_routine: bedtimeRoutine,
        sleep_quality_rating: sleepQuality,
        body_image_reflection: bodyImageReflection
      });

      if (error) throw error;
      toast.success("Sleep routine saved!");
    } catch (error: any) {
      toast.error("Failed to save: " + error.message);
    }
  };

  const handlePlayAudio = (index: number) => {
    setPlayingStep(index);
    toast.info("Audio guide coming soon");
    setTimeout(() => setPlayingStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-500/10 mb-4">
            <Moon className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            Mind Your Sleep
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your perfect bedtime routine for better mental health and restful sleep.
          </p>
        </div>

        {/* Bedtime Routine Creator */}
        <Card>
          <CardHeader>
            <CardTitle>Your Bedtime Routine</CardTitle>
            <CardDescription>Follow these steps 35 minutes before your target bedtime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bedtimeRoutine.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-600 px-2 py-1 rounded">
                      {item.duration} min
                    </span>
                    <span className="font-medium">{item.step}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlayAudio(index)}
                  disabled={playingStep === index}
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sleep Quality Self-Evaluation */}
        <Card>
          <CardHeader>
            <CardTitle>Sleep Quality Check</CardTitle>
            <CardDescription>Rate your sleep quality over the past week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium">
                Overall Sleep Quality (1 = Very Poor, 10 = Excellent)
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[sleepQuality]}
                  onValueChange={(value) => setSleepQuality(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
                <span className="text-2xl font-bold text-primary w-12 text-center">
                  {sleepQuality}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Body Image Reflection */}
        <Card>
          <CardHeader>
            <CardTitle>Self-Reflection: How You See Yourself</CardTitle>
            <CardDescription>
              Reflect on how you perceive yourself. This helps us understand the connection between body image and sleep.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="How do you feel about your body today? What aspects make you feel comfortable or uncomfortable? Write freely..."
              value={bodyImageReflection}
              onChange={(e) => setBodyImageReflection(e.target.value)}
              className="min-h-[120px]"
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button onClick={handleSaveRoutine} size="lg" className="gap-2">
            <Save className="w-5 h-5" />
            Save My Sleep Plan
          </Button>
        </div>

        {/* Evidence */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Evidence-Based References</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Sleep and mental health: Bidirectional relationship (Walker, 2017)</p>
            <p>• Sleep hygiene practices: Clinical review (Irish et al., 2015)</p>
            <p>• Pittsburgh Sleep Quality Index: Validation study (Buysse et al., 1989)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindYourSleep;