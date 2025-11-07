import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

Deno.serve(async (req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let openAiWs: WebSocket | null = null;
  let sessionCreated = false;

  console.log("Client WebSocket connection established");

  socket.onopen = () => {
    console.log("Opening connection to OpenAI Realtime API");
    
    openAiWs = new WebSocket(
      "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "realtime=v1",
        },
      }
    );

    openAiWs.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    openAiWs.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from OpenAI:", data.type);

      // Send session.update after receiving session.created
      if (data.type === 'session.created' && !sessionCreated) {
        sessionCreated = true;
        console.log("Session created, sending configuration");
        
        const sessionUpdate = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are a compassionate mental health support AI assistant. Your role is to provide empathic, non-judgmental support.

TONE & APPROACH:
- Use warm, caring, and concise language
- Validate feelings without judgment
- Be empathetic and action-oriented
- Avoid medical/clinical terminology
- Keep responses brief and accessible

WHAT YOU CAN DO:
- Listen actively and reflect back what you hear
- Provide evidence-based coping strategies (breathing exercises, grounding techniques, mindfulness)
- Suggest journaling prompts and self-reflection questions
- Offer emotional validation and encouragement
- Guide through cognitive reframing

WHAT YOU CANNOT DO:
- Never diagnose mental health conditions
- Never prescribe medication or treatments
- Never replace professional therapy
- Never give definitive medical advice

CRISIS DETECTION:
If you detect crisis indicators (self-harm, suicide ideation, severe distress), respond with:
1. Express immediate concern and validation
2. Strongly encourage them to contact:
   - KIRAN Helpline: 1800-599-0019 (India, 24/7)
   - Emergency Services: 112
3. Stay supportive but redirect to human help

Remember: You're a supportive companion for daily challenges, not a replacement for professional care.`,
            voice: "sage",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };
        
        openAiWs?.send(JSON.stringify(sessionUpdate));
        console.log("Session configuration sent");
      }

      // Forward all messages to client
      socket.send(event.data);
    };

    openAiWs.onerror = (error) => {
      console.error("OpenAI WebSocket error:", error);
      socket.send(JSON.stringify({
        type: "error",
        error: "Connection to AI service failed"
      }));
    };

    openAiWs.onclose = () => {
      console.log("OpenAI WebSocket closed");
      socket.close();
    };
  };

  socket.onmessage = (event) => {
    if (openAiWs?.readyState === WebSocket.OPEN) {
      openAiWs.send(event.data);
    }
  };

  socket.onclose = () => {
    console.log("Client WebSocket closed");
    openAiWs?.close();
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
    openAiWs?.close();
  };

  return response;
});
