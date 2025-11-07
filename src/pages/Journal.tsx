import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const Journal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");

  const moods = [
    { emoji: "❤️", label: "Great" },
    { emoji: "😊", label: "Good" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Down" },
    { emoji: "😢", label: "Struggling" }
  ];

  const handleSave = () => {
    if (!entry.trim()) {
      toast({
        variant: "destructive",
        title: "Entry is empty",
        description: "Please write something before saving.",
      });
      return;
    }

    toast({
      title: "Journal entry saved!",
      description: "Your thoughts have been recorded securely.",
    });
    
    setEntry("");
    setMood("");
  };

  const prompts = [
    "What am I grateful for today?",
    "What's been on my mind lately?",
    "What small win can I celebrate?",
    "How did I take care of myself today?",
    "What would I tell a friend in my situation?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Digital
            </span>{" "}
            Journal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A safe, private space for your thoughts and feelings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 border-2">
            <CardHeader>
              <CardTitle>Today's Entry</CardTitle>
              <CardDescription>Express yourself freely. Your entries are private and secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>How are you feeling?</Label>
                <div className="flex gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setMood(m.label)}
                      className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                        mood === m.label
                          ? "border-primary bg-primary/10 scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="journal-entry">Your Thoughts</Label>
                <Textarea
                  id="journal-entry"
                  placeholder="Start writing... there's no right or wrong way to journal."
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {entry.length} characters
                </div>
              </div>

              <Button onClick={handleSave} className="w-full gap-2">
                <Save className="h-4 w-4" />
                Save Entry
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Writing Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setEntry(entry + "\n" + prompt + "\n")}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted transition-all text-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">💡 Journaling Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Write without judgment</li>
                  <li>• Focus on feelings, not just events</li>
                  <li>• Be honest with yourself</li>
                  <li>• There's no minimum or maximum</li>
                  <li>• Make it a daily habit</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Journal;
