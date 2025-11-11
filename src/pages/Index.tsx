import Hero from "@/components/Hero";
import ComplianceFooter from "@/components/ComplianceFooter";
import Gallery from "@/components/Gallery";
import PageNavigation from "@/components/PageNavigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Gallery />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default Index;
