import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import NewsTicker from "@/components/NewsTicker";
import { Button } from "@/components/ui/button";
import { ConsentModal } from "@/components/ConsentModal";
import { useAnalytics } from "@/hooks/useAnalytics";
import BottomNav from "@/components/BottomNav";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { hasConsent, saveConsent } = useAnalytics();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 100 }); // Left corner below quote ticker
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const volume = 0.02; // Fixed 2% volume

  useEffect(() => {
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }

    // Try to autoplay with gentle volume
    const playAudio = async () => {
      if (audioRef.current && !hasInteracted) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasInteracted(true);
        } catch (error) {
          // Browser blocked autoplay - user needs to interact first
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

  // Handle dragging
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

  return (
    <div className="min-h-screen">
      {/* Background Music - Slow meditative instrumental */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/calm-meditation.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Draggable Round Pulsating Listen Button */}
      <div
        className="fixed z-50 cursor-move"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onMouseDown={handleMouseDown}
      >
        <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
          {/* Pulsating glow effect */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-50 ${isPlaying ? 'animate-pulse' : ''}`} />
          
          {/* Round button - smaller size */}
          <Button
            onClick={toggleMusic}
            variant="ghost"
            size="sm"
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 backdrop-blur-md border-2 border-white/30 shadow-xl hover:shadow-purple-500/50 transition-all hover:scale-105 p-0"
            aria-label="Listen"
            title="Listen"
          >
            <span className={`text-white font-semibold text-xs tracking-wide ${isPlaying ? 'animate-pulse' : ''}`}>
              Listen
            </span>
          </Button>
        </div>
      </div>
      
      <ConsentModal 
        open={!hasConsent} 
        onConsent={saveConsent}
      />
      
      <NewsTicker />
      <Hero />
      
      {/* Start Journey CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 p-8 backdrop-blur-sm border border-primary/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse" />
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
