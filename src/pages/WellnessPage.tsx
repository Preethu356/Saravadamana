import WellnessTools from "@/components/WellnessTools";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const WellnessPage = () => {
  return (
    <div className="min-h-screen">
      <WellnessTools />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default WellnessPage;
