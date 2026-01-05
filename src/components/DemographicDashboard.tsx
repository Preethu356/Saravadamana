import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Moon,
  Dumbbell,
  Apple,
  Droplets,
  Brain,
  Heart,
  Activity,
  ChevronRight,
  Sparkles,
  Scale,
  Ruler,
  Calendar,
  MapPin,
  Mail,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Users,
  Smile,
  Edit,
  Save,
  X
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  user_type: string | null;
  mental_state: string | null;
  onboarding_completed: boolean | null;
  weight_kg: number | null;
  height_cm: number | null;
  age: number | null;
  sex: string | null;
  address: string | null;
  job: string | null;
  good_habits: string[] | null;
  bad_habits: string[] | null;
  loneliness_score: number | null;
  happiness_score: number | null;
}

interface LifestyleLog {
  log_date: string;
  sleep_hours: number | null;
  exercise_minutes: number | null;
  diet_quality: number | null;
  water_intake_ml: number | null;
}

interface ScreeningResult {
  screening_type: string;
  score: number;
  max_score: number;
  severity: string | null;
  completed_at: string;
}

interface CorrelationInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  recommendation: string;
}

const DemographicDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileData>>({});
  const [lifestyleLogs, setLifestyleLogs] = useState<LifestyleLog[]>([]);
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [insights, setInsights] = useState<CorrelationInsight[]>([]);
  const [goodHabitInput, setGoodHabitInput] = useState("");
  const [badHabitInput, setBadHabitInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        calculateProfileCompletion(profileData);
      }

      // Fetch lifestyle logs (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      let fetchedLogs: LifestyleLog[] = [];
      let fetchedScreenings: ScreeningResult[] = [];

      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (userProfile) {
        const { data: logsData } = await supabase
          .from("lifestyle_logs")
          .select("*")
          .eq("user_profile_id", userProfile.id)
          .gte("log_date", thirtyDaysAgo.toISOString().split('T')[0])
          .order("log_date", { ascending: true });

        if (logsData) {
          setLifestyleLogs(logsData);
          fetchedLogs = logsData;
        }
      }

      // Fetch screening results
      const { data: screeningsData } = await supabase
        .from("screening_results")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (screeningsData) {
        setScreeningResults(screeningsData);
        fetchedScreenings = screeningsData;
      }

      // Generate insights after data is fetched
      generateCorrelationInsights(fetchedLogs, fetchedScreenings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (data: ProfileData) => {
    const fields = [
      data.full_name,
      data.email,
      data.user_type,
      data.mental_state,
      data.onboarding_completed,
      data.weight_kg,
      data.height_cm,
      data.age,
      data.sex,
      data.address,
      data.job,
      data.good_habits?.length,
      data.bad_habits?.length,
      data.loneliness_score,
      data.happiness_score
    ];
    const completed = fields.filter(f => f !== null && f !== undefined && f !== '' && f !== 0).length;
    setProfileCompletion(Math.round((completed / fields.length) * 100));
  };

  const calculateBMI = (weight: number | null, height: number | null): string => {
    if (!weight || !height) return "N/A";
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const getBMICategory = (bmi: string): { label: string; color: string } => {
    const bmiNum = parseFloat(bmi);
    if (isNaN(bmiNum)) return { label: "Unknown", color: "text-muted-foreground" };
    if (bmiNum < 18.5) return { label: "Underweight", color: "text-yellow-500" };
    if (bmiNum < 25) return { label: "Normal", color: "text-green-500" };
    if (bmiNum < 30) return { label: "Overweight", color: "text-orange-500" };
    return { label: "Obese", color: "text-red-500" };
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update(editedProfile)
        .eq("user_id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...editedProfile } : null);
      calculateProfileCompletion({ ...profile, ...editedProfile } as ProfileData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addGoodHabit = () => {
    if (!goodHabitInput.trim()) return;
    const currentHabits = editedProfile.good_habits || profile?.good_habits || [];
    setEditedProfile(prev => ({
      ...prev,
      good_habits: [...currentHabits, goodHabitInput.trim()]
    }));
    setGoodHabitInput("");
  };

  const addBadHabit = () => {
    if (!badHabitInput.trim()) return;
    const currentHabits = editedProfile.bad_habits || profile?.bad_habits || [];
    setEditedProfile(prev => ({
      ...prev,
      bad_habits: [...currentHabits, badHabitInput.trim()]
    }));
    setBadHabitInput("");
  };

  const removeGoodHabit = (index: number) => {
    const currentHabits = editedProfile.good_habits || profile?.good_habits || [];
    setEditedProfile(prev => ({
      ...prev,
      good_habits: currentHabits.filter((_, i) => i !== index)
    }));
  };

  const removeBadHabit = (index: number) => {
    const currentHabits = editedProfile.bad_habits || profile?.bad_habits || [];
    setEditedProfile(prev => ({
      ...prev,
      bad_habits: currentHabits.filter((_, i) => i !== index)
    }));
  };

  const startEditing = () => {
    setEditedProfile({
      weight_kg: profile?.weight_kg,
      height_cm: profile?.height_cm,
      age: profile?.age,
      sex: profile?.sex,
      address: profile?.address,
      job: profile?.job,
      good_habits: profile?.good_habits || [],
      bad_habits: profile?.bad_habits || [],
      loneliness_score: profile?.loneliness_score,
      happiness_score: profile?.happiness_score
    });
    setIsEditing(true);
  };

  const generateCorrelationInsights = (logs: LifestyleLog[], screenings: ScreeningResult[]) => {
    const newInsights: CorrelationInsight[] = [];

    if (logs.length === 0) {
      newInsights.push({
        type: 'neutral',
        title: 'Start Tracking Your Lifestyle',
        description: 'Log your daily sleep, exercise, and diet to unlock personalized insights.',
        recommendation: 'Begin logging today to see how your habits affect your mental wellness.'
      });
      setInsights(newInsights);
      return;
    }

    // Calculate averages
    const avgSleep = logs.reduce((sum, l) => sum + (l.sleep_hours || 0), 0) / logs.length;
    const avgExercise = logs.reduce((sum, l) => sum + (l.exercise_minutes || 0), 0) / logs.length;
    const avgDiet = logs.reduce((sum, l) => sum + (l.diet_quality || 0), 0) / logs.length;
    const avgWater = logs.reduce((sum, l) => sum + (l.water_intake_ml || 0), 0) / logs.length;

    // Get latest mental health scores
    const latestPHQ9 = screenings.find(s => s.screening_type === 'PHQ-9');
    const latestGAD7 = screenings.find(s => s.screening_type === 'GAD-7');

    // Sleep insights
    if (avgSleep < 6) {
      newInsights.push({
        type: 'negative',
        title: 'Sleep Deficit Detected',
        description: `Your average sleep of ${avgSleep.toFixed(1)} hours is below the recommended 7-9 hours. This may be impacting your mental clarity and mood.`,
        recommendation: 'Try establishing a consistent bedtime routine and aim for at least 7 hours of sleep.'
      });
    } else if (avgSleep >= 7) {
      newInsights.push({
        type: 'positive',
        title: 'Healthy Sleep Pattern',
        description: `Great job! You're averaging ${avgSleep.toFixed(1)} hours of sleep, which supports mental wellness.`,
        recommendation: 'Keep maintaining this healthy sleep schedule for optimal mental health.'
      });
    }

    // Exercise insights
    if (avgExercise < 20) {
      newInsights.push({
        type: 'negative',
        title: 'Low Physical Activity',
        description: `Your average of ${avgExercise.toFixed(0)} minutes of exercise daily is below recommendations. Regular exercise can reduce anxiety and depression symptoms.`,
        recommendation: 'Start with 15-minute walks and gradually increase to 30+ minutes daily.'
      });
    } else if (avgExercise >= 30) {
      newInsights.push({
        type: 'positive',
        title: 'Active Lifestyle',
        description: `You're averaging ${avgExercise.toFixed(0)} minutes of daily exercise. This significantly benefits your mental health!`,
        recommendation: 'Continue your active routine and consider adding variety for sustained motivation.'
      });
    }

    // Combined correlation insights
    if (latestPHQ9 && avgSleep < 6) {
      const depressionScore = (latestPHQ9.score / latestPHQ9.max_score) * 100;
      if (depressionScore > 40) {
        newInsights.push({
          type: 'negative',
          title: 'Sleep-Mood Connection',
          description: 'Your depression screening shows elevated scores, which may be linked to insufficient sleep patterns.',
          recommendation: 'Prioritize sleep as it directly impacts mood regulation and emotional resilience.'
        });
      }
    }

    if (latestGAD7 && avgExercise < 20) {
      const anxietyScore = (latestGAD7.score / latestGAD7.max_score) * 100;
      if (anxietyScore > 40) {
        newInsights.push({
          type: 'negative',
          title: 'Exercise-Anxiety Connection',
          description: 'Your anxiety levels appear elevated. Regular physical activity can help reduce stress hormones.',
          recommendation: 'Even light exercise like walking or yoga can significantly reduce anxiety symptoms.'
        });
      }
    }

    // Diet quality insight
    if (avgDiet < 3) {
      newInsights.push({
        type: 'negative',
        title: 'Nutrition Needs Attention',
        description: 'Your diet quality rating suggests room for improvement. Nutrition significantly impacts brain health and mood.',
        recommendation: 'Focus on whole foods, increase vegetable intake, and reduce processed foods.'
      });
    } else if (avgDiet >= 4) {
      newInsights.push({
        type: 'positive',
        title: 'Good Nutritional Habits',
        description: 'Your diet quality is supporting your mental wellness. Nutrition plays a key role in brain function.',
        recommendation: 'Maintain these healthy eating habits for continued mental clarity.'
      });
    }

    setInsights(newInsights);
  };

  // Prepare chart data
  const chartData = lifestyleLogs.map(log => ({
    date: new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sleep: log.sleep_hours || 0,
    exercise: log.exercise_minutes || 0,
    diet: (log.diet_quality || 0) * 20, // Scale to 0-100
  }));

  const bmi = calculateBMI(profile?.weight_kg || null, profile?.height_cm || null);
  const bmiCategory = getBMICategory(bmi);

  const profileFields = [
    { label: 'Full Name', value: profile?.full_name, icon: User },
    { label: 'Email', value: profile?.email, icon: Mail },
    { label: 'Age', value: profile?.age ? `${profile.age} years` : null, icon: Calendar },
    { label: 'Sex', value: profile?.sex, icon: User },
    { label: 'Job', value: profile?.job, icon: Briefcase },
    { label: 'Address', value: profile?.address, icon: MapPin },
    { label: 'Weight', value: profile?.weight_kg ? `${profile.weight_kg} kg` : null, icon: Scale },
    { label: 'Height', value: profile?.height_cm ? `${profile.height_cm} cm` : null, icon: Ruler },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Completion Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-background to-accent/10 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Profile Completion</CardTitle>
                  <CardDescription>Complete your profile for personalized insights</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">{profileCompletion}%</span>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {profileFields.map((field, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    field.value ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {field.value ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="text-sm truncate">{field.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* BMI & Scores Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Body & Wellness Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/10 rounded-xl text-center">
                <Scale className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">{bmi}</div>
                <div className={`text-xs ${bmiCategory.color}`}>{bmiCategory.label}</div>
                <div className="text-xs text-muted-foreground mt-1">BMI</div>
              </div>
              <div className="p-4 bg-pink-500/10 rounded-xl text-center">
                <Smile className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                <div className="text-2xl font-bold text-foreground">
                  {profile?.happiness_score ?? "N/A"}{profile?.happiness_score ? "/10" : ""}
                </div>
                <div className="text-xs text-muted-foreground">Happiness</div>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-xl text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-foreground">
                  {profile?.loneliness_score ?? "N/A"}{profile?.loneliness_score ? "/10" : ""}
                </div>
                <div className="text-xs text-muted-foreground">Loneliness</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-xl text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold text-foreground">
                  {profile?.age ?? "N/A"}{profile?.age ? " yrs" : ""}
                </div>
                <div className="text-xs text-muted-foreground">Age</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Form */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={editedProfile.weight_kg ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, weight_kg: e.target.value ? parseFloat(e.target.value) : null }))}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={editedProfile.height_cm ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, height_cm: e.target.value ? parseFloat(e.target.value) : null }))}
                    placeholder="170"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={editedProfile.age ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, age: e.target.value ? parseInt(e.target.value) : null }))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={editedProfile.sex ?? ""}
                    onValueChange={(value) => setEditedProfile(prev => ({ ...prev, sex: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Job & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job">Job/Occupation</Label>
                  <Input
                    id="job"
                    value={editedProfile.job ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, job: e.target.value }))}
                    placeholder="Software Developer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editedProfile.address ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="happiness">Happiness Score (1-10)</Label>
                  <Input
                    id="happiness"
                    type="number"
                    min="1"
                    max="10"
                    value={editedProfile.happiness_score ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, happiness_score: e.target.value ? parseInt(e.target.value) : null }))}
                    placeholder="7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loneliness">Loneliness Score (1-10)</Label>
                  <Input
                    id="loneliness"
                    type="number"
                    min="1"
                    max="10"
                    value={editedProfile.loneliness_score ?? ""}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, loneliness_score: e.target.value ? parseInt(e.target.value) : null }))}
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Habits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-green-600">
                    <ThumbsUp className="h-4 w-4" />
                    Good Habits
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={goodHabitInput}
                      onChange={(e) => setGoodHabitInput(e.target.value)}
                      placeholder="Add a good habit"
                      onKeyPress={(e) => e.key === 'Enter' && addGoodHabit()}
                    />
                    <Button type="button" variant="outline" onClick={addGoodHabit}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editedProfile.good_habits || []).map((habit, i) => (
                      <Badge key={i} variant="secondary" className="bg-green-500/20 text-green-600">
                        {habit}
                        <button onClick={() => removeGoodHabit(i)} className="ml-2 hover:text-red-500">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-red-600">
                    <ThumbsDown className="h-4 w-4" />
                    Bad Habits
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={badHabitInput}
                      onChange={(e) => setBadHabitInput(e.target.value)}
                      placeholder="Add a bad habit"
                      onKeyPress={(e) => e.key === 'Enter' && addBadHabit()}
                    />
                    <Button type="button" variant="outline" onClick={addBadHabit}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(editedProfile.bad_habits || []).map((habit, i) => (
                      <Badge key={i} variant="secondary" className="bg-red-500/20 text-red-600">
                        {habit}
                        <button onClick={() => removeBadHabit(i)} className="ml-2 hover:text-red-800">×</button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Habits Display (when not editing) */}
      {!isEditing && (profile?.good_habits?.length || profile?.bad_habits?.length) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Your Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.good_habits?.length ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <ThumbsUp className="h-4 w-4" />
                      Good Habits
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.good_habits.map((habit, i) => (
                        <Badge key={i} className="bg-green-500/20 text-green-600 border-green-500/30">
                          {habit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
                {profile?.bad_habits?.length ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-600 font-medium">
                      <ThumbsDown className="h-4 w-4" />
                      Bad Habits
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.bad_habits.map((habit, i) => (
                        <Badge key={i} className="bg-red-500/20 text-red-600 border-red-500/30">
                          {habit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Lifestyle Metrics Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Lifestyle Metrics
            </CardTitle>
            <CardDescription>Your recent lifestyle data affecting mental wellness</CardDescription>
          </CardHeader>
          <CardContent>
            {lifestyleLogs.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-indigo-500/10 rounded-xl text-center">
                    <Moon className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {(lifestyleLogs.reduce((sum, l) => sum + (l.sleep_hours || 0), 0) / lifestyleLogs.length).toFixed(1)}h
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Sleep</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-xl text-center">
                    <Dumbbell className="h-6 w-6 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(lifestyleLogs.reduce((sum, l) => sum + (l.exercise_minutes || 0), 0) / lifestyleLogs.length)}m
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Exercise</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-xl text-center">
                    <Apple className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {(lifestyleLogs.reduce((sum, l) => sum + (l.diet_quality || 0), 0) / lifestyleLogs.length).toFixed(1)}/5
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Diet</div>
                  </div>
                  <div className="p-4 bg-cyan-500/10 rounded-xl text-center">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                    <div className="text-2xl font-bold text-foreground">
                      {Math.round(lifestyleLogs.reduce((sum, l) => sum + (l.water_intake_ml || 0), 0) / lifestyleLogs.length)}ml
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Water</div>
                  </div>
                </div>

                {/* Trend Chart */}
                {chartData.length > 3 && (
                  <div className="h-[200px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sleep" stroke="hsl(var(--primary))" strokeWidth={2} name="Sleep (hrs)" dot={false} />
                        <Line type="monotone" dataKey="exercise" stroke="hsl(var(--accent))" strokeWidth={2} name="Exercise (min)" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No lifestyle data yet</p>
                <Button onClick={() => navigate("/mind-your-sleep")}>
                  Start Tracking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Self-Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-accent/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Self-Insights
            </CardTitle>
            <CardDescription>
              Personalized correlations between your lifestyle and mental health
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-4 rounded-xl border ${
                  insight.type === 'positive' 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : insight.type === 'negative'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-muted/50 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'positive' 
                      ? 'bg-green-500/20' 
                      : insight.type === 'negative'
                      ? 'bg-red-500/20'
                      : 'bg-muted'
                  }`}>
                    {insight.type === 'positive' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : insight.type === 'negative' ? (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    ) : (
                      <Brain className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <span className="text-sm font-medium text-foreground">{insight.recommendation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {insights.length === 0 && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Complete screenings and log lifestyle data to generate insights</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-4"
      >
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2"
          onClick={() => navigate("/secondary-care")}
        >
          <Brain className="h-6 w-6 text-primary" />
          <span>Take Screening</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex-col gap-2"
          onClick={() => navigate("/mind-your-sleep")}
        >
          <Moon className="h-6 w-6 text-indigo-500" />
          <span>Log Lifestyle</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default DemographicDashboard;
