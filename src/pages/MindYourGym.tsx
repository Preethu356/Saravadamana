import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Play, Plus, Clock, Calendar } from "lucide-react";
import { toast } from "sonner";

const exercisePlans = [
  {
    type: "mood-boost",
    title: "Morning Energy Burst",
    duration: 5,
    exercises: [
      { name: "Jumping Jacks", duration: 1, reps: "30 seconds", benefit: "Releases endorphins" },
      { name: "Arm Circles", duration: 1, reps: "20 forward, 20 back", benefit: "Wakes up your body" },
      { name: "High Knees", duration: 1, reps: "30 seconds", benefit: "Boosts energy" },
      { name: "Dancing", duration: 2, reps: "Freestyle", benefit: "Elevates mood instantly" }
    ],
    moodBenefit: "Perfect for beating morning blues and starting your day energized",
    icon: "☀️"
  },
  {
    type: "stress-relief",
    title: "Stress Melter",
    duration: 4,
    exercises: [
      { name: "Deep Breathing", duration: 1, reps: "5 deep breaths", benefit: "Calms nervous system" },
      { name: "Shoulder Rolls", duration: 1, reps: "10 forward, 10 back", benefit: "Releases tension" },
      { name: "Gentle Stretching", duration: 2, reps: "Full body", benefit: "Relaxes muscles" }
    ],
    moodBenefit: "Ideal for midday stress or overwhelming moments",
    icon: "🧘"
  },
  {
    type: "energy",
    title: "Quick Cardio Boost",
    duration: 3,
    exercises: [
      { name: "Burpees", duration: 1, reps: "5-10", benefit: "Full body wake-up" },
      { name: "Mountain Climbers", duration: 1, reps: "20", benefit: "Heart rate up" },
      { name: "Plank", duration: 1, reps: "30-60 seconds", benefit: "Core activation" }
    ],
    moodBenefit: "Beat afternoon slump and regain focus",
    icon: "⚡"
  }
];

const MindYourGym = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSavePlan = async (plan: typeof exercisePlans[0]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save your plan");
        return;
      }

      const { error } = await supabase.from("exercise_plans").insert({
        user_id: user.id,
        plan_type: plan.type,
        title: plan.title,
        exercises: plan.exercises,
        reminder_enabled: false
      });

      if (error) throw error;
      toast.success("Exercise plan saved!");
    } catch (error: any) {
      toast.error("Failed to save plan: " + error.message);
    }
  };

  const handlePlayVideo = (planTitle: string) => {
    toast.info(`Video demonstration for "${planTitle}" coming soon`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 mb-4">
            <Dumbbell className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Mind Your Gym
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Short movement breaks designed for mental wellness. Just 3-5 minutes to boost your mood.
          </p>
        </div>

        {/* Exercise Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercisePlans.map((plan, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPlan(plan.type)}
            >
              <CardHeader>
                <div className="text-4xl mb-2">{plan.icon}</div>
                <CardTitle className="text-xl">{plan.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-2">
                  <Clock className="w-4 h-4" />
                  {plan.duration} minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{plan.moodBenefit}</p>
                
                <div className="space-y-2">
                  {plan.exercises.map((exercise, idx) => (
                    <div key={idx} className="text-xs bg-secondary/50 p-2 rounded">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-muted-foreground"> • {exercise.reps}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVideo(plan.title);
                    }}
                  >
                    <Play className="w-4 h-4" />
                    Demo
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePlan(plan);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scheduling Section */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule Your Movement
            </CardTitle>
            <CardDescription>
              Set reminders to make movement a daily habit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Set Daily Reminder
            </Button>
          </CardContent>
        </Card>

        {/* Evidence */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Evidence-Based References</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>• Exercise and depression: Meta-analysis (Schuch et al., 2016)</p>
            <p>• Physical activity and anxiety: Systematic review (Aylett et al., 2018)</p>
            <p>• Short bouts of exercise: Mood improvement study (Ekkekakis et al., 2011)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MindYourGym;