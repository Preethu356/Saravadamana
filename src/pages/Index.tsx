import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";
import NewsTicker from "@/components/NewsTicker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <NewsTicker />
      <Hero />
      <Gallery />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Index;
