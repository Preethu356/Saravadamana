import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";
import NewsTicker from "@/components/NewsTicker";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState([0.3]); // Start at 30% volume for gentle intro

  useEffect(() => {
    // Set initial volume
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
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

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

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
      
      {/* Music Control Panel */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-background/95 backdrop-blur-sm border-2 border-border rounded-full shadow-lg p-2 pr-4">
        <Button
          onClick={toggleMusic}
          size="icon"
          variant="ghost"
          className="w-10 h-10 rounded-full hover:scale-110 transition-transform"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Volume2 className="w-5 h-5 text-primary" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>
        
        {/* Volume Slider */}
        <div className="w-24">
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={1}
            step={0.01}
            className="cursor-pointer"
            aria-label="Volume control"
          />
        </div>
        
        <span className="text-xs text-muted-foreground font-medium min-w-[2.5rem] text-right">
          {Math.round(volume[0] * 100)}%
        </span>
      </div>
      
      <NewsTicker />
      <Hero />
      <Gallery />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Index;
