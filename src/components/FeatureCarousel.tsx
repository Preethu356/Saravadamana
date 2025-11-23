import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import featureDashboard from "@/assets/feature-dashboard.jpg";
import featureScreening from "@/assets/feature-screening.jpg";
import featureMeditation from "@/assets/feature-meditation.jpg";
import featureJournal from "@/assets/feature-journal.jpg";
import featureAiChat from "@/assets/feature-ai-chat.jpg";
import featureAnalytics from "@/assets/feature-analytics.jpg";

const features = [
  { 
    image: featureDashboard, 
    title: "Mood Tracking Dashboard",
    description: "Track your daily emotions and wellness statistics"
  },
  { 
    image: featureScreening, 
    title: "Mental Health Screening",
    description: "Professional assessment tools for anxiety and depression"
  },
  { 
    image: featureMeditation, 
    title: "Guided Meditation",
    description: "Peaceful meditation sessions with breathing exercises"
  },
  { 
    image: featureJournal, 
    title: "Wellness Journal",
    description: "Reflect on your journey with daily journaling"
  },
  { 
    image: featureAiChat, 
    title: "AI Support Chat",
    description: "24/7 empathetic AI assistant for mental health support"
  },
  { 
    image: featureAnalytics, 
    title: "Progress Analytics",
    description: "Visualize your mental health progress with insights"
  },
];

const FeatureCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-16">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          App Features
        </h3>
        <p className="text-muted-foreground">
          Explore our comprehensive mental wellness tools
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-glow border border-border/50">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {features.map((feature, index) => (
            <div key={index} className="min-w-full">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-6">
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? "bg-primary w-8" 
                  : "bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureCarousel;
