import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
      gradient: "from-violet-500 to-purple-600",
      progress: sequenceCount > 0 ? Math.min((sequenceCount / 7) * 100, 100) : 0
    },
    {
      id: "mood-tracker",
      title: "Mood Tracker",
      subtitle: "Daily check-in",
      icon: Smile,
      route: "/mood-tracker",
      gradient: "from-amber-500 to-orange-500",
      progress: Math.min((wellnessStats.mood_entries / 30) * 100, 100)
    },
    {
      id: "mind-sleep",
      title: "Mind Your Sleep",
      subtitle: "Better rest",
      icon: Moon,
      route: "/mind-your-sleep",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "mind-diet",
      title: "Mind Your Diet",
      subtitle: "Nutrition plan",
      icon: Utensils,
      route: "/mind-your-diet",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      id: "mind-gym",
      title: "Mind Your Gym",
      subtitle: "Exercise routine",
      icon: Dumbbell,
      route: "/mind-your-gym",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      id: "screening",
      title: "Screening",
      subtitle: "Assessments",
      icon: Activity,
      route: "/start-journey",
      gradient: "from-cyan-500 to-blue-500",
      progress: Math.min((screeningCount / 5) * 100, 100)
    }
  ];

  useEffect(() => {
    fetchUserData();
    
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    const playAudio = async () => {
      if (audioRef.current && !hasInteracted) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          console.log("Please click the play button to start music");
        }
      }
    };
    
    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [hasInteracted]);

  const fetchUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      // Get user name
      const name = session.user.user_metadata?.full_name?.split(' ')[0] || 
                   session.user.email?.split('@')[0] || 'Friend';
      setUserName(name);

      // Fetch wellness stats
      const { data: statsData } = await supabase
        .from('user_wellness_stats')
        .select('current_streak, total_sessions, mood_entries, meditation_minutes')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (statsData) {
        setWellnessStats(statsData);
      }

      // Fetch screening count
      const { data: screeningData } = await supabase
        .from('screening_results')
        .select('id')
        .eq('user_id', session.user.id);

      if (screeningData) {
        setScreeningCount(screeningData.length);
      }

      // Fetch sequence count
      const { data: sequenceData } = await supabase
        .from('sequences')
        .select('id')
        .eq('user_id', session.user.id);

      if (sequenceData) {
        setSequenceCount(sequenceData.length);
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const toggleMusic = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          console.log("Error playing audio:", error);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-pink-50/30 to-background dark:from-slate-950 dark:via-slate-900 dark:to-background">
      {/* Background Music */}
      <audio ref={audioRef} loop preload="auto" className="hidden">
        <source src="/calm-meditation.mp3" type="audio/mpeg" />
      </audio>
      
      {/* Draggable Listen Button */}
      <div
        className="fixed z-50 cursor-move"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onMouseDown={handleMouseDown}
      >
        <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-50 ${isPlaying ? 'animate-pulse' : ''}`} />
          <Button
            onClick={toggleMusic}
            variant="ghost"
            size="sm"
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 backdrop-blur-md border-2 border-white/30 shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105 p-0"
          >
            <span className={`text-white font-semibold text-xs ${isPlaying ? 'animate-pulse' : ''}`}>Listen</span>
          </Button>
        </div>
      </div>
      
      <ConsentModal open={!hasConsent} onConsent={saveConsent} />
      
      {/* Quote Ticker */}
      <NewsTicker />

      {/* Mini Dashboard Section */}
      <section className="container mx-auto px-4 py-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
            {getGreeting()}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{userName || 'Friend'}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Your wellness journey continues</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200/50 dark:border-amber-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.current_streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-200/50 dark:border-emerald-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.total_sessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200/50 dark:border-violet-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.mood_entries}</p>
                <p className="text-xs text-muted-foreground">Moods Logged</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-200/50 dark:border-rose-800/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{wellnessStats.meditation_minutes}</p>
                <p className="text-xs text-muted-foreground">Min Mindful</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Modules Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] group overflow-hidden"
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
      </section>

      <Hero />
      
      {/* Start Journey CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100/60 via-pink-50/50 to-purple-100/60 dark:from-blue-950/30 dark:via-pink-950/20 dark:to-purple-950/30 p-8 border border-primary/10">
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Personalized Wellness</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Begin Your Mental Wellness Journey
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Take our personalized assessment to discover your unique path to mental wellness
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/start-journey")}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
      
      <Gallery />
      <ComplianceFooter />
      <BottomNav />
    </div>
  );
};

export default Index;
