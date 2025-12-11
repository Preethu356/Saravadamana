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
import carouselAIChat from "@/assets/carousel-ai-chat.jpg";

const features = [
  { 
    image: carouselWelcome, 
    title: "Welcome to Sarvadamana",
    route: "/start-journey",
    step: 1
  },
  { 
    image: carouselMood, 
    title: "Track Your Daily Mood",
    route: "/mood-tracking",
    step: 2
  },
  { 
    image: carouselScreening, 
    title: "Mental Health Assessment",
    route: "/screening-tools",
    step: 3
  },
  { 
    image: carouselAIChat, 
    title: "Talk to Your Mind",
    route: "/ai-support",
    step: 4
  },
  { 
    image: carouselAIPlan, 
    title: "AI-Powered Wellness Plan",
    route: "/mind-plan",
    step: 5
  },
  { 
    image: carouselPractice, 
    title: "Guided Meditation & Breathing",
    route: "/mind-sequencing",
    step: 6
  },
  { 
    image: carouselProgress, 
    title: "Track Your Progress",
    route: "/analytics",
    step: 7
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
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                
                {/* Step indicator */}
                <div className="absolute top-6 left-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Step {feature.step} of {features.length}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-4xl mx-auto text-center">
                  <h4 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h4>
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
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? "bg-primary w-8 h-3 shadow-glow" 
                  : index < currentIndex
                    ? "bg-primary/60 w-3 h-3"
                    : "bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCarousel;
