import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Day-wise mental health themes
const dayThemes: Record<string, string> = {
  'Sunday': 'rest, renewal, and spiritual well-being',
  'Monday': 'fresh starts, motivation, and overcoming Monday anxiety',
  'Tuesday': 'building momentum, productivity, and mental clarity',
  'Wednesday': 'midweek resilience, balance, and perseverance',
  'Thursday': 'gratitude, reflection, and positive thinking',
  'Friday': 'achievement celebration, stress release, and self-reward',
  'Saturday': 'self-care, joy, and mental health recovery'
};

// Special dates for mental health awareness
const specialDates: Record<string, string> = {
  '01-01': 'New Year mental health resolutions and fresh beginnings',
  '01-26': 'Republic Day - mental strength and national pride',
  '02-14': 'self-love and emotional connections',
  '03-08': 'women mental health empowerment',
  '04-07': 'World Health Day - holistic wellness',
  '05-01': 'work-life balance and occupational wellness',
  '06-21': 'International Yoga Day - mind-body connection',
  '08-15': 'Independence Day - freedom from mental struggles',
  '09-10': 'World Suicide Prevention Day - hope and help',
  '10-02': 'Gandhi Jayanti - inner peace and non-violence to self',
  '10-10': 'World Mental Health Day - awareness and acceptance',
  '11-14': 'Children Day - childhood mental wellness',
  '12-25': 'Christmas - joy, kindness, and emotional warmth'
};

// Input validation schema
const requestSchema = z.object({
  type: z.enum(['quote-of-the-day', 'top-headlines', 'mental-health-india', 'research-updates']),
  limit: z.number().int().min(1).max(50).default(10),
  date: z.string().optional()
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
    
    const { type, limit, date } = parseResult.data;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'quote-of-the-day') {
      // Get current date info for day-specific quotes
      const today = date ? new Date(date) : new Date();
      const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      
      // Check for special date theme
      const specialTheme = specialDates[monthDay];
      const dayTheme = dayThemes[dayName] || 'mental wellness and self-care';
      const theme = specialTheme || dayTheme;
      
      systemPrompt = `You are a mental health quote curator. Today is ${dayName}. Return only a JSON object with one inspiring quote relevant to the theme.`;
      userPrompt = `Today is ${dayName}, day ${dayOfYear} of the year. 
Theme for today: ${theme}.
Generate ONE powerful, meaningful quote specifically about ${theme}. 
The quote should be from a real notable figure (psychologist, philosopher, author, wellness expert, spiritual leader).
Return as JSON: {"quote": "...", "author": "...", "theme": "${theme}"}
Make it deeply relevant to mental health and today's theme.`;
    } else if (type === 'top-headlines') {
      systemPrompt = 'You are a news aggregator. Return only a JSON array of news items.';
      userPrompt = `Generate ${limit} current top world news headlines. Return as JSON array with format: [{"title": "...", "source": "..."}]`;
    } else if (type === 'mental-health-india') {
      systemPrompt = 'You are a mental health news aggregator for India. Return only a JSON array of news items.';
      userPrompt = `Generate ${limit} recent mental health news, events, and programs from India. Include government initiatives, awareness campaigns, workshops, and community programs. Return as JSON array with format: [{"title": "...", "description": "...", "date": "...", "location": "...", "category": "...", "source": "..."}]. Use realistic Indian locations and dates from the past week.`;
    } else if (type === 'research-updates') {
      systemPrompt = 'You are a scientific research aggregator focusing on neuroscience and psychology. Return only a JSON array of research items.';
      userPrompt = `Generate ${limit} recent breakthrough research findings in brain science, neuroscience, psychology, and mental health technology from reputable international journals. Return as JSON array with format: [{"title": "...", "abstract": "...", "journal": "...", "date": "...", "topic": "...", "url": "https://example.com", "impact": "high/medium"}]. Include diverse topics like neuroplasticity, brain imaging, AI in mental health, therapeutic interventions, etc.`;
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
    if (type === 'quote-of-the-day') {
      result = { quote: parsedContent };
    } else if (type === 'top-headlines') {
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
