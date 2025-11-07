import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const agentId = "agent_5701k32zrnt1fym841gajcnfsc8r";
    
    if (!ELEVENLABS_API_KEY) {
      console.error("ELEVENLABS_API_KEY not set");
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    console.log("Requesting signed URL for agent:", agentId);
    
    // Get signed URL from ElevenLabs
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
        },
      }
    );

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text();
      console.error("ElevenLabs API error:", signedUrlResponse.status, errorText);
      throw new Error(`ElevenLabs API error: ${signedUrlResponse.status}`);
    }

    const data = await signedUrlResponse.json();
    console.log("Successfully got signed URL");
    
    return new Response(
      JSON.stringify({ signed_url: data.signed_url }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in elevenlabs-voice:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }), 
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
