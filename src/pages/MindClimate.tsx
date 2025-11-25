import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Sun, AlertTriangle, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageNavigation from "@/components/PageNavigation";

interface ClimateData {
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  weatherCondition: string;
  aqi: number;
  pm25: number;
  uvIndex: number;
  aiInsights: string;
}

export default function MindClimate() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to get your location. Using default location.");
          // Default to a sample location
          setLocation({ lat: 40.7128, lon: -74.0060 });
        }
      );
    } else {
      // Default to a sample location
      setLocation({ lat: 40.7128, lon: -74.0060 });
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    const fetchClimateData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke("fetch-climate-data", {
          body: {
            latitude: location.lat,
            longitude: location.lon,
          },
        });

        if (error) throw error;

        setClimateData(data);

        // Save snapshot to database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("environment_snapshots").insert({
            user_id: user.id,
            temperature: data.temperature,
            humidity: data.humidity,
            pressure: data.pressure,
            wind_speed: data.windSpeed,
            uv_index: data.uvIndex,
            aqi: data.aqi,
            pm25: data.pm25,
            weather_condition: data.weatherCondition,
            ai_insights: data.aiInsights,
          });
        }
      } catch (error) {
        console.error("Error fetching climate data:", error);
        toast.error("Failed to fetch climate data");
      } finally {
        setLoading(false);
      }
    };

    fetchClimateData();
  }, [location]);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 1) return "bg-green-500";
    if (aqi <= 2) return "bg-yellow-500";
    if (aqi <= 3) return "bg-orange-500";
    if (aqi <= 4) return "bg-red-500";
    return "bg-purple-500";
  };

  const getAQILabel = (aqi: number) => {
    if (aqi <= 1) return "Good";
    if (aqi <= 2) return "Fair";
    if (aqi <= 3) return "Moderate";
    if (aqi <= 4) return "Poor";
    return "Very Poor";
  };

  const getUVLabel = (uv: number) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading climate data...</p>
      </div>
    );
  }

  if (!climateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No climate data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Mind Climate</h1>
          <p className="text-muted-foreground">
            Environmental factors influencing your mental health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-primary" />
                Temperature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {climateData.temperature.toFixed(1)}°C
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {climateData.weatherCondition}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {climateData.humidity}%
              </p>
              {climateData.humidity > 70 && (
                <p className="text-sm text-amber-500 mt-2">
                  High humidity may affect sleep quality
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-primary" />
                Wind Speed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {climateData.windSpeed.toFixed(1)} m/s
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Pressure: {climateData.pressure} hPa
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                UV Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {climateData.uvIndex.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {getUVLabel(climateData.uvIndex)}
              </p>
              {climateData.uvIndex > 7 && (
                <p className="text-sm text-amber-500 mt-2">
                  High UV may affect circadian rhythm and mood
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Air Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${getAQIColor(climateData.aqi)}`} />
                <p className="text-3xl font-bold text-foreground">
                  {getAQILabel(climateData.aqi)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                PM2.5: {climateData.pm25.toFixed(1)} μg/m³
              </p>
              {climateData.aqi > 3 && (
                <p className="text-sm text-amber-500 mt-2">
                  Consider indoor activities and breathing exercises
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Risk Indicator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {climateData.aqi > 3 || climateData.uvIndex > 7 || climateData.humidity > 70
                  ? "Moderate"
                  : "Low"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Mental health impact level
              </p>
            </CardContent>
          </Card>
        </div>

        {climateData.aiInsights && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Personalized recommendations based on current conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-line">{climateData.aiInsights}</p>
            </CardContent>
          </Card>
        )}
      </div>
      <PageNavigation />
    </div>
  );
}