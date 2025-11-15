import { useEffect, useRef } from "react";
import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";
import NewsTicker from "@/components/NewsTicker";

const Index = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Play background music when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio autoplay prevented:", error);
      });
    }

    // Cleanup - pause music when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Background Music - plays only on homepage */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        className="hidden"
      >
        <source src="/mind-blending.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <NewsTicker />
      <Hero />
      <Gallery />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Index;
