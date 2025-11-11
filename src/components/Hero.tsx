import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, MessageCircle, Brain, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import heroBackground from "@/assets/hero-background.jpg";
import meditationImage from "@/assets/meditation.png";

const Hero = () => {
  const currentTime = new Date();
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Navigate to mood tracker page
    navigate("/mood-tracker");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Static Date & Time - Top Right */}
      <div className="absolute top-6 right-6 z-20 animate-fade-in">
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl border-2 border-purple-400/50 shadow-glow">
          <Clock className="w-5 h-5 text-purple-400" />
          <div className="text-sm font-semibold">
            <div className="text-blue-300">{format(currentTime, 'MMM d, yyyy')}</div>
            <div className="text-cyan-300 tabular-nums">{format(currentTime, 'hh:mm a')}</div>
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

          {/* Talk to Your Mind Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 max-w-4xl mx-auto"
          >
            <div className="relative group cursor-pointer" onClick={() => navigate("/ai-support")}>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl p-8 border-2 border-primary/30 shadow-2xl overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  {/* Image Section */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex-shrink-0"
                  >
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                      <img 
                        src={meditationImage} 
                        alt="Talk to Your Mind" 
                        className="relative w-40 h-40 md:w-48 md:h-48 object-cover rounded-full border-4 border-primary shadow-2xl"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Content Section */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
                      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                        Talk to Your Mind
                      </h2>
                      <Sparkles className="w-6 h-6 text-pink-500 animate-pulse" />
                    </div>
                    
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      Connect with <span className="font-semibold text-primary">"Mini Menti"</span> - your AI companion for instant mental health support, guided conversations, and personalized wellness insights.
                    </p>
                    
                    <Button 
                      variant="hero" 
                      size="lg" 
                      className="group shadow-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/ai-support");
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Start Talking Now
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

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
