import { useConversation } from "@11labs/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VoiceAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log("Voice assistant connected");
      toast({
        title: "Connected",
        description: "Voice assistant is ready to help you",
      });
    },
    onDisconnect: () => {
      console.log("Voice assistant disconnected");
    },
    onMessage: (message) => {
      console.log("Message received:", message);
    },
    onError: (error) => {
      console.error("Voice assistant error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to voice assistant",
        variant: "destructive",
      });
    },
  });

  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get signed URL from edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-session');
      
      if (error) throw error;
      
      if (!data?.signed_url) {
        throw new Error("Failed to get signed URL");
      }

      // Start conversation with signed URL
      await conversation.startSession({ url: data.signed_url });
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
  };

  const isConnected = conversation.status === "connected";
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">AI Voice Assistant</h3>
        <p className="text-sm text-muted-foreground">
          {isConnected ? "Listening..." : "Click to start voice conversation"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {!isConnected ? (
          <Button
            onClick={startConversation}
            disabled={isLoading}
            size="lg"
            className="gap-2"
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
            className="gap-2"
          >
            <MicOff className="h-5 w-5" />
            End Conversation
          </Button>
        )}
      </div>

      {isConnected && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span>{isSpeaking ? "AI is speaking" : "Ready to listen"}</span>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
