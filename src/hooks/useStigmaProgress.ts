import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StigmaToolProgress {
  id: string;
  tool_name: string;
  completed: boolean;
  completion_date: string | null;
  score: number | null;
  responses: any;
}

export interface AchievementBadge {
  id: string;
  badge_type: string;
  badge_name: string;
  earned_at: string;
  metadata: any;
}

export const useStigmaProgress = () => {
  const [progress, setProgress] = useState<StigmaToolProgress[]>([]);
  const [badges, setBadges] = useState<AchievementBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
    fetchBadges();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("stigma_tool_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProgress(data || []);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("achievement_badges")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const saveProgress = async (
    toolName: string,
    responses: any,
    score?: number
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to save progress");
        return;
      }

      const { error } = await supabase.from("stigma_tool_progress").insert({
        user_id: user.id,
        tool_name: toolName,
        completed: true,
        completion_date: new Date().toISOString(),
        score: score || null,
        responses: responses,
      });

      if (error) throw error;

      toast.success("Progress saved successfully!");
      await fetchProgress();
      await checkForBadges(toolName);
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save progress");
    }
  };

  const checkForBadges = async (completedTool: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check for "First Tool" badge
      if (progress.length === 0) {
        await awardBadge("first_tool", "First Steps", {
          description: "Completed your first stigma-free tool",
          tool: completedTool,
        });
      }

      // Check for "Tool Explorer" badge (3 different tools)
      const uniqueTools = new Set(progress.map((p) => p.tool_name));
      if (uniqueTools.size === 2) {
        await awardBadge("tool_explorer", "Tool Explorer", {
          description: "Completed 3 different stigma-free tools",
        });
      }

      // Check for "Stigma Fighter" badge (all 5 tools)
      if (uniqueTools.size === 4) {
        await awardBadge("stigma_fighter", "Stigma Fighter", {
          description: "Completed all stigma-free tools",
        });
      }

      // Check for "Compassion Champion" badge (completed Compassion Builder with high score)
      if (completedTool === "compassion-builder") {
        const compassionProgress = progress.filter(
          (p) => p.tool_name === "compassion-builder"
        );
        if (compassionProgress.length >= 3) {
          await awardBadge("compassion_champion", "Compassion Champion", {
            description: "Completed Compassion Builder multiple times",
          });
        }
      }
    } catch (error) {
      console.error("Error checking badges:", error);
    }
  };

  const awardBadge = async (
    badgeType: string,
    badgeName: string,
    metadata: any
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if badge already exists
      const existingBadge = badges.find((b) => b.badge_type === badgeType);
      if (existingBadge) return;

      const { error } = await supabase.from("achievement_badges").insert({
        user_id: user.id,
        badge_type: badgeType,
        badge_name: badgeName,
        metadata: metadata,
      });

      if (error) throw error;

      toast.success(`🎉 Badge Earned: ${badgeName}!`);
      await fetchBadges();
    } catch (error) {
      console.error("Error awarding badge:", error);
    }
  };

  const getToolProgress = (toolName: string) => {
    return progress.filter((p) => p.tool_name === toolName);
  };

  return {
    progress,
    badges,
    loading,
    saveProgress,
    getToolProgress,
    refreshProgress: fetchProgress,
    refreshBadges: fetchBadges,
  };
};
