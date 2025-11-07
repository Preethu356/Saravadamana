import { useConversation } from "@11labs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
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
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">ElevenLabs Voice Assistant</h3>
        <p className="text-sm text-muted-foreground">
          {isConnected ? "Listening..." : "Click to start voice conversation"}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {!isConnected ? (
          <Button onClick={startConversation} disabled={isLoading} size="lg" className="gap-2">
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
          <Button onClick={endConversation} variant="destructive" size="lg" className="gap-2">
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
