import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  goals: z.array(z.string().trim().min(1).max(200)).min(1).max(10),
  availableTime: z.number().int().min(5).max(480),
  stressLevel: z.number().int().min(1).max(10),
  preferences: z.string().trim().max(1000).default(''),
  // New risk-based fields
  riskScore: z.number().int().min(0).max(100).optional(),
  riskLevel: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
  riskFactors: z.array(z.string()).optional(),
  protectiveFactors: z.array(z.string()).optional(),
  screeningResults: z.object({
    phq9: z.number().optional(),
    gad7: z.number().optional(),
    who5: z.number().optional(),
    personality: z.string().optional()
  }).optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request', 
          details: parseResult.error.errors.map(e => e.message) 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { goals, availableTime, stressLevel, preferences, riskScore, riskLevel, riskFactors, protectiveFactors, screeningResults } = parseResult.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a clinical mental health wellness expert. Generate personalized, evidence-based wellness plans that are practical and tailored to the user's mental health risk profile. Consider screening results when making recommendations. Prioritize interventions based on risk level - higher risk requires more intensive support recommendations.`;

    let riskContext = '';
    if (riskScore !== undefined || riskLevel) {
      riskContext = `
MENTAL HEALTH RISK PROFILE:
- Overall Risk Score: ${riskScore ?? 'Not available'}/100
- Risk Level: ${riskLevel?.toUpperCase() ?? 'Not assessed'}
- Risk Factors: ${riskFactors?.join(', ') || 'None identified'}
- Protective Factors: ${protectiveFactors?.join(', ') || 'None identified'}

SCREENING RESULTS:
- PHQ-9 (Depression): ${screeningResults?.phq9 ?? 'Not completed'}
- GAD-7 (Anxiety): ${screeningResults?.gad7 ?? 'Not completed'}
- WHO-5 (Well-being): ${screeningResults?.who5 ?? 'Not completed'}
- Personality Type: ${screeningResults?.personality ?? 'Not assessed'}

Based on this risk profile, tailor the wellness plan to address the specific risk factors while building on protective factors. ${riskLevel === 'critical' || riskLevel === 'high' ? 'IMPORTANT: Include recommendations for professional support and crisis resources.' : ''}
`;
    }

    const userPrompt = `Create a personalized mental health wellness plan with the following details:

${riskContext}
Goals: ${goals.join(', ')}
Available time per day: ${availableTime} minutes
Current stress level: ${stressLevel}/10
Preferences: ${preferences}

Please generate a comprehensive wellness plan that includes:
1. A motivating title and description that acknowledges their current state
2. Daily routine with specific activities and time allocations tailored to their risk level
3. Weekly schedule with variety and progression
4. Practical tips for success based on their specific challenges
5. ${riskLevel === 'critical' || riskLevel === 'high' ? 'Professional support recommendations and crisis resources' : 'Self-help strategies and preventive measures'}

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
  "tips": ["string"],
  "professional_support": ["string"] (only if high/critical risk)
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
                  },
                  professional_support: {
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
    console.log("AI response received");
    
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
