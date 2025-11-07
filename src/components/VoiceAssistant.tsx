import { useConversation } from "@11labs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ELEVEN_AGENT_ID = "agent_5701k32zrnt1fym841gajcnfsc8r"; // Provided by user

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
      toast({ title: "Voice error", description: "Failed to connect", variant: "destructive" });
    },
  });

  const startConversation = async () => {
    try {
      setIsLoading(true);
      // Ask for mic upfront (recommended by ElevenLabs)
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start session using your Agent ID (no signed URL needed for public agents)
      // Types may lag behind; cast to avoid type friction across versions
      await (conversation.startSession as any)({ agentId: ELEVEN_AGENT_ID });
    } catch (error) {
      console.error("Error starting ElevenLabs session:", error);
      toast({ title: "Microphone/Connection error", description: error instanceof Error ? error.message : "Failed to start", variant: "destructive" });
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
