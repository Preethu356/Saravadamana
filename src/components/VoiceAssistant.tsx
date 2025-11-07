import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AudioRecorder, encodeAudioForAPI, AudioQueue } from "@/utils/audioUtils";

const VoiceAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    recorderRef.current?.stop();
    wsRef.current?.close();
    audioQueueRef.current?.clear();
    audioContextRef.current?.close();
    setIsConnected(false);
    setIsSpeaking(false);
  };

  const startConversation = async () => {
    try {
      setIsLoading(true);
      
      // Request microphone access
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize audio context and queue
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      audioQueueRef.current = new AudioQueue(audioContextRef.current);

      // Connect to WebSocket edge function
      const wsUrl = `wss://qzjobikvftpfwhyazlsx.supabase.co/functions/v1/realtime-voice`;
      console.log("Connecting to:", wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsLoading(false);
        
        toast({
          title: "Connected",
          description: "Voice assistant is ready",
        });

        // Start recording
        recorderRef.current = new AudioRecorder((audioData) => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            const encoded = encodeAudioForAPI(audioData);
            wsRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encoded
            }));
          }
        });
        
        recorderRef.current.start().catch((error) => {
          console.error("Failed to start recorder:", error);
          toast({
            title: "Microphone Error",
            description: "Failed to access microphone",
            variant: "destructive",
          });
        });
      };

      wsRef.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Received:", data.type);

        if (data.type === 'response.audio.delta' && data.delta) {
          setIsSpeaking(true);
          const binaryString = atob(data.delta);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          await audioQueueRef.current?.addToQueue(bytes);
        } else if (data.type === 'response.audio.done') {
          setIsSpeaking(false);
        } else if (data.type === 'error') {
          console.error("Server error:", data.error);
          toast({
            title: "Error",
            description: data.error,
            variant: "destructive",
          });
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
