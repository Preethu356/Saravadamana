import CBTConsultation from "@/components/CBTConsultation";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const CBTPage = () => {
  return (
    <div className="min-h-screen">
      <CBTConsultation />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default CBTPage;
