export interface Intervention {
  key: string;
  title: string;
  type: "breathing" | "education" | "exercise" | "journal" | "grounding" | "affirmation";
  content: string;
  audio_script: string;
  duration_minutes: number;
}

export const interventionsLibrary: Intervention[] = [
  {
    key: "deep_breathing_basic",
    title: "Deep Breathing Exercise",
    type: "breathing",
    content: "Let's practice deep breathing to calm your nervous system. Breathe in slowly through your nose for 4 counts, hold for 4, then exhale through your mouth for 6 counts. Repeat 5 times.",
    audio_script: "Welcome. Let's begin with a simple breathing exercise. Find a comfortable position. Breathe in slowly through your nose... one, two, three, four. Hold your breath... one, two, three, four. Now exhale gently through your mouth... one, two, three, four, five, six. Excellent. Let's continue this pattern together.",
    duration_minutes: 3
  },
  {
    key: "anxiety_psychoeducation",
    title: "Understanding Anxiety",
    type: "education",
    content: "Anxiety is your body's natural response to stress. It's designed to protect you, but sometimes it can feel overwhelming. Understanding that anxiety is temporary and manageable is the first step toward feeling better.",
    audio_script: "Let's talk about anxiety. Anxiety is actually your body trying to protect you. When you feel anxious, your body is activating its alarm system. This is completely normal and very common. The good news is that anxiety is temporary, and there are many ways to manage it effectively. You're already taking an important step by being here.",
    duration_minutes: 2
  },
  {
    key: "grounding_5_4_3_2_1",
    title: "5-4-3-2-1 Grounding Technique",
    type: "grounding",
    content: "This technique helps bring you back to the present moment. Notice 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    audio_script: "Let's practice a grounding exercise called 5-4-3-2-1. Look around you and name 5 things you can see. Now, notice 4 things you can physically touch. Listen carefully for 3 things you can hear. Identify 2 things you can smell, or would like to smell. Finally, notice 1 thing you can taste. Take a deep breath. You're right here, right now, and you're safe.",
    duration_minutes: 4
  },
  {
    key: "gentle_body_scan",
    title: "Gentle Body Scan",
    type: "exercise",
    content: "Close your eyes and slowly bring awareness to each part of your body, from your toes to the top of your head. Notice any tension and consciously relax those areas.",
    audio_script: "Let's do a gentle body scan. Close your eyes if that feels comfortable. Start by noticing your toes. Wiggle them gently. Move your awareness to your feet, your ankles, your calves. Notice your knees, your thighs. Feel your hips and lower back. Bring attention to your stomach, your chest, breathing naturally. Notice your shoulders, let them drop. Feel your arms, your hands. Finally, relax your neck, your jaw, your face. Take a deep breath. You've just given yourself a gift of relaxation.",
    duration_minutes: 5
  },
  {
    key: "gratitude_reflection",
    title: "Gratitude Reflection",
    type: "journal",
    content: "Take a moment to write down three things you're grateful for today. They can be big or small - a warm cup of tea, a kind word from a friend, or simply the ability to rest.",
    audio_script: "Let's practice gratitude together. Think of three things you're grateful for today. They don't need to be big things. Maybe it's the warmth of the sun, a comfortable place to sit, or a moment of peace. Take your time to really feel the gratitude in your heart. Gratitude has the power to shift our perspective and bring light into our day.",
    duration_minutes: 3
  },
  {
    key: "depression_psychoeducation",
    title: "Understanding Depression",
    type: "education",
    content: "Depression is more than just feeling sad - it's a medical condition that affects your thoughts, feelings, and daily activities. It's important to know that depression is treatable, and seeking help is a sign of strength, not weakness.",
    audio_script: "Let's understand depression together. Depression is a real medical condition, not a choice or a weakness. It affects how you think, feel, and handle daily activities. Many people experience depression, and the most important thing to know is that it's treatable. You deserve support, and reaching out for help is one of the bravest things you can do.",
    duration_minutes: 3
  },
  {
    key: "progressive_muscle_relaxation",
    title: "Progressive Muscle Relaxation",
    type: "exercise",
    content: "Systematically tense and then relax different muscle groups in your body. Start with your feet, then move up through your legs, torso, arms, and face.",
    audio_script: "Let's practice progressive muscle relaxation. Start by tensing your feet. Squeeze them tight for five seconds. Now release and feel the relaxation. Move to your calves. Tense them... and release. Continue with your thighs, tense... and release. Feel the wave of relaxation moving through your body. Continue this pattern up through your stomach, chest, arms, and finally your face. Notice how different your body feels when you consciously release tension.",
    duration_minutes: 6
  },
  {
    key: "positive_affirmations",
    title: "Positive Affirmations",
    type: "affirmation",
    content: "Repeat these affirmations: 'I am worthy of love and respect. I am doing my best, and that is enough. I have the strength to face my challenges. I am growing and healing every day.'",
    audio_script: "Let's practice positive affirmations together. Repeat after me, either out loud or in your mind. I am worthy of love and respect. I am doing my best, and that is enough. I have the strength to face my challenges. I am growing and healing every day. These aren't just words - they're truths about you. Believe in them.",
    duration_minutes: 2
  },
  {
    key: "mindful_walking",
    title: "Mindful Walking",
    type: "exercise",
    content: "Take a short walk, paying attention to each step. Notice how your feet feel as they touch the ground, the rhythm of your movement, and the sensations in your body.",
    audio_script: "Let's practice mindful walking. As you walk, notice each step. Feel your heel touch the ground, then your toes. Notice the rhythm of your movement. Feel the air on your skin. Listen to the sounds around you. Walking meditation brings you fully into the present moment and connects you with your body in a gentle way.",
    duration_minutes: 5
  },
  {
    key: "evening_reflection",
    title: "Evening Reflection",
    type: "journal",
    content: "Before bed, reflect on your day. What went well? What challenged you? What did you learn? Write down one small thing you can do tomorrow to take care of yourself.",
    audio_script: "Let's do an evening reflection together. Think about your day. What went well, even if it was something small? What challenged you today? Remember, challenges are opportunities for growth. What did you learn about yourself? Finally, think of one small, kind thing you can do for yourself tomorrow. You deserve care and compassion, especially from yourself.",
    duration_minutes: 4
  }
];
