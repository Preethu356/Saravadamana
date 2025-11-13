import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Quote } from "lucide-react";

interface QuoteOfDay {
  quote: string;
  author: string;
}

const getTimeBasedGradient = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    // Morning: soft sunrise colors
    return "bg-gradient-to-r from-orange-100/30 via-yellow-50/20 to-amber-100/30";
  } else if (hour >= 12 && hour < 17) {
    // Afternoon: bright day colors
    return "bg-gradient-to-r from-sky-100/30 via-blue-50/20 to-cyan-100/30";
  } else if (hour >= 17 && hour < 21) {
    // Evening: sunset colors
    return "bg-gradient-to-r from-purple-100/30 via-pink-50/20 to-rose-100/30";
  } else {
    // Night: deep calm colors
    return "bg-gradient-to-r from-indigo-100/30 via-violet-50/20 to-purple-100/30";
  }
};

const NewsTicker = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [gradient, setGradient] = useState(getTimeBasedGradient());

  useEffect(() => {
    fetchQuoteOfDay();
    // Refresh quote once per day
    const interval = setInterval(fetchQuoteOfDay, 24 * 60 * 60 * 1000);
    
    // Update gradient every hour
    const gradientInterval = setInterval(() => {
      setGradient(getTimeBasedGradient());
    }, 60 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(gradientInterval);
    };
  }, []);

  const fetchQuoteOfDay = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'quote-of-the-day', limit: 1 }
      });
      
      if (error) throw error;
      if (data?.quote) setQuote(data.quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
    }
  };

  if (!quote) return null;

  return (
    <div className={`${gradient} border-y border-primary/20 py-3 overflow-hidden backdrop-blur-sm transition-all duration-1000`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            Quote of the Day
          </div>
          <div className="flex-1 flex items-center gap-3">
            <Quote className="w-5 h-5 text-primary/40 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground italic leading-relaxed">
                "{quote.quote}"
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                — {quote.author}
              </p>
            </div>
            <Quote className="w-5 h-5 text-primary/40 flex-shrink-0 rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
