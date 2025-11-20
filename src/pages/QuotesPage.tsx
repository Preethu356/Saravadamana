import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ComplianceFooter from "@/components/ComplianceFooter";
import PageNavigation from "@/components/PageNavigation";
import { format } from "date-fns";

interface QuoteOfDay {
  quote: string;
  author: string;
  date?: string;
}

const QuotesPage = () => {
  const [quote, setQuote] = useState<QuoteOfDay | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      setLoading(true);
      console.log('Fetching quote of the day...');
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'quote-of-the-day', limit: 1 }
      });
      
      if (error) throw error;
      
      if (data?.quote) {
        setQuote({ ...data.quote, date: today });
        toast({
          title: "Quote Updated",
          description: "Fresh quote loaded for today!",
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Daily Inspiration
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            A new quote to inspire your day, every day
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Calendar className="w-5 h-5 text-primary" />
          <p className="text-lg font-semibold text-foreground">{today}</p>
        </div>

        <div className="flex justify-center mb-8">
          <Button
            onClick={fetchQuote}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Quote
          </Button>
        </div>

        {loading && !quote ? (
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
            </div>
          </Card>
        ) : quote ? (
          <Card className="p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-xl">
            <blockquote className="space-y-6">
              <p className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed text-center">
                "{quote.quote}"
              </p>
              <footer className="text-right">
                <cite className="text-xl font-semibold text-primary not-italic">
                  — {quote.author}
                </cite>
              </footer>
            </blockquote>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No quote available. Try refreshing.</p>
          </Card>
        )}

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Quote refreshes daily at midnight. Check back tomorrow for new inspiration!</p>
        </div>
      </div>
      
      <ComplianceFooter />
      <PageNavigation />
    </div>
  );
};

export default QuotesPage;
