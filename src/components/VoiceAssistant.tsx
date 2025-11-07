import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VoiceAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    wsRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    audioContextRef.current?.close();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });
      mediaStreamRef.current = stream;

      // Initialize audio context for playback
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      // Connect to ElevenLabs through our edge function
      const wsUrl = `wss://qzjobikvftpfwhyazlsx.supabase.co/functions/v1/elevenlabs-voice`;
      console.log("Connecting to ElevenLabs via:", wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected to ElevenLabs");
        setIsConnected(true);
        setIsLoading(false);
        
        toast({
          title: "Connected",
          description: "Voice assistant is ready to talk",
        });

        // Set up audio streaming from microphone
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            // Send audio to ElevenLabs
            wsRef.current.send(JSON.stringify({
              type: "audio",
              audio: Array.from(inputData)
            }));
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received from ElevenLabs:", data.type);

          if (data.type === "connected") {
            console.log("ElevenLabs connection confirmed");
          } else if (data.type === "audio") {
            // Play audio from ElevenLabs
            setIsSpeaking(true);
            // Handle audio playback here
          } else if (data.type === "audio_end") {
            setIsSpeaking(false);
          } else if (data.type === "error") {
            console.error("ElevenLabs error:", data.error);
            toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice service",
          variant: "destructive",
        });
        cleanup();
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        cleanup();
      };
      
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start conversation",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const endConversation = () => {
    cleanup();
    toast({
      title: "Disconnected",
      description: "Voice conversation ended",
    });
  };

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
