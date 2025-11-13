import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteOfDay {
  quote: string;
  author: string;
}

const getTimeBasedGradient = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "bg-gradient-to-r from-orange-100/30 via-yellow-50/20 to-amber-100/30";
  } else if (hour >= 12 && hour < 17) {
    return "bg-gradient-to-r from-sky-100/30 via-blue-50/20 to-cyan-100/30";
  } else if (hour >= 17 && hour < 21) {
    return "bg-gradient-to-r from-purple-100/30 via-pink-50/20 to-rose-100/30";
  } else {
    return "bg-gradient-to-r from-indigo-100/30 via-violet-50/20 to-purple-100/30";
  }
};

const NewsTicker = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [gradient, setGradient] = useState(getTimeBasedGradient());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchQuoteOfDay();
    
    const gradientInterval = setInterval(() => {
      setGradient(getTimeBasedGradient());
    }, 60 * 60 * 1000);
    
    return () => {
      clearInterval(gradientInterval);
    };
  }, []);

  const fetchQuoteOfDay = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'quote-of-the-day', limit: 1 }
      });
      
      if (error) throw error;
      if (data?.quote) {
        setQuote(data.quote);
        toast({
          title: "New quote loaded",
          description: "Click the ticker to refresh",
        });
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClick = () => {
    if (!isRefreshing) {
      fetchQuoteOfDay();
    }
  };

  if (!quote) return null;

  return (
    <div 
      className={`${gradient} border-y border-primary/20 py-2 overflow-hidden backdrop-blur-sm transition-all duration-1000 cursor-pointer hover:opacity-90`}
      onClick={handleClick}
    >
      <div className="relative flex items-center">
        <div className="absolute left-0 z-10 flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-r-full font-semibold text-xs shadow-lg whitespace-nowrap">
          <Sparkles className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Quote of the Day
        </div>
        
        <div className="flex-1 pl-36 overflow-hidden">
          <div className="animate-[scroll_40s_linear_infinite] whitespace-nowrap">
            <span className="inline-flex items-center gap-2 text-sm font-medium">
              <span className="animate-fade-in bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-semibold">
                "{quote.quote}"
              </span>
              <span className="text-xs text-muted-foreground font-bold animate-fade-in" style={{ animationDelay: '0.2s' }}>
                — {quote.author}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
