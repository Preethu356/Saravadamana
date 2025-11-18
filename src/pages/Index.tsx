import { useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";
import NewsTicker from "@/components/NewsTicker";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
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
      
      {/* Music Button - Listen to me - Aligned with time display */}
      <div className="fixed top-6 left-6 z-50">
        <Button
          onClick={toggleMusic}
          variant="ghost"
          className="px-5 py-2 h-auto rounded-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 hover:from-purple-700 hover:to-pink-700 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all hover:scale-105"
          aria-label="Listen to me"
          title="Listen to me"
        >
          <Music className="w-4 h-4 text-white mr-2" />
          <span className={`text-white font-semibold text-sm tracking-wide ${isPlaying ? 'animate-pulse' : ''}`}>
            Listen to me
          </span>
        </Button>
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
