import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, ChevronRight, Loader2, Volume2, VolumeX, Music } from "lucide-react";
import { toast } from "sonner";

interface SequenceStep {
  id: string;
  step_order: number;
  title: string;
  type: string;
  content: string;
  audio_script: string;
  duration_minutes: number;
  completed: boolean;
  completed_at: string | null;
}

interface Sequence {
  id: string;
  title: string;
  description: string;
  total_steps: number;
  completed_steps: number;
}

const MindSequencingPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bgMusicRef = useRef<HTMLAudioElement>(null);
  const [isBgMusicPlaying, setIsBgMusicPlaying] = useState(false);

  useEffect(() => {
    fetchSequence();
    // Auto-play background music at low volume
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.15;
      bgMusicRef.current.play().catch(() => {
        // Autoplay prevented
      });
      setIsBgMusicPlaying(true);
    }
  }, [id]);

  useEffect(() => {
    // Find first incomplete step
    const firstIncomplete = steps.findIndex(s => !s.completed);
    if (firstIncomplete !== -1) {
      setCurrentStepIndex(firstIncomplete);
    }
  }, [steps]);

  const fetchSequence = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: seqData, error: seqError } = await supabase
        .from("sequences")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (seqError) throw seqError;
      setSequence(seqData);

      const { data: stepsData, error: stepsError } = await supabase
        .from("sequence_steps")
        .select("*")
        .eq("sequence_id", id)
        .order("step_order", { ascending: true });

      if (stepsError) throw stepsError;
      setSteps(stepsData || []);
    } catch (error: any) {
      console.error("Error fetching sequence:", error);
      toast.error("Failed to load sequence");
      navigate("/mind-sequencing");
    } finally {
      setLoading(false);
    }
  };

  const toggleBgMusic = () => {
    if (bgMusicRef.current) {
      if (isBgMusicPlaying) {
        bgMusicRef.current.pause();
      } else {
        bgMusicRef.current.play();
      }
      setIsBgMusicPlaying(!isBgMusicPlaying);
    }
  };

  const playStepAudio = async () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    try {
      setAudioLoading(true);
      
      const { data, error } = await supabase.functions.invoke("elevenlabs-voice", {
        body: {
          text: currentStep.audio_script,
          voice: "Sarah"
        }
      });

      if (error) throw error;

      // This would need actual ElevenLabs integration
      toast.info("Audio playback would start here with ElevenLabs integration");
      setIsPlayingAudio(true);
      
    } catch (error: any) {
      console.error("Error playing audio:", error);
      toast.error("Audio playback is not configured yet");
    } finally {
      setAudioLoading(false);
    }
  };

  const markStepComplete = async () => {
    const currentStep = steps[currentStepIndex];
    if (!currentStep || currentStep.completed) return;

    try {
      const { error: stepError } = await supabase
        .from("sequence_steps")
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("id", currentStep.id);

      if (stepError) throw stepError;

      const newCompletedSteps = (sequence?.completed_steps || 0) + 1;
      const { error: seqError } = await supabase
        .from("sequences")
        .update({
          completed_steps: newCompletedSteps
        })
        .eq("id", id);

      if (seqError) throw seqError;

      // Update local state
      const updatedSteps = [...steps];
      updatedSteps[currentStepIndex] = { ...currentStep, completed: true };
      setSteps(updatedSteps);

      if (sequence) {
        setSequence({ ...sequence, completed_steps: newCompletedSteps });
      }

      toast.success("Step completed!");

      // Move to next step
      if (currentStepIndex < steps.length - 1) {
        setTimeout(() => setCurrentStepIndex(currentStepIndex + 1), 500);
      } else {
        toast.success("Congratulations! You've completed your sequence!");
        setTimeout(() => navigate("/mind-sequencing"), 2000);
      }
    } catch (error: any) {
      console.error("Error marking step complete:", error);
      toast.error("Failed to mark step as complete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sequence || steps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Sequence not found</p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];
  const progressPercentage = (sequence.completed_steps / sequence.total_steps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 py-12 px-4">
      {/* Background Music */}
      <audio ref={bgMusicRef} loop>
        <source src="/mind-sequencing-bg.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Music Control */}
      <Button
        onClick={toggleBgMusic}
        size="icon"
        variant="outline"
        className="fixed top-20 right-6 z-50 w-12 h-12 rounded-full shadow-lg"
        aria-label={isBgMusicPlaying ? "Pause music" : "Play music"}
      >
        {isBgMusicPlaying ? (
          <Music className="w-5 h-5 text-primary" />
        ) : (
          <VolumeX className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{sequence.title}</h1>
          <p className="text-muted-foreground">{sequence.description}</p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span className="font-medium">
                {sequence.completed_steps} / {sequence.total_steps} steps
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Step {currentStep.step_order}: {currentStep.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {currentStep.type.charAt(0).toUpperCase() + currentStep.type.slice(1)} • {currentStep.duration_minutes} minutes
                </CardDescription>
              </div>
              {currentStep.completed && (
                <Check className="w-8 h-8 text-green-500" />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground leading-relaxed">{currentStep.content}</p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={playStepAudio}
                disabled={audioLoading}
                variant="outline"
                className="gap-2"
              >
                {audioLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                Play Audio Guide
              </Button>

              <Button
                onClick={markStepComplete}
                disabled={currentStep.completed}
                className="gap-2 flex-1"
              >
                {currentStep.completed ? (
                  <>
                    <Check className="w-4 h-4" />
                    Completed
                  </>
                ) : (
                  <>
                    Mark Complete
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Steps Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Your Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentStepIndex
                      ? "bg-primary/10 border-2 border-primary/30"
                      : step.completed
                      ? "bg-green-500/10"
                      : "bg-secondary/30"
                  }`}
                  onClick={() => setCurrentStepIndex(index)}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground"
                  }`}>
                    {step.completed ? <Check className="w-4 h-4" /> : step.step_order}
                  </div>
                  <span className={`flex-1 ${index === currentStepIndex ? "font-semibold" : ""}`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {step.duration_minutes}min
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          onClick={() => navigate("/mind-sequencing")}
          className="w-full"
        >
          Back to Sequences
        </Button>
      </div>
    </div>
  );
};

export default MindSequencingPlay;
