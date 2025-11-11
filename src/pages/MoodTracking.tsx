import MoodTracker from "@/components/MoodTracker";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const MoodTracking = () => {
  return (
    <div className="min-h-screen">
      <MoodTracker />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default MoodTracking;
