import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Loader2, Trash2, User } from "lucide-react";
import { format } from "date-fns";

interface Feedback {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeedbacks();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id ?? null);
    });
  }, []);

  const fetchFeedbacks = async () => {
    const { data } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setFeedbacks(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({ title: "Please log in to leave feedback", variant: "destructive" });
      setIsLoading(false);
      return;
    }

    const userName = session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Anonymous";

    const { error } = await supabase.from("feedbacks").insert({
      user_id: session.user.id,
      user_name: userName,
      message: message.trim(),
    });

    if (error) {
      toast({ title: "Failed to submit feedback", variant: "destructive" });
    } else {
      setMessage("");
      fetchFeedbacks();
      toast({ title: "Feedback submitted!" });
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("feedbacks").delete().eq("id", id);
    if (!error) {
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      toast({ title: "Feedback deleted" });
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-bold">Community Feedback</h3>
        </div>

        {/* Submit form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            placeholder="Share your thoughts, feedback, or experience..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-3 min-h-[80px]"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{message.length}/500</span>
            <Button type="submit" disabled={isLoading || !message.trim()} size="sm">
              {isLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Send className="w-4 h-4 mr-1" />}
              Submit
            </Button>
          </div>
        </form>

        {/* Feedback list */}
        <div className="space-y-3">
          {feedbacks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No feedback yet. Be the first to share!</p>
          )}
          {feedbacks.map((fb) => (
            <Card key={fb.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{fb.user_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(fb.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </div>
                  {currentUserId === fb.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(fb.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <p className="text-sm text-foreground pl-10">{fb.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
