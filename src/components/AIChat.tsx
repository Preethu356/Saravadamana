import { Card } from "@/components/ui/card";
import { Sparkles, MessageCircle, Shield, Heart } from "lucide-react";
import meditationImg from "@/assets/meditation.png";
import ChatInterface from "./ChatInterface";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AIChat = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <section id="ai-chat" className="py-20 px-4 bg-background min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {!showChat ? (
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

              <Button 
                onClick={() => setShowChat(true)}
                variant="hero"
                size="lg"
                className="w-full md:w-auto"
              >
                <MessageCircle className="w-5 h-5" />
                Start Chatting Now
              </Button>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <div className="text-lg font-bold text-primary mb-1">Private</div>
                  <div className="text-sm text-muted-foreground">Fully confidential</div>
                </div>
                <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                  <Heart className="w-8 h-8 text-secondary mb-2" />
                  <div className="text-lg font-bold text-secondary mb-1">Caring</div>
                  <div className="text-sm text-muted-foreground">Always empathetic</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Support Chat
                </span>
              </h2>
              <p className="text-muted-foreground">Your safe space to share and receive support</p>
            </div>
            <ChatInterface />
            <div className="text-center">
              <Button 
                onClick={() => setShowChat(false)}
                variant="ghost"
              >
                ← Back to Overview
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIChat;
