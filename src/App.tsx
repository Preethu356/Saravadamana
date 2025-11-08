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
import AIChat from "./components/AIChat";
import PrimaryCare from "./pages/PrimaryCare";
import SecondaryCare from "./pages/SecondaryCare";
import TertiaryCare from "./pages/TertiaryCare";

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
              <Route path="/ai-chat" element={<AIChat />} />
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
