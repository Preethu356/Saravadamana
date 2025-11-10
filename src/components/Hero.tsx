import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MessageCircle, Brain, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartJourney = () => {
    // Navigate to mood tracker page
    navigate("/mood-tracker");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Live Date & Time - Top Right */}
      <div className="absolute top-6 right-6 z-20 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl border-2 border-purple-400/50 shadow-glow animate-bounce">
          <Clock className="w-4 h-4 text-purple-300 animate-pulse" />
          <div className="text-sm font-bold">
            <div className="text-blue-300">{format(currentTime, 'MMM d, yyyy')}</div>
            <div className="text-cyan-300 tabular-nums">{format(currentTime, 'p')}</div>
          </div>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              Mental Health
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">Matters</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your safe space for mental wellness. Get AI-powered support, track your mood, and access professional resources anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="lg" className="group" onClick={handleStartJourney}>
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-card/80 backdrop-blur-sm border-2"
              onClick={() => navigate("/resources")}
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-12 max-w-3xl mx-auto">
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-soft">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">24/7</div>
              <div className="text-sm text-muted-foreground">AI Support</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-soft">
              <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">Safe</div>
              <div className="text-sm text-muted-foreground">& Private</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-soft">
              <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">Free</div>
              <div className="text-sm text-muted-foreground">Resources</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blur circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
    </section>
  );
};

export default Hero;
