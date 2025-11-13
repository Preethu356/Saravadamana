import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Quote } from "lucide-react";

interface QuoteOfDay {
  quote: string;
  author: string;
}

const NewsTicker = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);

  useEffect(() => {
    fetchQuoteOfDay();
    // Refresh quote once per day
    const interval = setInterval(fetchQuoteOfDay, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
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
    <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border-y border-primary/20 py-3 overflow-hidden backdrop-blur-sm">
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
