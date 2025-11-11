import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Define the page order matching the menu structure
const PAGE_ORDER = [
  "/",
  "/about",
  "/dashboard",
  "/school-mental-health",
  "/workplace-mental-health",
  "/women-mental-health",
  "/old-age-mental-health",
  "/mental-health-prevention",
  "/primary-care",
  "/secondary-care",
  "/tertiary-care",
  "/mood-tracker",
  "/ai-support",
  "/wellness-plan",
  "/resources",
  "/journal",
  "/wellness-tools",
  "/cbt-consultation"
];

const PageNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentIndex = PAGE_ORDER.indexOf(location.pathname);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < PAGE_ORDER.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(PAGE_ORDER[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      navigate(PAGE_ORDER[currentIndex + 1]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 flex gap-2 z-40">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={!hasPrevious}
        className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-30 transition-all"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={!hasNext}
        className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/10 disabled:opacity-30 transition-all"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default PageNavigation;
