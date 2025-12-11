import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import carouselWelcome from "@/assets/carousel-welcome.jpg";
import carouselMood from "@/assets/carousel-mood.jpg";
import carouselScreening from "@/assets/carousel-screening.jpg";
import carouselAIPlan from "@/assets/carousel-ai-plan.jpg";
import carouselPractice from "@/assets/carousel-practice.jpg";
import carouselProgress from "@/assets/carousel-progress.jpg";

const features = [
  { 
    image: carouselWelcome, 
    title: "Welcome to Your Calm Space",
    description: "Open Sarvadamana and feel instantly welcomed. A warm, calming interface designed for Students, Professionals, Women, and Elderly. Your safe space for mental wellness begins here.",
    route: "/start-journey",
    step: 1
  },
  { 
    image: carouselMood, 
    title: "Track Your Daily Emotions",
    description: "Express how you're feeling with intuitive mood tracking. Build emotional awareness through daily check-ins that help you understand your patterns and triggers.",
    route: "/mood-tracking",
    step: 2
  },
  { 
    image: carouselScreening, 
    title: "Complete Mental Health Assessments",
    description: "Take validated clinical screenings (PHQ-9, GAD-7, WHO-5) to understand your mental health. Get personalized risk scores and evidence-based insights.",
    route: "/screening-tools",
    step: 3
  },
  { 
    image: carouselAIPlan, 
    title: "Receive AI-Powered Wellness Plans",
    description: "Our AI analyzes your assessments and creates personalized 7-day wellness journeys. Adaptive micro-interventions tailored specifically for your needs.",
    route: "/mind-plan",
    step: 4
  },
  { 
    image: carouselPractice, 
    title: "Practice Guided Interventions",
    description: "Follow calming meditations, breathing exercises, and mindfulness practices. Each session is designed to bring peace and build resilience in just minutes.",
    route: "/mind-sequencing",
    step: 5
  },
  { 
    image: carouselProgress, 
    title: "Celebrate Your Growth",
    description: "Watch your progress unfold with beautiful analytics. Track improvements, celebrate milestones, and see how far you've come on your mental wellness journey.",
    route: "/analytics",
    step: 6
  },
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 6000);

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
          Your journey to mental wellness in 6 simple steps
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl shadow-comfort border border-border/30 bg-card/50 backdrop-blur-sm">
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
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                
                {/* Step indicator */}
                <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Step {feature.step} of {features.length}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-4xl mx-auto">
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                    Tap to explore →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm border-border/50 shadow-comfort"
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background backdrop-blur-sm border-border/50 shadow-comfort"
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Progress dots */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? "bg-primary w-10 h-3 shadow-glow" 
                  : index < currentIndex
                    ? "bg-primary/60 w-3 h-3"
                    : "bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Step {currentIndex + 1}: {features[currentIndex].title}
        </p>
      </div>
    </div>
  );
};

export default FeatureCarousel;
