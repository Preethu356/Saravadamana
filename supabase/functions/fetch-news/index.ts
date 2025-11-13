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
    const { type, limit = 10 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'top-headlines') {
      systemPrompt = 'You are a news aggregator. Return only a JSON array of news items.';
      userPrompt = `Generate ${limit} current top world news headlines. Return as JSON array with format: [{"title": "...", "source": "..."}]`;
    } else if (type === 'mental-health-india') {
      systemPrompt = 'You are a mental health news aggregator for India. Return only a JSON array of news items.';
      userPrompt = `Generate ${limit} recent mental health news, events, and programs from India. Include government initiatives, awareness campaigns, workshops, and community programs. Return as JSON array with format: [{"title": "...", "description": "...", "date": "...", "location": "...", "category": "...", "source": "..."}]. Use realistic Indian locations and dates from the past week.`;
    } else if (type === 'research-updates') {
      systemPrompt = 'You are a scientific research aggregator focusing on neuroscience and psychology. Return only a JSON array of research items.';
      userPrompt = `Generate ${limit} recent breakthrough research findings in brain science, neuroscience, psychology, and mental health technology from reputable international journals. Return as JSON array with format: [{"title": "...", "abstract": "...", "journal": "...", "date": "...", "topic": "...", "url": "https://example.com", "impact": "high/medium"}]. Include diverse topics like neuroplasticity, brain imaging, AI in mental health, therapeutic interventions, etc.`;
    } else {
      throw new Error('Invalid news type');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Strip markdown code blocks if present
    content = content.trim();
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid AI response format');
    }

    // Handle different response structures
    let result;
    if (type === 'top-headlines') {
      result = { news: parsedContent.news || parsedContent };
    } else if (type === 'mental-health-india') {
      result = { news: parsedContent.news || parsedContent };
    } else if (type === 'research-updates') {
      result = { research: parsedContent.research || parsedContent };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
