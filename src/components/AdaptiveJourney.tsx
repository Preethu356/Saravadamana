import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles,
  Target,
  Trophy,
  Flame,
  Heart,
  Brain,
  Moon,
  Sun
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface DayActivity {
  day: number;
  title: string;
  description: string;
  activities: string[];
  completed: boolean;
  icon: React.ElementType;
  focus: string;
}

const defaultJourney: DayActivity[] = [
  {
    day: 1,
    title: "Awareness",
    description: "Begin your journey with self-reflection",
    activities: ["Complete mood check-in", "5-minute breathing exercise", "Write 3 gratitude points"],
    completed: false,
    icon: Brain,
    focus: "Understanding your current state"
  },
  {
    day: 2,
    title: "Foundation",
    description: "Build healthy mental habits",
    activities: ["Morning intention setting", "10-minute meditation", "Evening reflection journal"],
    completed: false,
    icon: Target,
    focus: "Establishing routines"
  },
  {
    day: 3,
    title: "Connection",
    description: "Nurture your relationships",
    activities: ["Reach out to a loved one", "Practice active listening", "Share something positive"],
    completed: false,
    icon: Heart,
    focus: "Social wellbeing"
  },
  {
    day: 4,
    title: "Movement",
    description: "Energize your body and mind",
    activities: ["15-minute gentle exercise", "Mindful walking", "Body scan meditation"],
    completed: false,
    icon: Sun,
    focus: "Physical-mental connection"
  },
  {
    day: 5,
    title: "Rest",
    description: "Prioritize quality sleep",
    activities: ["Sleep hygiene check", "Relaxation techniques", "Digital sunset practice"],
    completed: false,
    icon: Moon,
    focus: "Restorative rest"
  },
  {
    day: 6,
    title: "Growth",
    description: "Challenge and expand",
    activities: ["Try something new", "Reframe a negative thought", "Celebrate small wins"],
    completed: false,
    icon: Sparkles,
    focus: "Personal development"
  },
  {
    day: 7,
    title: "Integration",
    description: "Reflect and plan forward",
    activities: ["Weekly reflection", "Set next week's intentions", "Acknowledge your progress"],
    completed: false,
    icon: Trophy,
    focus: "Consolidation & celebration"
  }
];

interface AdaptiveJourneyProps {
  userType?: "student" | "professional" | "women" | "elderly";
  compact?: boolean;
}

const AdaptiveJourney = ({ userType, compact = false }: AdaptiveJourneyProps) => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState(1);
  const [journey, setJourney] = useState<DayActivity[]>(defaultJourney);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchJourneyProgress();
  }, []);

  const fetchJourneyProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: planData } = await supabase
      .from('mind_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (planData) {
      setCurrentDay(planData.current_day || 1);
      setStreak(planData.streak_count || 0);
    }

    const { data: stats } = await supabase
      .from('user_wellness_stats')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    if (stats) {
      setStreak(stats.current_streak);
    }
  };

  const progress = (journey.filter(d => d.completed).length / journey.length) * 100;

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    
    switch (userType) {
      case "student":
        return `${timeGreeting}! Ready to balance study and self-care today?`;
      case "professional":
        return `${timeGreeting}! Let's manage stress and stay productive.`;
      case "women":
        return `${timeGreeting}! Your wellness journey continues beautifully.`;
      case "elderly":
        return `${timeGreeting}! Each day brings new opportunities for joy.`;
      default:
        return `${timeGreeting}! Your 7-day journey awaits.`;
    }
  };

  if (compact) {
    return (
      <Card className="border-border/50 shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Day {currentDay} of 7</span>
            </div>
            <div className="flex items-center gap-1 text-warm">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-medium">{streak}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2 mb-3" />
          <p className="text-sm text-muted-foreground mb-3">{journey[currentDay - 1]?.title}: {journey[currentDay - 1]?.description}</p>
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-primary to-accent"
            onClick={() => navigate('/mind-plan')}
          >
            Continue Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your 7-Day Adaptive Journey</h2>
          <p className="text-muted-foreground">{getPersonalizedGreeting()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-warm/10 rounded-full">
            <Flame className="w-5 h-5 text-warm" />
            <span className="font-semibold text-warm">{streak} day streak</span>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Day {currentDay}/7
          </Badge>
        </div>
      </div>

      <Card className="border-border/50 shadow-soft overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Journey Progress</CardTitle>
            <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 mt-2" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Journey timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {journey.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex gap-4 ${day.day === currentDay ? 'scale-[1.02]' : ''}`}
                >
                  <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    day.completed 
                      ? 'bg-secondary text-secondary-foreground' 
                      : day.day === currentDay 
                        ? 'bg-primary text-primary-foreground shadow-glow animate-pulse-soft' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {day.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <day.icon className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className={`flex-1 p-4 rounded-xl transition-all ${
                    day.day === currentDay 
                      ? 'bg-primary/5 border border-primary/20' 
                      : 'bg-muted/50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm text-muted-foreground">Day {day.day}</span>
                        <h4 className="font-semibold text-foreground">{day.title}</h4>
                      </div>
                      <Badge variant={day.completed ? "secondary" : day.day === currentDay ? "default" : "outline"}>
                        {day.completed ? "Completed" : day.day === currentDay ? "Today" : "Upcoming"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{day.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {day.activities.map((activity, i) => (
                        <span 
                          key={i} 
                          className="text-xs px-2 py-1 rounded-full bg-background border border-border"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                    {day.day === currentDay && (
                      <Button 
                        className="mt-4 bg-gradient-to-r from-primary to-accent"
                        onClick={() => navigate('/mind-plan')}
                      >
                        Start Today's Activities
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveJourney;
