import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, 
  Wind, 
  Target, 
  Brain, 
  Moon, 
  Eye,
  Zap,
  CloudRain,
  Battery,
  Focus,
  Frown,
  Smile,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2
} from "lucide-react";
import sarvadamanaLogo from "@/assets/sarvadamana-logo-final.png";

// Step data
const goals = [
  { id: "calm", label: "Calm", icon: Wind, color: "from-teal-400 to-cyan-500", description: "Find peace and tranquility" },
  { id: "focus", label: "Focus", icon: Target, color: "from-violet-400 to-purple-500", description: "Sharpen your concentration" },
  { id: "stress-relief", label: "Stress Relief", icon: CloudRain, color: "from-blue-400 to-indigo-500", description: "Release tension and worry" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "from-indigo-400 to-blue-600", description: "Improve rest quality" },
  { id: "clarity", label: "Clarity", icon: Eye, color: "from-amber-400 to-orange-500", description: "Clear mental fog" },
];

const moods = [
  { id: "stressed", label: "Stressed", icon: Zap, color: "bg-red-100 text-red-600 border-red-200" },
  { id: "tired", label: "Tired", icon: Battery, color: "bg-amber-100 text-amber-600 border-amber-200" },
  { id: "distracted", label: "Distracted", icon: Focus, color: "bg-purple-100 text-purple-600 border-purple-200" },
  { id: "low", label: "Low", icon: Frown, color: "bg-blue-100 text-blue-600 border-blue-200" },
  { id: "calm", label: "Calm", icon: Wind, color: "bg-teal-100 text-teal-600 border-teal-200" },
  { id: "focused", label: "Focused", icon: Target, color: "bg-green-100 text-green-600 border-green-200" },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [intention, setIntention] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => setShowAffirmation(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(m => m !== moodId)
        : [...prev, moodId]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: selectedGoal,
          mental_state: selectedMoods.join(','),
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Small delay for the reveal animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Your journey begins",
        description: "Your personalized wellness path is ready.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error saving onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const canProceed = () => {
    switch (step) {
      case 0: return true;
      case 1: return selectedGoal !== "";
      case 2: return selectedMoods.length > 0;
      case 3: return intention.trim().length > 0;
      case 4: return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 overflow-hidden">
      {/* Ambient background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-violet-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-cyan-300/20 rounded-full blur-3xl"
        />
      </div>

      {/* Progress indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="max-w-md mx-auto">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: i <= step ? 1 : 0.5 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 pt-12">
        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-lg mx-auto px-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="mb-8"
              >
                <img 
                  src={sarvadamanaLogo} 
                  alt="Sarvadamana" 
                  className="w-32 h-32 mx-auto mb-6 drop-shadow-lg"
                />
                <h1 className="text-4xl md:text-5xl font-light text-foreground mb-2">
                  Welcome to
                </h1>
                <h2 className="text-4xl md:text-5xl font-semibold bg-gradient-to-r from-primary via-violet-500 to-primary bg-clip-text text-transparent">
                  Sarvadamana
                </h2>
              </motion.div>

              <AnimatePresence>
                {showAffirmation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-12"
                  >
                    <p className="text-xl md:text-2xl font-light text-muted-foreground italic leading-relaxed">
                      "You deserve a softer moment today."
                    </p>
                    <motion.div 
                      className="mt-4 flex justify-center"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-5 h-5 text-primary/60" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
              >
                <Button
                  onClick={nextStep}
                  size="lg"
                  className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 1: What brings you here? */}
          {step === 1 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto px-4"
            >
              <div className="text-center mb-10">
                <motion.h2 
                  className="text-3xl md:text-4xl font-light text-foreground mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  What brings you here?
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Choose what matters most to you right now
                </motion.p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {goals.map((goal, index) => {
                  const Icon = goal.icon;
                  return (
                    <motion.button
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden group ${
                        selectedGoal === goal.id
                          ? 'border-primary shadow-lg scale-[1.02]'
                          : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 transition-opacity duration-300 ${
                        selectedGoal === goal.id ? 'opacity-10' : 'group-hover:opacity-5'
                      }`} />
                      
                      <div className="relative flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${goal.color} text-white shadow-md`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground mb-1">{goal.label}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                        {selectedGoal === goal.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: How do you feel today? */}
          {step === 2 && (
            <motion.div
              key="moods"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-2xl mx-auto px-4"
            >
              <div className="text-center mb-10">
                <motion.h2 
                  className="text-3xl md:text-4xl font-light text-foreground mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  How do you feel today?
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Select all that apply — honesty helps us help you
                </motion.p>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {moods.map((mood, index) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMoods.includes(mood.id);
                  return (
                    <motion.button
                      key={mood.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.08 * index }}
                      onClick={() => toggleMood(mood.id)}
                      className={`px-5 py-3 rounded-full border-2 transition-all duration-300 flex items-center gap-2 ${
                        isSelected
                          ? `${mood.color} border-current shadow-md scale-105`
                          : 'border-border/50 text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{mood.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {selectedMoods.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-6 text-sm text-muted-foreground"
                >
                  {selectedMoods.length} feeling{selectedMoods.length > 1 ? 's' : ''} selected
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Step 3: Your intention */}
          {step === 3 && (
            <motion.div
              key="intention"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-lg mx-auto px-4"
            >
              <div className="text-center mb-10">
                <motion.h2 
                  className="text-3xl md:text-4xl font-light text-foreground mb-3"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Your intention for the next 7 days
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Set a gentle goal for yourself
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="I want to feel more present and less anxious..."
                  className="min-h-[150px] text-lg p-5 rounded-2xl border-2 border-border/50 focus:border-primary resize-none bg-background/50 backdrop-blur-sm"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Feel calmer", "Sleep better", "Be more present", "Reduce worry"].map((suggestion, i) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      onClick={() => setIntention(suggestion)}
                      className="px-4 py-2 text-sm rounded-full bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 4: Personalized Plan Reveal */}
          {step === 4 && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-lg mx-auto px-4 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="relative"
              >
                {/* Glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-violet-500/20 to-cyan-400/20 rounded-3xl blur-2xl" />
                
                {/* Card */}
                <motion.div 
                  className="relative bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
                      Your Path is Ready
                    </h2>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Based on your goal of <span className="text-primary font-medium">{goals.find(g => g.id === selectedGoal)?.label}</span> and how you're feeling, we've crafted a personalized 7-day wellness journey just for you.
                    </p>

                    <div className="py-4 px-6 bg-muted/30 rounded-xl mb-6">
                      <p className="text-sm text-muted-foreground mb-1">Your intention:</p>
                      <p className="font-medium text-foreground italic">"{intention}"</p>
                    </div>

                    <motion.div 
                      className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span>AI-powered personalization</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-8"
              >
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  size="lg"
                  className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      Start My Journey
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step > 0 && step < 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 left-0 right-0 px-4"
        >
          <div className="max-w-lg mx-auto flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              className="rounded-full px-6"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="rounded-full px-8 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg"
            >
              Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Onboarding;
