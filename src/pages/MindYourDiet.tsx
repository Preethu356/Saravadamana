import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple, Play, Plus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const dietTips = [
  {
    day: 1,
    title: "Omega-3 Boost",
    meal: "Breakfast",
    food: "Walnuts + Flaxseeds in oatmeal",
    benefit: "Reduces inflammation, improves mood regulation",
    audioScript: "Start your day with omega-3 rich foods. Add walnuts and flaxseeds to your morning oatmeal for better brain health and mood stability."
  },
  {
    day: 2,
    title: "Probiotic Power",
    meal: "Snack",
    food: "Yogurt with berries",
    benefit: "Gut-brain axis support, reduces anxiety",
    audioScript: "Your gut health directly affects your mental health. Enjoy probiotic-rich yogurt with antioxidant berries for a mood-boosting snack."
  },
  {
    day: 3,
    title: "Dark Leafy Greens",
    meal: "Lunch",
    food: "Spinach salad with chickpeas",
    benefit: "Folate for neurotransmitter production",
    audioScript: "Dark leafy greens like spinach are packed with folate, essential for producing serotonin and dopamine, your brain's feel-good chemicals."
  },
  {
    day: 4,
    title: "Whole Grain Energy",
    meal: "Dinner",
    food: "Brown rice with lentils",
    benefit: "Stable blood sugar, sustained mood",
    audioScript: "Complex carbohydrates in whole grains help maintain stable blood sugar levels, preventing mood swings and energy crashes."
  },
  {
    day: 5,
    title: "Magnesium Rich",
    meal: "Snack",
    food: "Dark chocolate (70%+) + almonds",
    benefit: "Stress reduction, better sleep",
    audioScript: "Magnesium-rich foods like dark chocolate and almonds help calm your nervous system and promote better sleep quality."
  },
  {
    day: 6,
    title: "Hydration Focus",
    meal: "Throughout day",
    food: "Water with lemon, herbal teas",
    benefit: "Cognitive function, mood stability",
    audioScript: "Even mild dehydration can affect your mood and concentration. Aim for 8 glasses of water daily, enhanced with lemon or herbal teas."
  },
  {
    day: 7,
    title: "Colorful Plate",
    meal: "All meals",
    food: "Rainbow vegetables + fruits",
    benefit: "Antioxidants for brain health",
    audioScript: "Eat a rainbow of fruits and vegetables. Different colors provide different antioxidants that protect your brain and boost mental clarity."
  }
];

const MindYourDiet = () => {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);

  const handleDayComplete = (day: number) => {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter(d => d !== day));
    } else {
      setCompletedDays([...completedDays, day]);
      toast.success(`Day ${day} completed! 🎉`);
    }
  };

  const handlePlayAudio = async (dayIndex: number) => {
    setPlayingAudio(dayIndex);
    // ElevenLabs integration would go here
    toast.info("Audio playback coming soon with ElevenLabs integration");
    setTimeout(() => setPlayingAudio(null), 2000);
  };

  const handleSavePlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save your plan");
        return;
      }

      const { error } = await supabase.from("nutrition_plans").insert({
        user_id: user.id,
        plan_type: "7-day",
        title: "Mind Your Diet - 7 Day Challenge",
        meals: dietTips,
        completed_days: completedDays.length,
        total_days: 7
      });

      if (error) throw error;
      toast.success("Diet plan saved!");
    } catch (error: any) {
      toast.error("Failed to save plan: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
            <Apple className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Mind Your Diet
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Evidence-based nutrition tips for mental health. Complete this 7-day micro-challenge to nourish your mind.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={handleSavePlan} className="gap-2">
            <Plus className="w-4 h-4" />
            Add to My Plan
          </Button>
          <Button variant="outline" className="gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Progress: {completedDays.length}/7
          </Button>
        </div>

        {/* Diet Tips Cards */}
        <div className="space-y-4">
          {dietTips.map((tip, index) => (
            <Card key={index} className={completedDays.includes(tip.day) ? "border-green-500 bg-green-50/50 dark:bg-green-950/20" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold bg-green-500/10 text-green-600 px-2 py-1 rounded">
                        Day {tip.day}
                      </span>
                      <span className="text-xs text-muted-foreground">{tip.meal}</span>
                    </div>
                    <CardTitle className="text-xl">{tip.title}</CardTitle>
                    <CardDescription className="mt-2">{tip.food}</CardDescription>
                  </div>
                  <Checkbox
                    checked={completedDays.includes(tip.day)}
                    onCheckedChange={() => handleDayComplete(tip.day)}
                    className="mt-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-primary">Mental Benefit:</span>
                  <span className="text-sm text-muted-foreground">{tip.benefit}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePlayAudio(index)}
                  disabled={playingAudio === index}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  {playingAudio === index ? "Playing..." : "Audio Guide (2 min)"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Evidence Reference */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Evidence-Based References</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Omega-3 fatty acids and mood disorders: Meta-analysis (Lin et al., 2012)</p>
            <p>• Gut microbiota and mental health: Gut-brain axis review (Dinan & Cryan, 2017)</p>
            <p>• Dietary patterns and depression: Systematic review (Lai et al., 2014)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindYourDiet;