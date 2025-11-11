import AIChat from "@/components/AIChat";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";

const AISupport = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Talk to "Mini Menti"
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI companion for mental health support and guidance
          </p>
        </div>
      </div>
      <AIChat />
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default AISupport;
