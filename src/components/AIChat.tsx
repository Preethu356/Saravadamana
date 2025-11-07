import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import meditationImg from "@/assets/meditation.png";

const AIChat = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img 
              src={meditationImg} 
              alt="Meditation and mindfulness illustration" 
              className="relative rounded-3xl shadow-card w-full"
            />
          </div>

          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Support</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Always Here to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Listen</span>
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our AI companion provides empathetic, judgment-free support 24/7. Share your thoughts, feelings, and concerns in a safe, confidential environment.
            </p>

            <Card className="p-6 shadow-card bg-card border-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 bg-muted/50 rounded-2xl rounded-tl-none p-4">
                    <p className="text-sm">
                      Hello! I'm here to support you. How are you feeling today? Feel free to share what's on your mind.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message here..." 
                    className="flex-1 border-2 focus:border-primary"
                  />
                  <Button size="icon" variant="hero">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="text-2xl font-bold text-primary mb-1">Private</div>
                <div className="text-sm text-muted-foreground">Your conversations are confidential</div>
              </div>
              <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                <div className="text-2xl font-bold text-secondary mb-1">Caring</div>
                <div className="text-sm text-muted-foreground">Empathetic & non-judgmental</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChat;
