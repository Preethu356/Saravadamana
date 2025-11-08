import Hero from "@/components/Hero";
import MoodTracker from "@/components/MoodTracker";
import AIChat from "@/components/AIChat";
import Resources from "@/components/Resources";
import Gallery from "@/components/Gallery";
import CBTConsultation from "@/components/CBTConsultation";
import ComplianceFooter from "@/components/ComplianceFooter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MoodTracker />
      <AIChat />
      <Resources />
      <Gallery />
      <CBTConsultation />
      <ComplianceFooter />
    </div>
  );
};

export default Index;
