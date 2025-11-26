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
    const { latitude, longitude } = await req.json();
    console.log(`Fetching climate data for lat: ${latitude}, lon: ${longitude}`);
    
    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!OPENWEATHER_API_KEY) {
      console.error("OpenWeather API key not configured");
      throw new Error("OpenWeather API key not configured");
    }
    
    console.log("API key found, fetching weather data...");

    // Fetch current weather data and air pollution from OpenWeather API
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const airPollutionResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
    );

    const uvResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/uvi?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
    );

    if (!weatherResponse.ok || !airPollutionResponse.ok || !uvResponse.ok) {
      console.error(`API Response errors - Weather: ${weatherResponse.status}, Air: ${airPollutionResponse.status}, UV: ${uvResponse.status}`);
      throw new Error("Failed to fetch climate data from OpenWeather API");
    }
    
    console.log("Successfully fetched all weather data");

    const weatherData = await weatherResponse.json();
    const airData = await airPollutionResponse.json();
    const uvData = await uvResponse.json();

    const climateData = {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: weatherData.wind.speed,
      weatherCondition: weatherData.weather[0].main,
      aqi: airData.list[0].main.aqi,
      pm25: airData.list[0].components.pm2_5,
      uvIndex: uvData.value,
    };

    // Generate AI insights using Lovable AI
    let aiInsights = "";
    if (LOVABLE_API_KEY) {
      const insightsPrompt = `Based on the following environmental data, provide 2-3 brief mental health and wellbeing tips (each tip max 15 words):
- Temperature: ${climateData.temperature}°C
- Humidity: ${climateData.humidity}%
- Air Quality Index: ${climateData.aqi}
- PM2.5: ${climateData.pm25}
- UV Index: ${climateData.uvIndex}

Focus on actionable advice for mental health, sleep, mood, or wellbeing.`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a mental health advisor providing concise environmental health tips." },
            { role: "user", content: insightsPrompt }
          ],
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        aiInsights = aiData.choices[0].message.content;
        console.log("AI insights generated successfully");
      } else {
        console.error(`AI response failed with status: ${aiResponse.status}`);
      }
    }

    return new Response(
      JSON.stringify({ ...climateData, aiInsights }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching climate data:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch climate data";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});