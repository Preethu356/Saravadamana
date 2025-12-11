import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Calendar, Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { format } from "date-fns";

interface QuoteOfDay {
  quote: string;
  author: string;
  theme?: string;
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { name: 'morning', icon: Sunrise, gradient: 'from-amber-500/20 via-orange-400/10 to-yellow-300/20' };
  if (hour >= 12 && hour < 17) return { name: 'afternoon', icon: Sun, gradient: 'from-sky-500/20 via-blue-400/10 to-cyan-300/20' };
  if (hour >= 17 && hour < 21) return { name: 'evening', icon: Sunset, gradient: 'from-purple-500/20 via-pink-400/10 to-rose-300/20' };
  return { name: 'night', icon: Moon, gradient: 'from-indigo-500/20 via-violet-400/10 to-purple-300/20' };
};

const NewsTicker = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [isLoading, setIsLoading] = useState(true);

  const today = new Date();
  const dayName = format(today, 'EEEE');
  const dateStr = format(today, 'MMM d, yyyy');

  useEffect(() => {
    fetchQuoteOfDay();
    
    // Update time of day every hour
    const timeInterval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60 * 60 * 1000);
    
    // Auto-refresh quote daily at midnight
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      fetchQuoteOfDay();
      const dailyInterval = setInterval(fetchQuoteOfDay, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);
    
    return () => {
      clearInterval(timeInterval);
      clearTimeout(midnightTimeout);
    };
  }, []);

  const fetchQuoteOfDay = async () => {
    try {
      setIsLoading(true);
      const todayISO = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'quote-of-the-day', limit: 1, date: todayISO }
      });
      
      if (error) throw error;
      if (data?.quote) {
        setQuote(data.quote);
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    setIsPaused(!isPaused);
  };

  const TimeIcon = timeOfDay.icon;

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r ${timeOfDay.gradient} border-y border-primary/20 py-3 backdrop-blur-sm`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-pulse flex items-center gap-2">
              <div className="h-4 w-4 bg-primary/30 rounded-full"></div>
              <div className="h-3 w-48 bg-primary/20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quote || !quote.quote || !quote.author) {
    return null;
  }

  return (
    <div 
      className={`bg-gradient-to-r ${timeOfDay.gradient} border-y border-primary/20 py-3 overflow-hidden backdrop-blur-sm transition-all duration-500 cursor-pointer hover:shadow-md`}
      onClick={handleClick}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          {/* Date & Day Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-full shadow-lg shrink-0">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-xs whitespace-nowrap">{dayName}</span>
            <span className="text-xs opacity-80">•</span>
            <TimeIcon className="w-3.5 h-3.5" />
          </div>
          
          {/* Mobile Badge */}
          <div className="flex sm:hidden items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full shadow-lg shrink-0">
            <Sparkles className="w-3 h-3" />
            <span className="text-xs font-medium">Daily</span>
          </div>
          
          {/* Quote Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className={`flex whitespace-nowrap ${isPaused ? '' : 'animate-[scroll-continuous_45s_linear_infinite]'}`}>
              {[1, 2, 3].map((i) => (
                <span key={i} className="inline-flex items-center text-sm pr-16">
                  <span className="font-serif italic text-foreground/90">"{quote.quote}"</span>
                  <span className="mx-2 text-primary font-semibold">—</span>
                  <span className="font-medium text-primary">{quote.author}</span>
                  {quote.theme && (
                    <>
                      <span className="mx-3 text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full capitalize">{quote.theme}</span>
                    </>
                  )}
                </span>
              ))}
            </div>
          </div>
          
          {/* Pause Indicator */}
          {isPaused && (
            <div className="shrink-0 text-xs text-muted-foreground bg-muted/80 px-2 py-0.5 rounded-full">
              Paused
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
