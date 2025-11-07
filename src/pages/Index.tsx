import Hero from "@/components/Hero";
import MoodTracker from "@/components/MoodTracker";
import AIChat from "@/components/AIChat";
import Resources from "@/components/Resources";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <MoodTracker />
      <AIChat />
      <Resources />
      <Footer />
    </div>
  );
};

export default Index;
