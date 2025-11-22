import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "./useAnalytics";
import { toast } from "sonner";

export const useTrackPlan = () => {
  const { trackEvent, userProfileId, consent } = useAnalytics();

  const trackPlanGeneration = async (planId: string, lengthDays: number) => {
    if (!consent?.analytics || !userProfileId) return;

    await trackEvent({
      event_type: "generate_plan",
      event_props: {
        plan_id: planId,
        length_days: lengthDays,
      },
    });
  };

  const trackAudioPlay = async (planId: string, stepNo: number, interventionKey: string, audioProvider: string) => {
    if (!consent?.analytics || !userProfileId) return;

    await trackEvent({
      event_type: "play_audio",
      event_props: {
        plan_id: planId,
        step_no: stepNo,
        intervention_key: interventionKey,
        audio_provider: audioProvider,
      },
    });
  };

  const trackStepCompletion = async (planId: string, stepNo: number, stepId: string) => {
    if (!consent?.analytics || !userProfileId) return;

    try {
      // Update step completion
      await supabase
        .from("sequence_steps")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", stepId);

      // Track interaction
      await trackEvent({
        event_type: "step_completed",
        event_props: {
          plan_id: planId,
          step_no: stepNo,
        },
      });

      toast.success("Step completed!");
    } catch (error) {
      console.error("Failed to track step completion:", error);
    }
  };

  const saveAudioMetadata = async (interventionId: string, audioUrl: string, provider: string, durationSec?: number) => {
    if (!consent?.analytics) return;

    try {
      await supabase
        .from("audio_metadata")
        .insert({
          intervention_id: interventionId,
          audio_url: audioUrl,
          provider,
          duration_sec: durationSec,
        });
    } catch (error) {
      console.error("Failed to save audio metadata:", error);
    }
  };

  return {
    trackPlanGeneration,
    trackAudioPlay,
    trackStepCompletion,
    saveAudioMetadata,
  };
};
