import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goals, availableTime, stressLevel, preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a mental health wellness expert. Generate personalized wellness plans that are practical, evidence-based, and tailored to the user's needs. Always include specific activities with time estimates.`;

    const userPrompt = `Create a personalized mental health wellness plan with the following details:

Goals: ${goals.join(', ')}
Available time per day: ${availableTime} minutes
Current stress level: ${stressLevel}/10
Preferences: ${preferences}

Please generate a comprehensive wellness plan that includes:
1. A motivating title and description
2. Daily routine with specific activities and time allocations
3. Weekly schedule with variety and progression
4. Practical tips for success

Format the response as JSON with this structure:
{
  "title": "string",
  "description": "string",
  "daily_routine": [
    {
      "time": "string (e.g., 'Morning', 'Afternoon', 'Evening')",
      "activity": "string",
      "duration": "number (minutes)",
      "description": "string"
    }
  ],
  "weekly_schedule": [
    {
      "day": "string",
      "focus": "string",
      "activities": ["string"]
    }
  ],
  "tips": ["string"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_wellness_plan",
              description: "Generate a structured wellness plan",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  daily_routine: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        time: { type: "string" },
                        activity: { type: "string" },
                        duration: { type: "number" },
                        description: { type: "string" }
                      },
                      required: ["time", "activity", "duration", "description"]
                    }
                  },
                  weekly_schedule: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        day: { type: "string" },
                        focus: { type: "string" },
                        activities: { 
                          type: "array",
                          items: { type: "string" }
                        }
                      },
                      required: ["day", "focus", "activities"]
                    }
                  },
                  tips: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["title", "description", "daily_routine", "weekly_schedule", "tips"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "create_wellness_plan" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in response");
    }

    const wellnessPlan = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(wellnessPlan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
