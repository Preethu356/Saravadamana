import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResourcesPage from "./pages/Resources";
import Journal from "./pages/Journal";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrimaryCare from "./pages/PrimaryCare";
import SecondaryCare from "./pages/SecondaryCare";
import TertiaryCare from "./pages/TertiaryCare";
import MoodTracking from "./pages/MoodTracking";
import AISupport from "./pages/AISupport";
import WellnessPage from "./pages/WellnessPage";
import GalleryPage from "./pages/GalleryPage";
import CBTPage from "./pages/CBTPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/mood-tracker" element={<MoodTracking />} />
              <Route path="/ai-support" element={<AISupport />} />
              <Route path="/wellness-tools" element={<WellnessPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/cbt-consultation" element={<CBTPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/primary-care" element={<PrimaryCare />} />
              <Route path="/secondary-care" element={<SecondaryCare />} />
              <Route path="/tertiary-care" element={<TertiaryCare />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
