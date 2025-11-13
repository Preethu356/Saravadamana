import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  source: string;
}

const NewsTicker = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchTopNews();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (news.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [news.length]);

  const fetchTopNews = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { type: 'top-headlines', limit: 5 }
      });
      
      if (error) throw error;
      if (data?.news) setNews(data.news);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  if (news.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-y border-primary/20 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full font-semibold text-sm whitespace-nowrap">
            <Newspaper className="w-4 h-4" />
            Top News
          </div>
          <div className="flex-1 overflow-hidden">
            <div 
              className="transition-all duration-1000 ease-in-out"
              style={{ 
                transform: `translateY(-${currentIndex * 100}%)`,
              }}
            >
              {news.map((item, index) => (
                <div 
                  key={index}
                  className="h-8 flex items-center text-sm font-medium text-foreground"
                >
                  <span className="truncate">{item.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">- {item.source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
