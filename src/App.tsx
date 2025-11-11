import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import { useLocalStorage } from "./hooks/useLocalStorage";

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResourcesPage = lazy(() => import("./pages/Resources"));
const Journal = lazy(() => import("./pages/Journal"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrimaryCare = lazy(() => import("./pages/PrimaryCare"));
const SecondaryCare = lazy(() => import("./pages/SecondaryCare"));
const TertiaryCare = lazy(() => import("./pages/TertiaryCare"));
const MoodTracking = lazy(() => import("./pages/MoodTracking"));
const AISupport = lazy(() => import("./pages/AISupport"));
const WellnessPage = lazy(() => import("./pages/WellnessPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CBTPage = lazy(() => import("./pages/CBTPage"));
const PersonalityScreening = lazy(() => import("./pages/PersonalityScreening"));
const SchoolMentalHealth = lazy(() => import("./pages/SchoolMentalHealth"));
const WorkplaceMentalHealth = lazy(() => import("./pages/WorkplaceMentalHealth"));
const WomenMentalHealth = lazy(() => import("./pages/WomenMentalHealth"));
const OldAgeMentalHealth = lazy(() => import("./pages/OldAgeMentalHealth"));
const MentalHealthPrevention = lazy(() => import("./pages/MentalHealthPrevention"));
const WellnessPlanGenerator = lazy(() => import("./pages/WellnessPlanGenerator"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const About = lazy(() => import("./pages/About"));
const DepressionScreening = lazy(() => import("./pages/DepressionScreening"));
const AnxietyScreening = lazy(() => import("./pages/AnxietyScreening"));

const queryClient = new QueryClient();

const App = () => {
  const [hasSeenSplash, setHasSeenSplash] = useLocalStorage('hasSeenSplash', false);
  const [showSplash, setShowSplash] = useState(!hasSeenSplash);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasSeenSplash(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
                <Routes>
                  {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/about" element={<About />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracking /></ProtectedRoute>} />
                  <Route path="/ai-support" element={<ProtectedRoute><AISupport /></ProtectedRoute>} />
                  <Route path="/wellness-tools" element={<ProtectedRoute><WellnessPage /></ProtectedRoute>} />
                  <Route path="/personality-screening" element={<ProtectedRoute><PersonalityScreening /></ProtectedRoute>} />
                  <Route path="/depression-screening" element={<ProtectedRoute><DepressionScreening /></ProtectedRoute>} />
                  <Route path="/anxiety-screening" element={<ProtectedRoute><AnxietyScreening /></ProtectedRoute>} />
                  <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
                  <Route path="/cbt-consultation" element={<ProtectedRoute><CBTPage /></ProtectedRoute>} />
                  <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
                  <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                  <Route path="/primary-care" element={<ProtectedRoute><PrimaryCare /></ProtectedRoute>} />
                  <Route path="/secondary-care" element={<ProtectedRoute><SecondaryCare /></ProtectedRoute>} />
                  <Route path="/tertiary-care" element={<ProtectedRoute><TertiaryCare /></ProtectedRoute>} />
                  <Route path="/school-mental-health" element={<ProtectedRoute><SchoolMentalHealth /></ProtectedRoute>} />
                  <Route path="/workplace-mental-health" element={<ProtectedRoute><WorkplaceMentalHealth /></ProtectedRoute>} />
                  <Route path="/women-mental-health" element={<ProtectedRoute><WomenMentalHealth /></ProtectedRoute>} />
                  <Route path="/old-age-mental-health" element={<ProtectedRoute><OldAgeMentalHealth /></ProtectedRoute>} />
                  <Route path="/mental-health-prevention" element={<ProtectedRoute><MentalHealthPrevention /></ProtectedRoute>} />
                  <Route path="/wellness-plan" element={<ProtectedRoute><WellnessPlanGenerator /></ProtectedRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
