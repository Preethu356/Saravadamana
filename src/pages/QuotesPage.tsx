import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Calendar, Sun, Moon, Sunrise, Sunset, Quote, Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";
import { format } from "date-fns";
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
  if (hour >= 5 && hour < 12) return { name: 'morning', icon: Sunrise, greeting: 'Good Morning', gradient: 'from-amber-500 via-orange-400 to-yellow-500' };
  if (hour >= 12 && hour < 17) return { name: 'afternoon', icon: Sun, greeting: 'Good Afternoon', gradient: 'from-sky-500 via-blue-400 to-cyan-500' };
  if (hour >= 17 && hour < 21) return { name: 'evening', icon: Sunset, greeting: 'Good Evening', gradient: 'from-purple-500 via-pink-400 to-rose-500' };
  return { name: 'night', icon: Moon, greeting: 'Good Night', gradient: 'from-indigo-500 via-violet-400 to-purple-500' };
};

const QuotesPage = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [timeOfDay] = useState(getTimeOfDay());
  
  const today = new Date();
  const dayName = format(today, "EEEE");
  const fullDate = format(today, "MMMM d, yyyy");

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      const todayISO = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'quote-of-the-day', limit: 1, date: todayISO }
      });
      
      if (error) throw error;
      
      if (data?.quote) {
        setQuote(data.quote);
        toast({
          title: "Quote Updated",
          description: `Today's ${dayName} inspiration is ready!`,
        });
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareQuote = (platform: string) => {
    if (!quote) return;
    
    const text = `"${quote.quote}" — ${quote.author}`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
    };
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Copied!", description: "Quote copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const TimeIcon = timeOfDay.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header with Time-based Greeting */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${timeOfDay.gradient} text-white mb-6 shadow-lg`}>
            <TimeIcon className="w-5 h-5" />
            <span className="font-medium">{timeOfDay.greeting}</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Daily Inspiration
            </h1>
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            A mindful quote curated for your {dayName}
          </p>
        </div>

        {/* Date Display */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 bg-card border border-border rounded-full px-5 py-2 shadow-sm">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">{dayName}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{fullDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <Button
            onClick={fetchQuote}
            disabled={loading}
            className="gap-2 shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Quote
          </Button>
          
          {quote && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 shadow-md hover:shadow-lg transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-44">
                <DropdownMenuItem onClick={() => shareQuote('twitter')} className="gap-2">
                  <span className="font-bold">𝕏</span> Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareQuote('facebook')} className="gap-2">
                  <span className="text-blue-600">f</span> Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareQuote('linkedin')} className="gap-2">
                  <span className="text-blue-700 font-bold">in</span> LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareQuote('whatsapp')} className="gap-2">
                  <span className="text-green-600">💬</span> WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareQuote('copy')} className="gap-2">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Quote'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Quote Card */}
        {loading && !quote ? (
          <Card className={`p-12 bg-gradient-to-br ${timeOfDay.gradient} opacity-20`}>
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-white/30 rounded w-3/4 mx-auto"></div>
              <div className="h-6 bg-white/30 rounded w-2/3 mx-auto"></div>
              <div className="h-4 bg-white/30 rounded w-1/3 mx-auto"></div>
            </div>
          </Card>
        ) : quote ? (
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${timeOfDay.gradient} opacity-10`}></div>
            
            {/* Quote Mark */}
            <div className="absolute top-4 left-6 opacity-10">
              <Quote className="w-24 h-24 text-primary" />
            </div>
            
            <div className="relative p-8 md:p-12">
              <blockquote className="space-y-6">
                <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed text-center relative z-10">
                  "{quote.quote}"
                </p>
                
                <footer className="text-center space-y-4">
                  <cite className={`text-xl font-semibold bg-gradient-to-r ${timeOfDay.gradient} bg-clip-text text-transparent not-italic block`}>
                    — {quote.author}
                  </cite>
                  
                  {quote.theme && (
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border border-border">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        <span className="capitalize">Today's theme: {quote.theme}</span>
                      </span>
                    </div>
                  )}
                </footer>
              </blockquote>
            </div>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No quote available. Try refreshing.</p>
          </Card>
        )}

        {/* Info Footer */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Quotes are curated based on the day of the week and special mental health awareness dates.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Quote refreshes daily at midnight • Click to pause the ticker on the homepage
          </p>
        </div>
      </div>
      
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default QuotesPage;
