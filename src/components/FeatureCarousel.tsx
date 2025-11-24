import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import appLogin from "@/assets/app-login.jpg";
import appDashboard from "@/assets/app-dashboard.jpg";
import appMoodTracker from "@/assets/app-mood-tracker.jpg";
import appScreening from "@/assets/app-screening.jpg";
import appMindSequencing from "@/assets/app-mind-sequencing.jpg";
import appAnalytics from "@/assets/app-analytics.jpg";

const features = [
  { 
    image: appLogin, 
    title: "Secure Access to Your Wellness Journey",
    description: "Begin with a simple, secure sign-in. Create your account in seconds and access evidence-based mental health tools designed specifically for your needs. Your data is protected with bank-level encryption.",
    route: "/login"
  },
  { 
    image: appDashboard, 
    title: "Personalized Dashboard & Navigation",
    description: "Access your comprehensive mental wellness hub featuring Mood Tracker, AI Support, Wellness Tools, Professional Screening Tests, Mind Sequencing, Mind Your Diet/Gym/Sleep, and more. Track your wellness streak and celebrate your progress daily.",
    route: "/dashboard"
  },
  { 
    image: appMoodTracker, 
    title: "Daily Mood Tracking & Emotional Awareness",
    description: "Log your emotions with intuitive mood cards ranging from Great to Struggling. Monitor patterns with visual trend graphs, calendar views, and journal entries. Build emotional intelligence by understanding your mental health patterns over time.",
    route: "/mood-tracking"
  },
  { 
    image: appScreening, 
    title: "Professional Mental Health Assessments",
    description: "Complete validated clinical screening tools including PHQ-9 for depression and GAD-7 for anxiety. Receive instant, evidence-based results with severity ratings and professional recommendations tailored to your mental health needs.",
    route: "/depression-screening"
  },
  { 
    image: appMindSequencing, 
    title: "Personalized Intervention Plans",
    description: "Generate AI-powered wellness sequences based on your assessment scores. Follow step-by-step guided interventions including meditation, breathing exercises, CBT activities, and mindfulness practices. Track completion with progress indicators and audio guidance.",
    route: "/mind-sequencing"
  },
  { 
    image: appAnalytics, 
    title: "Comprehensive Progress Analytics",
    description: "Visualize your mental wellness journey with detailed analytics dashboards. Monitor mood trends, assessment score improvements, activity completion rates, wellness streaks, and achievement milestones. Data-driven insights help you understand what works best for your mental health.",
    route: "/analytics"
  },
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const handleSlideClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          How Sarvadamana Works
        </h3>
        <p className="text-muted-foreground text-lg">
          Your complete mental wellness journey from start to finish
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-glow border border-border/50 bg-card">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="min-w-full relative cursor-pointer group"
              onClick={() => handleSlideClick(feature.route)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-8">
                <div className="max-w-4xl mx-auto">
                  <h4 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-base leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <span className="text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2">
                    Click to explore this feature →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background backdrop-blur-sm"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all rounded-full ${
                index === currentIndex 
                  ? "bg-primary w-10 h-3" 
                  : "bg-muted-foreground/40 w-3 h-3 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentIndex + 1} of {features.length} • Click any slide to explore
        </p>
      </div>
    </div>
  );
};

export default FeatureCarousel;
