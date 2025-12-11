import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wellnessData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Based on this user's weekly wellness data, provide personalized insights and recommendations:

Data:
- Current streak: ${wellnessData.currentStreak} days
- Total sessions: ${wellnessData.totalSessions}
- Mood entries logged: ${wellnessData.moodEntries}
- Meditation minutes: ${wellnessData.meditationMinutes}
- Screenings completed: ${wellnessData.screeningCount}
- Average sleep: ${wellnessData.avgSleepHours ? wellnessData.avgSleepHours.toFixed(1) + ' hours' : 'Not tracked'}
- Average exercise: ${wellnessData.avgExerciseMinutes ? Math.round(wellnessData.avgExerciseMinutes) + ' minutes' : 'Not tracked'}
- Diet quality: ${wellnessData.avgDietQuality ? wellnessData.avgDietQuality + '/10' : 'Not tracked'}

Provide encouraging, actionable insights focused on mental wellness improvement.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a supportive mental wellness coach. Provide brief, encouraging, and actionable insights. Keep responses warm and motivating.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_wellness_insights",
              description: "Provide structured wellness insights and recommendations",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "A brief encouraging summary of their wellness journey (1-2 sentences)",
                  },
                  highlights: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 positive highlights or achievements from their data",
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "3 specific, actionable recommendations for improvement",
                  },
                  focusArea: {
                    type: "string",
                    description: "One key area to focus on this week (single word or short phrase)",
                  },
                },
                required: ["summary", "highlights", "recommendations", "focusArea"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_wellness_insights" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call response from AI");
    }

    const insights = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating wellness insights:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
