import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
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
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/mood-tracker" element={<ProtectedRoute><MoodTracking /></ProtectedRoute>} />
              <Route path="/ai-support" element={<ProtectedRoute><AISupport /></ProtectedRoute>} />
              <Route path="/wellness-tools" element={<ProtectedRoute><WellnessPage /></ProtectedRoute>} />
              <Route path="/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
              <Route path="/cbt-consultation" element={<ProtectedRoute><CBTPage /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
              <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
              <Route path="/primary-care" element={<ProtectedRoute><PrimaryCare /></ProtectedRoute>} />
              <Route path="/secondary-care" element={<ProtectedRoute><SecondaryCare /></ProtectedRoute>} />
              <Route path="/tertiary-care" element={<ProtectedRoute><TertiaryCare /></ProtectedRoute>} />
              
              {/* 404 Route */}
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
