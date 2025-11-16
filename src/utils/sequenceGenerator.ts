import { interventionsLibrary, Intervention } from "@/data/interventions";

export interface SequenceInput {
  phq9Score?: number;
  gad7Score?: number;
  who5Score?: number;
  userPreferences?: string[];
}

export interface GeneratedSequence {
  title: string;
  description: string;
  steps: Intervention[];
}

export const generatePersonalizedSequence = (input: SequenceInput): GeneratedSequence => {
  const { phq9Score = 0, gad7Score = 0, who5Score = 0 } = input;
  const selectedInterventions: Intervention[] = [];

  // Rule 1: High anxiety (GAD-7 >= 8) → Start with breathing
  if (gad7Score >= 8) {
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "deep_breathing_basic")!
    );
  }

  // Rule 2: Moderate anxiety or depression (GAD-7 or PHQ-9 >= 5) → Add psychoeducation
  if (gad7Score >= 5) {
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "anxiety_psychoeducation")!
    );
  }
  
  if (phq9Score >= 5) {
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "depression_psychoeducation")!
    );
  }

  // Rule 3: Always include grounding technique
  selectedInterventions.push(
    interventionsLibrary.find(i => i.key === "grounding_5_4_3_2_1")!
  );

  // Rule 4: Add exercise based on severity
  if (phq9Score >= 10 || gad7Score >= 10) {
    // Severe - add progressive muscle relaxation
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "progressive_muscle_relaxation")!
    );
  } else {
    // Mild to moderate - add gentle body scan
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "gentle_body_scan")!
    );
  }

  // Rule 5: Add positive thinking exercises
  selectedInterventions.push(
    interventionsLibrary.find(i => i.key === "positive_affirmations")!
  );

  // Rule 6: Always include journaling
  if (phq9Score >= 5 || gad7Score >= 5) {
    selectedInterventions.push(
      interventionsLibrary.find(i => i.key === "gratitude_reflection")!
    );
  }

  // Rule 7: Add evening reflection for follow-up
  selectedInterventions.push(
    interventionsLibrary.find(i => i.key === "evening_reflection")!
  );

  // Rule 8: Low wellbeing (WHO-5 < 13) → Add mindful walking
  if (who5Score < 13 && who5Score > 0) {
    selectedInterventions.splice(3, 0,
      interventionsLibrary.find(i => i.key === "mindful_walking")!
    );
  }

  // Remove duplicates and undefined values
  const uniqueInterventions = Array.from(
    new Map(selectedInterventions.filter(Boolean).map(item => [item.key, item])).values()
  );

  // Generate title based on scores
  let title = "Your Personalized Mind Sequence";
  let description = "A customized sequence designed specifically for your mental wellness journey.";

  if (gad7Score >= 10 && phq9Score >= 10) {
    title = "Comprehensive Wellness Sequence";
    description = "An intensive sequence focusing on anxiety relief, mood enhancement, and grounding techniques.";
  } else if (gad7Score >= 10) {
    title = "Anxiety Relief Sequence";
    description = "A targeted sequence to help manage anxiety and restore calm.";
  } else if (phq9Score >= 10) {
    title = "Mood Enhancement Sequence";
    description = "A supportive sequence designed to lift your mood and build resilience.";
  } else if (gad7Score >= 5 || phq9Score >= 5) {
    title = "Balanced Wellness Sequence";
    description = "A gentle sequence to support your mental wellbeing and inner peace.";
  } else {
    title = "Preventive Wellness Sequence";
    description = "A proactive sequence to maintain and strengthen your mental health.";
  }

  return {
    title,
    description,
    steps: uniqueInterventions
  };
};
