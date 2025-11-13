import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ExternalLink, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Research {
  title: string;
  abstract: string;
  journal: string;
  date: string;
  topic: string;
  url: string;
  impact: string;
}

const ResearchUpdates = () => {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchResearch();
  }, []);

  const fetchResearch = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'research-updates', limit: 15 }
      });
      
      if (error) throw error;
      if (data?.research) setResearch(data.research);
      
      toast({
        title: "Research Updated",
        description: "Latest brain and mind research loaded",
      });
    } catch (error) {
      console.error('Error fetching research:', error);
      toast({
        title: "Error",
        description: "Failed to fetch research updates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Brain className="w-10 h-10 text-primary" />
                Research & Technology
              </h1>
              <p className="text-muted-foreground">Latest breakthroughs in brain and mind science from international journals</p>
            </div>
            <Button onClick={fetchResearch} disabled={loading} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {loading && research.length === 0 ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {research.map((item, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-accent/30 bg-gradient-to-br from-card to-accent/5">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 flex items-start gap-2">
                          <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                          <span>{item.title}</span>
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary">{item.topic}</Badge>
                          <Badge variant="outline">{item.impact}</Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.abstract}</p>
                    <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                      <div className="text-xs space-y-1">
                        <p className="text-primary font-semibold">{item.journal}</p>
                        <p className="text-muted-foreground">{item.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          Read More
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchUpdates;
