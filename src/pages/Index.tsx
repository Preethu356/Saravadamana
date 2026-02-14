import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import FeedbackSection from "@/components/FeedbackSection";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import NewsTicker from "@/components/NewsTicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ConsentModal } from "@/components/ConsentModal";
import { useAnalytics } from "@/hooks/useAnalytics";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { WeeklyWellnessSummary } from "@/components/WeeklyWellnessSummary";
import WarmGreeting from "@/components/WarmGreeting";
import MicroInterventions from "@/components/MicroInterventions";
import AdaptiveJourney from "@/components/AdaptiveJourney";
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Smile, 
  Moon, 
  Utensils, 
  Dumbbell, 
  Activity,
  Award,
  TrendingUp,
  Target,
  Heart
} from "lucide-react";
import { motion } from "framer-motion";

interface WellnessStats {
  current_streak: number;
  total_sessions: number;
  mood_entries: number;
  meditation_minutes: number;
}

interface QuickModule {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  route: string;
  gradient: string;
  progress?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { hasConsent, saveConsent } = useAnalytics();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [userName, setUserName] = useState<string>("");
  const [wellnessStats, setWellnessStats] = useState<WellnessStats>({
    current_streak: 0,
    total_sessions: 0,
    mood_entries: 0,
    meditation_minutes: 0
  });
  const [screeningCount, setScreeningCount] = useState(0);
  const [sequenceCount, setSequenceCount] = useState(0);
  const volume = 0.02;

  const quickModules: QuickModule[] = [
    {
      id: "mind-sequencing",
      title: "Mind Sequencing",
      subtitle: "AI wellness journey",
      icon: Brain,
      route: "/mind-sequencing",
      gradient: "from-primary to-accent",
      progress: sequenceCount > 0 ? Math.min((sequenceCount / 7) * 100, 100) : 0
    },
    {
      id: "mood-tracker",
      title: "Mood Tracker",
      subtitle: "Daily check-in",
      icon: Smile,
      route: "/mood-tracker",
      gradient: "from-comfort to-warm",
      progress: Math.min((wellnessStats.mood_entries / 30) * 100, 100)
    },
    {
      id: "mind-sleep",
      title: "Mind Your Sleep",
      subtitle: "Better rest",
      icon: Moon,
      route: "/mind-your-sleep",
      gradient: "from-accent to-primary"
    },
    {
      id: "mind-diet",
      title: "Mind Your Diet",
      subtitle: "Nutrition plan",
      icon: Utensils,
      route: "/mind-your-diet",
      gradient: "from-secondary to-primary"
    },
    {
      id: "mind-gym",
      title: "Mind Your Gym",
      subtitle: "Exercise routine",
      icon: Dumbbell,
      route: "/mind-your-gym",
      gradient: "from-warm to-comfort"
    },
    {
      id: "screening",
      title: "Screening",
      subtitle: "Assessments",
      icon: Activity,
      route: "/start-journey",
      gradient: "from-primary to-secondary",
      progress: Math.min((screeningCount / 5) * 100, 100)
    }
  ];

  useEffect(() => {
    fetchUserData();
    
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    // Auto-play on first user interaction
    const startAudio = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
        } catch (error) {
          // Browser blocked autoplay, will play on interaction
        }
      }
    };
    
    startAudio();

    // Play on any user interaction if not already playing
    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const name = session.user.user_metadata?.full_name?.split(' ')[0] || 
                   session.user.email?.split('@')[0] || 'Friend';
      setUserName(name);

      const { data: statsData } = await supabase
        .from('user_wellness_stats')
        .select('current_streak, total_sessions, mood_entries, meditation_minutes')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (statsData) {
        setWellnessStats(statsData);
      }

      const { data: screeningData } = await supabase
        .from('screening_results')
        .select('id')
        .eq('user_id', session.user.id);

      if (screeningData) {
        setScreeningCount(screeningData.length);
      }

      const { data: sequenceData } = await supabase
        .from('sequences')
        .select('id')
        .eq('user_id', session.user.id);

      if (sequenceData) {
        setSequenceCount(sequenceData.length);
      }
    }
  };

  return (
    <div className="min-h-screen gradient-comfort">
      {/* Background Music - Auto plays on interaction */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/calm-meditation.mp3" type="audio/mpeg" />
      </audio>
      
      <ConsentModal open={!hasConsent} onConsent={saveConsent} />
      
      {/* Quote Ticker */}
      <NewsTicker />

      {/* Main Content */}
      <section className="container mx-auto px-4 py-6">
        {/* Warm Greeting */}
        <WarmGreeting userName={userName} />

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          <Card className="bg-gradient-to-br from-comfort/10 to-warm/10 border-comfort/30 shadow-warm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-comfort to-warm flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.current_streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/30 shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.total_sessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-soft">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.mood_entries}</p>
                <p className="text-xs text-muted-foreground">Moods Logged</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-warm/10 to-accent/10 border-warm/30 shadow-warm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warm to-accent flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.meditation_minutes}</p>
                <p className="text-xs text-muted-foreground">Min Mindful</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Micro Interventions - Quick Calm */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <MicroInterventions compact />
        </motion.div>

        {/* 7-Day Adaptive Journey - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <AdaptiveJourney compact />
        </motion.div>

        {/* Quick Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-primary">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-soft transition-all hover:scale-[1.02] group overflow-hidden border-border/50"
                    onClick={() => navigate(module.route)}
                  >
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-0.5 line-clamp-1">{module.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{module.subtitle}</p>
                      {module.progress !== undefined && module.progress > 0 && (
                        <Progress value={module.progress} className="h-1 mt-2" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Weekly Wellness Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeeklyWellnessSummary />
        </motion.div>
      </section>

      <Hero />
      
      {/* Start Journey CTA - Warm redesign */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-warm/10 p-8 border border-primary/20 shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1),transparent_50%)]" />
          
          <div className="relative z-10 text-center">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 text-primary mb-4 shadow-soft"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Personalized for You</span>
            </motion.div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Begin Your Mental Wellness Journey
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Take our personalized assessment to discover your unique path to mental wellness — designed for Students, Professionals, Women, and Elderly
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/start-journey")}
              className="bg-gradient-to-r from-primary via-accent to-warm hover:from-primary/90 hover:via-accent/90 hover:to-warm/90 text-white shadow-soft hover:shadow-glow transition-all"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      <Gallery />
      <FeedbackSection />
      <ComplianceFooter />
      <BottomNav />
    </div>
  );
};

export default Index;
