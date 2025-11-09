import { useConversation } from "@11labs/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Brain, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VoiceAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log("ElevenLabs voice connected");
      toast({ title: "Connected", description: "Voice assistant is ready" });
    },
    onDisconnect: () => {
      console.log("ElevenLabs voice disconnected");
    },
    onMessage: (message) => {
      console.log("ElevenLabs message:", message);
    },
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      const errorMessage = typeof error === 'string' ? error : (error as any)?.message || "Connection failed";
      toast({ 
        title: "Voice Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    },
  });

  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Step 1: Request microphone permission first
      console.log("Requesting microphone access...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone access granted");
        // Stop the test stream immediately
        stream.getTracks().forEach(track => track.stop());
      } catch (micError) {
        console.error("Microphone access denied:", micError);
        throw new Error("Microphone access denied. Please allow microphone access and try again.");
      }

      // Step 2: Get signed URL from our edge function
      console.log("Getting signed URL from ElevenLabs...");
      const { data, error } = await supabase.functions.invoke('elevenlabs-voice');
      
      if (error) {
        console.error("Edge function error:", error);
        throw new Error("Failed to connect to voice service");
      }

      if (!data?.signed_url) {
        console.error("No signed URL in response:", data);
        throw new Error("Invalid response from voice service");
      }

      console.log("Got signed URL, starting session...");
      
      // Step 3: Start session with signed URL
      await (conversation.startSession as any)({ 
        signedUrl: data.signed_url 
      });
      
      console.log("Session started successfully");
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({ 
        title: "Connection Failed", 
        description: error instanceof Error ? error.message : "Failed to start voice chat", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (e) {
      console.warn("endSession warning:", e);
    }
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 p-8 bg-gradient-to-br from-card via-card/95 to-primary/5 rounded-2xl border-2 border-primary/20 shadow-xl relative overflow-hidden"
    >
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-4 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              className="absolute -inset-2"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Waves className="w-20 h-20 text-accent/60" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          Talk to Your Mind
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {isConnected ? "I'm listening..." : "Click to start voice conversation"}
        </motion.p>
      </div>

      <motion.div 
        className="flex items-center gap-4 relative z-10"
        whileHover={{ scale: 1.02 }}
      >
        {!isConnected ? (
          <Button 
            onClick={startConversation} 
            disabled={isLoading} 
            size="lg" 
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                Start Voice Chat
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={endConversation} 
            variant="destructive" 
            size="lg" 
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <MicOff className="h-5 w-5" />
            End Conversation
          </Button>
        )}
      </motion.div>

      {isConnected && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-sm relative z-10"
        >
          <motion.div 
            className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-500' : 'bg-muted'}`}
            animate={isSpeaking ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <span className="font-medium">{isSpeaking ? "AI is speaking" : "Ready to listen"}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VoiceAssistant;
