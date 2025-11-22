import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLocalStorage } from "./useLocalStorage";
import { toast } from "sonner";

interface ConsentPreferences {
  analytics: boolean;
  research: boolean;
  data_sharing: boolean;
}

interface TrackEventParams {
  event_type: string;
  event_props?: Record<string, any>;
}

export const useAnalytics = () => {
  const [consent, setConsent] = useLocalStorage<ConsentPreferences | null>("analytics_consent", null);
  const [userProfileId, setUserProfileId] = useState<string | null>(null);

  // Initialize user profile on mount
  useEffect(() => {
    const initializeProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();

        if (profile) {
          setUserProfileId(profile.id);
        } else {
          // Create profile
          const { data: newProfile, error } = await supabase
            .from("user_profiles")
            .insert({
              auth_user_id: user.id,
              display_name: user.email?.split("@")[0] || "User",
              preferred_language: navigator.language,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            .select()
            .single();

          if (!error && newProfile) {
            setUserProfileId(newProfile.id);
          }
        }
      }
    };

    if (consent?.analytics) {
      initializeProfile();
    }
  }, [consent]);

  const saveConsent = async (preferences: ConsentPreferences) => {
    setConsent(preferences);
    
    if (preferences.analytics) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && userProfileId) {
        // Save consent log
        await supabase
          .from("consent_logs")
          .insert({
            user_profile_id: userProfileId,
            analytics: preferences.analytics,
            research: preferences.research,
            data_sharing: preferences.data_sharing,
          });
      }
    }
  };

  const trackEvent = async ({ event_type, event_props }: TrackEventParams) => {
    if (!consent?.analytics || !userProfileId) return;

    try {
      // POST /rest/v1/interactions
      await supabase
        .from("interactions")
        .insert({
          user_profile_id: userProfileId,
          event_type,
          event_props,
        });
    } catch (error) {
      console.error("Failed to track event:", error);
    }
  };

  const trackAssessment = async (tool: string, score: number, raw: any) => {
    if (!consent?.analytics || !userProfileId) return;

    try {
      // POST /rest/v1/assessments
      await supabase
        .from("assessments")
        .insert({
          user_profile_id: userProfileId,
          tool,
          score,
          raw,
        });

      // Also track as interaction
      await trackEvent({
        event_type: "assessment_taken",
        event_props: { tool, score },
      });

      toast.success("Assessment saved");
    } catch (error) {
      console.error("Failed to track assessment:", error);
    }
  };

  const trackLifestyleLog = async (logData: {
    log_date: string;
    sleep_hours?: number;
    exercise_minutes?: number;
    diet_quality?: number;
    water_intake_ml?: number;
  }) => {
    if (!consent?.analytics || !userProfileId) return;

    try {
      // POST /rest/v1/lifestyle_logs
      await supabase
        .from("lifestyle_logs")
        .insert({
          user_profile_id: userProfileId,
          ...logData,
        });

      toast.success("Lifestyle log saved");
    } catch (error) {
      console.error("Failed to track lifestyle log:", error);
    }
  };

  const trackSafetyFlag = async (message: string, meta?: Record<string, any>) => {
    if (!userProfileId) return;

    try {
      // POST /rest/v1/safety_flags - ALWAYS track safety events regardless of consent
      await supabase
        .from("safety_flags")
        .insert({
          user_profile_id: userProfileId,
          source: "self_report",
          severity: "high",
          message,
          meta,
        });
    } catch (error) {
      console.error("Failed to track safety flag:", error);
    }
  };

  return {
    consent,
    saveConsent,
    trackEvent,
    trackAssessment,
    trackLifestyleLog,
    trackSafetyFlag,
    hasConsent: consent !== null,
    userProfileId,
  };
};
