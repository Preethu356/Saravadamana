import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NeuralTrend {
  date: string;
  vulnerabilityScore: number;
  riskLevel: string;
}

export const useNeuralTrends = () => {
  const [trends, setTrends] = useState<NeuralTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from("neural_fingerprinting")
          .select("created_at, vulnerability_score, risk_level")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .limit(10);

        if (error) throw error;

        const formattedTrends = data.map((item) => ({
          date: new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          vulnerabilityScore: item.vulnerability_score,
          riskLevel: item.risk_level,
        }));

        setTrends(formattedTrends);
      } catch (error) {
        console.error("Error fetching neural trends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return { trends, loading };
};