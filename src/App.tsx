// Main App Component - Mental Health Platform
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Watermark from "./components/Watermark";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import { supabase } from "@/integrations/supabase/client";

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
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CBTPage = lazy(() => import("./pages/CBTPage"));
const PersonalityScreening = lazy(() => import("./pages/PersonalityScreening"));
const MentalHealthPrevention = lazy(() => import("./pages/MentalHealthPrevention"));
const WellnessPlanGenerator = lazy(() => import("./pages/WellnessPlanGenerator"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const About = lazy(() => import("./pages/About"));
const DepressionScreening = lazy(() => import("./pages/DepressionScreening"));
const AnxietyScreening = lazy(() => import("./pages/AnxietyScreening"));
const MentalHealthNews = lazy(() => import("./pages/MentalHealthNews"));
const ResearchUpdates = lazy(() => import("./pages/ResearchUpdates"));
const StigmaStrategies = lazy(() => import("./pages/StigmaStrategies"));
const MindSequencing = lazy(() => import("./pages/MindSequencing"));
const MindSequencingGenerate = lazy(() => import("./pages/MindSequencingGenerate"));
const MindSequencingPlay = lazy(() => import("./pages/MindSequencingPlay"));
const MindYourDiet = lazy(() => import("./pages/MindYourDiet"));
const MindYourGym = lazy(() => import("./pages/MindYourGym"));
const MindYourSleep = lazy(() => import("./pages/MindYourSleep"));
const QuotesPage = lazy(() => import("./pages/QuotesPage"));
const Analytics = lazy(() => import("./pages/Analytics"));
const MindReflection = lazy(() => import("./pages/MindReflection"));
const MindPlan = lazy(() => import("./pages/MindPlan"));
const NeuralFingerprinting = lazy(() => import("./pages/NeuralFingerprinting"));
const MindClimate = lazy(() => import("./pages/MindClimate"));
const PitchDeck = lazy(() => import("./pages/PitchDeck"));

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setShowSplash(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setIsAuthenticated(true);
          setShowSplash(true);
        } else if (event === 'SIGNED_OUT') {
          setIsAuthenticated(false);
          setShowSplash(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash && isAuthenticated) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Watermark />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col min-h-screen relative z-10"
          >
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
                  <Route path="/mental-health-prevention" element={<ProtectedRoute><MentalHealthPrevention /></ProtectedRoute>} />
                  <Route path="/wellness-plan" element={<ProtectedRoute><WellnessPlanGenerator /></ProtectedRoute>} />
                  <Route path="/mental-health-news" element={<ProtectedRoute><MentalHealthNews /></ProtectedRoute>} />
                  <Route path="/research-updates" element={<ProtectedRoute><ResearchUpdates /></ProtectedRoute>} />
                  <Route path="/stigma-strategies" element={<ProtectedRoute><StigmaStrategies /></ProtectedRoute>} />
                  <Route path="/mind-sequencing" element={<ProtectedRoute><MindSequencing /></ProtectedRoute>} />
                  <Route path="/mind-sequencing/generate" element={<ProtectedRoute><MindSequencingGenerate /></ProtectedRoute>} />
                  <Route path="/mind-sequencing/:id" element={<ProtectedRoute><MindSequencingPlay /></ProtectedRoute>} />
                  
                  {/* Mind Matters Routes */}
                  <Route path="/mind-your-diet" element={<ProtectedRoute><MindYourDiet /></ProtectedRoute>} />
                  <Route path="/mind-your-gym" element={<ProtectedRoute><MindYourGym /></ProtectedRoute>} />
                  <Route path="/mind-your-sleep" element={<ProtectedRoute><MindYourSleep /></ProtectedRoute>} />
                  <Route path="/personality-screening" element={<ProtectedRoute><PersonalityScreening /></ProtectedRoute>} />
                  <Route path="/wellness-plan" element={<ProtectedRoute><WellnessPlanGenerator /></ProtectedRoute>} />
                  <Route path="/mental-health-news" element={<ProtectedRoute><MentalHealthNews /></ProtectedRoute>} />
                  <Route path="/research-updates" element={<ProtectedRoute><ResearchUpdates /></ProtectedRoute>} />
                  <Route path="/stigma-strategies" element={<ProtectedRoute><StigmaStrategies /></ProtectedRoute>} />
                  <Route path="/quotes" element={<ProtectedRoute><QuotesPage /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/mind-reflection" element={<ProtectedRoute><MindReflection /></ProtectedRoute>} />
                  <Route path="/mind-plan" element={<ProtectedRoute><MindPlan /></ProtectedRoute>} />
                  <Route path="/neural-fingerprinting" element={<ProtectedRoute><NeuralFingerprinting /></ProtectedRoute>} />
            <Route path="/mind-climate" element={<ProtectedRoute><MindClimate /></ProtectedRoute>} />
                  <Route path="/pitch-deck" element={<ProtectedRoute><PitchDeck /></ProtectedRoute>} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </motion.div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
