import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  try {
    // Get signed URL from ElevenLabs
    const signedUrlResponse = await fetch(
      "https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=agent_5701k32zrnt1fym841gajcnfsc8r",
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text();
      console.error("ElevenLabs API error:", signedUrlResponse.status, errorText);
      return new Response("Failed to get signed URL", { status: 500 });
    }

    const { signed_url } = await signedUrlResponse.json();
    console.log("Got signed URL from ElevenLabs");

    // Upgrade to WebSocket
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    // Connect to ElevenLabs WebSocket
    let elevenLabsSocket: WebSocket | null = null;

    socket.onopen = () => {
      console.log("Client WebSocket connected");
      
      // Connect to ElevenLabs using signed URL
      elevenLabsSocket = new WebSocket(signed_url);

      elevenLabsSocket.onopen = () => {
        console.log("Connected to ElevenLabs");
        socket.send(JSON.stringify({ type: "connected" }));
      };

      elevenLabsSocket.onmessage = (event) => {
        // Forward all messages from ElevenLabs to client
        socket.send(event.data);
      };

      elevenLabsSocket.onerror = (error) => {
        console.error("ElevenLabs WebSocket error:", error);
        socket.send(JSON.stringify({
          type: "error",
          error: "Connection to ElevenLabs failed"
        }));
      };

      elevenLabsSocket.onclose = () => {
        console.log("ElevenLabs WebSocket closed");
        socket.close();
      };
    };

    socket.onmessage = (event) => {
      // Forward all messages from client to ElevenLabs
      if (elevenLabsSocket?.readyState === WebSocket.OPEN) {
        elevenLabsSocket.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log("Client WebSocket closed");
      elevenLabsSocket?.close();
    };

    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error);
      elevenLabsSocket?.close();
    };

    return response;
  } catch (error) {
    console.error("Error in elevenlabs-voice:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
