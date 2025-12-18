import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Lightbulb, Tag, RefreshCw, Archive, ArrowRight, 
  Brain, Sparkles, CheckCircle, MessageSquare, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageNavigation from "@/components/PageNavigation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ThoughtModule = () => {
  const [currentThought, setCurrentThought] = useState("");
  const [thoughtLabel, setThoughtLabel] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [reframeSuggestion, setReframeSuggestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeMode, setActiveMode] = useState<"label" | "reframe" | "park" | null>(null);
  const [parkedThoughts, setParkedThoughts] = useState<string[]>([]);
  const { toast } = useToast();

  const thoughtLabels = [
    { name: "Worry", color: "bg-amber-500/20 text-amber-600 border-amber-500/30" },
    { name: "Rumination", color: "bg-purple-500/20 text-purple-600 border-purple-500/30" },
    { name: "Self-Criticism", color: "bg-red-500/20 text-red-600 border-red-500/30" },
    { name: "Catastrophizing", color: "bg-orange-500/20 text-orange-600 border-orange-500/30" },
    { name: "Positive", color: "bg-green-500/20 text-green-600 border-green-500/30" },
    { name: "Neutral", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
    { name: "Planning", color: "bg-cyan-500/20 text-cyan-600 border-cyan-500/30" },
    { name: "Reflection", color: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30" }
  ];

  const handleLabelThought = (label: string) => {
    setThoughtLabel(label);
    toast({
      title: "Thought Labeled",
      description: `Your thought has been labeled as "${label}".`,
    });
  };

  const handleReframeThought = async () => {
    if (!currentThought.trim()) {
      toast({ title: "Please enter a thought first", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setActiveMode("reframe");

    try {
      const { data, error } = await supabase.functions.invoke('mental-health-chat', {
        body: {
          messages: [{
            role: "user",
            content: `As a CBT therapist, provide a brief AI reflection and a reframed version of this thought. Format your response as:

REFLECTION: [1-2 sentences acknowledging the thought]

REFRAME: [A healthier, more balanced way to view this thought]

The thought is: "${currentThought}"`
          }]
        }
      });

      if (error) throw error;

      const reader = data.body?.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const jsonStr = line.slice(6);
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content || "";
              fullResponse += content;
            } catch {}
          }
        }
      }

      const reflectionMatch = fullResponse.match(/REFLECTION:\s*(.+?)(?=REFRAME:|$)/s);
      const reframeMatch = fullResponse.match(/REFRAME:\s*(.+)/s);

      setAiReflection(reflectionMatch?.[1]?.trim() || "I hear you. This thought pattern is common.");
      setReframeSuggestion(reframeMatch?.[1]?.trim() || fullResponse);

    } catch (error) {
      console.error("Error reframing thought:", error);
      setAiReflection("I acknowledge this thought and its impact on you.");
      setReframeSuggestion("Consider: What evidence supports or contradicts this thought? Is there a more balanced way to view this situation?");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParkThought = () => {
    if (!currentThought.trim()) {
      toast({ title: "Please enter a thought first", variant: "destructive" });
      return;
    }
    setParkedThoughts(prev => [...prev, currentThought]);
    setCurrentThought("");
    setActiveMode("park");
    toast({
      title: "Thought Parked",
      description: "Your thought has been safely stored in the worry container.",
    });
  };

  const removeParkedThought = (index: number) => {
    setParkedThoughts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-500/5 to-background">
      <PageNavigation />
      
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Lightbulb className="w-4 h-4 mr-2" />
              Mind Physics™ Engine
            </Badge>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Thought Module
            </h1>
            <p className="text-xl text-muted-foreground">
              Thoughts = Signals • Information Control
            </p>
          </motion.div>

          {/* Main Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  What's on your mind?
                </CardTitle>
                <CardDescription>
                  Write down the thought you want to work with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your thought here..."
                  value={currentThought}
                  onChange={(e) => setCurrentThought(e.target.value)}
                  className="min-h-[120px] text-lg"
                />
                {thoughtLabel && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current label:</span>
                    <Badge className={thoughtLabels.find(l => l.name === thoughtLabel)?.color}>
                      {thoughtLabel}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mb-6"
          >
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'label' ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setActiveMode(activeMode === 'label' ? null : 'label')}
            >
              <CardContent className="p-6 text-center">
                <Tag className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Label a Thought</h3>
                <p className="text-sm text-muted-foreground">Categorize your thought pattern</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'reframe' ? 'ring-2 ring-purple-500' : ''}`}
              onClick={handleReframeThought}
            >
              <CardContent className="p-6 text-center">
                <RefreshCw className={`w-10 h-10 text-purple-500 mx-auto mb-3 ${isProcessing ? 'animate-spin' : ''}`} />
                <h3 className="font-bold mb-1">Reframe a Thought</h3>
                <p className="text-sm text-muted-foreground">Get CBT-based perspective</p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${activeMode === 'park' ? 'ring-2 ring-green-500' : ''}`}
              onClick={handleParkThought}
            >
              <CardContent className="p-6 text-center">
                <Archive className="w-10 h-10 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold mb-1">Park a Thought</h3>
                <p className="text-sm text-muted-foreground">Save to worry container</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Label Selection Panel */}
          <AnimatePresence>
            {activeMode === 'label' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="mb-6 border-blue-500/30">
                  <CardHeader>
                    <CardTitle>Choose a Label</CardTitle>
                    <CardDescription>How would you categorize this thought?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {thoughtLabels.map((label) => (
                        <Badge
                          key={label.name}
                          className={`cursor-pointer text-sm py-2 px-4 transition-all hover:scale-105 ${label.color} ${thoughtLabel === label.name ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => handleLabelThought(label.name)}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Reflection & Reframe */}
          <AnimatePresence>
            {(aiReflection || reframeSuggestion) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="mb-6 border-purple-500/30 bg-purple-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI Reflection & Reframe
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiReflection && (
                      <div className="p-4 bg-background/50 rounded-lg border">
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">REFLECTION</h4>
                        <p>{aiReflection}</p>
                      </div>
                    )}
                    {reframeSuggestion && (
                      <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
                        <h4 className="font-medium text-sm text-purple-500 mb-2">REFRAME SUGGESTION</h4>
                        <p className="text-lg">{reframeSuggestion}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Worry Container */}
          {parkedThoughts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="mb-6 border-green-500/30 bg-green-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5 text-green-500" />
                    Worry Container ({parkedThoughts.length})
                  </CardTitle>
                  <CardDescription>
                    Thoughts you've set aside for later
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {parkedThoughts.map((thought, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border">
                        <p className="text-sm flex-1">{thought}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParkedThought(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Next Step */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <Link to="/emotion-module">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600">
                Regulate Emotion
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Continue to the Emotion Module
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ThoughtModule;