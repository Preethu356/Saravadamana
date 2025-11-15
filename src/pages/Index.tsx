import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";
import NewsTicker from "@/components/NewsTicker";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Try to autoplay, but handle if browser blocks it
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
      {/* Background Music - plays only on homepage */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/calm-meditation.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Music Control Button */}
      <Button
        onClick={toggleMusic}
        size="icon"
        variant="outline"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 hover:scale-110 transition-transform"
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-primary" />
        ) : (
          <VolumeX className="w-6 h-6 text-muted-foreground" />
        )}
      </Button>
      
      <NewsTicker />
      <Hero />
      <Gallery />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Index;
