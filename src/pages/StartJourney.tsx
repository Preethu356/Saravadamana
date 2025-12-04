import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { 
  GraduationCap, 
  Heart, 
  Briefcase, 
  Users, 
  Brain, 
  Lightbulb,
  ArrowRight,
  Sparkles
} from "lucide-react";
import BackButton from "@/components/BackButton";
import BottomNav from "@/components/BottomNav";

const StartJourney = () => {
  const navigate = useNavigate();

  const journeyPaths = [
    {
      id: "students",
      title: "Students Path",
      description: "Academic stress, exam anxiety, and study-life balance",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-500",
      route: "/screening/students",
    },
    {
      id: "women",
      title: "Women's Wellness",
      description: "Hormonal health, emotional balance, and self-care",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      route: "/screening/women",
    },
    {
      id: "workplace",
      title: "Workplace Professional",
      description: "Work stress, burnout prevention, and career wellness",
      icon: Briefcase,
      color: "from-amber-500 to-orange-500",
      route: "/screening/workplace",
    },
    {
      id: "elderly",
      title: "Elderly Wellness",
      description: "Cognitive health, social connection, and life transitions",
      icon: Users,
      color: "from-emerald-500 to-teal-500",
      route: "/screening/elderly",
    },
    {
      id: "personality",
      title: "Who Am I?",
      description: "Discover your personality patterns and strengths",
      icon: Brain,
      color: "from-purple-500 to-violet-500",
      route: "/personality-screening",
    },
    {
      id: "teb",
      title: "TEB Model Intro",
      description: "Thoughts, Emotions & Behaviors understanding",
      icon: Lightbulb,
      color: "from-indigo-500 to-blue-500",
      route: "/neural-fingerprinting",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <BackButton fallbackPath="/dashboard" />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Begin Your Wellness Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Start Your Journey
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose the path that best describes your current life stage for personalized wellness support
          </p>
        </motion.div>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {journeyPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                onClick={() => navigate(path.route)}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${path.color} text-white shadow-lg`}>
                    <path.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {path.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Not sure where to start?{" "}
            <button
              onClick={() => navigate("/neural-fingerprinting")}
              className="text-primary hover:underline font-medium"
            >
              Take our quick assessment
            </button>
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StartJourney;
