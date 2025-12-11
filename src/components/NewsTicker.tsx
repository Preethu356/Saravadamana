import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Calendar, Sun, Moon, Sunrise, Sunset, Share2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuoteOfDay {
  quote: string;
  author: string;
  theme?: string;
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { name: 'morning', icon: Sunrise, gradient: 'from-transparent via-transparent to-transparent' };
  if (hour >= 12 && hour < 17) return { name: 'afternoon', icon: Sun, gradient: 'from-transparent via-transparent to-transparent' };
  if (hour >= 17 && hour < 21) return { name: 'evening', icon: Sunset, gradient: 'from-transparent via-transparent to-transparent' };
  return { name: 'night', icon: Moon, gradient: 'from-transparent via-transparent to-transparent' };
};

const NewsTicker = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const shareQuote = (platform: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!quote) return;
    
    const text = `"${quote.quote}" — ${quote.author}`;
    const url = window.location.origin;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Quote copied to clipboard" });
      return;
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
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
      className="bg-transparent border-y border-primary/10 py-3 overflow-hidden transition-all duration-500 cursor-pointer"
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
          
          {/* Share Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="shrink-0 p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="w-4 h-4 text-primary" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={(e) => shareQuote('twitter', e as any)}>
                𝕏 Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => shareQuote('facebook', e as any)}>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => shareQuote('linkedin', e as any)}>
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => shareQuote('whatsapp', e as any)}>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => shareQuote('copy', e as any)}>
                Copy Quote
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
