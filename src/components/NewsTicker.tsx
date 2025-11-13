import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  source: string;
}

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetchMentalHealthNews();
  }, []);

  const fetchMentalHealthNews = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'mental-health-india', limit: 1 }
      });
      
      if (error) throw error;
      if (data?.news && data.news.length > 0) setNews(data.news[0]);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (!news) return null;

  return (
    <div className="bg-primary/5 border-b border-primary/10 py-1.5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            <Newspaper className="w-3 h-3" />
            Mental Health News
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scroll_30s_linear_infinite] whitespace-nowrap">
              <span className="text-xs font-medium text-foreground">
                {news.title} - {news.source}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
