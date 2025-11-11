import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Briefcase, Heart, Users, Activity, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<string>("");
  const [mentalState, setMentalState] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const userTypeOptions = [
    { value: "student", label: "Student", icon: GraduationCap, description: "Academic support and resources" },
    { value: "employee", label: "Employee", icon: Briefcase, description: "Workplace wellness programs" },
    { value: "women", label: "Women", icon: Heart, description: "Women-specific mental health" },
    { value: "elderly", label: "Elderly", icon: Users, description: "Senior wellness support" },
  ];

  const mentalStateOptions = [
    { value: "stable", label: "Stable", icon: CheckCircle, color: "text-green-500", description: "Feeling balanced and calm" },
    { value: "tense", label: "Tense", icon: Activity, color: "text-yellow-500", description: "Some stress but manageable" },
    { value: "anxious", label: "Anxious", icon: AlertCircle, color: "text-orange-500", description: "Experiencing anxiety" },
    { value: "critical", label: "Critical", icon: AlertTriangle, color: "text-red-500", description: "Need immediate support" },
  ];

  const handleComplete = async () => {
    if (!userType || !mentalState) {
      toast({
        title: "Please complete all steps",
        description: "Select an option from both questions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          user_type: userType,
          mental_state: mentalState,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile completed!",
        description: "Your personalized experience is ready.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error saving onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Sarvadamana</CardTitle>
          <CardDescription>
            Let's personalize your mental wellness journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Who am I?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userTypeOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setUserType(option.value);
                        setStep(2);
                      }}
                      className={`p-6 rounded-lg border-2 transition-all hover:scale-105 text-left ${
                        userType === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-6 h-6 text-primary mt-1" />
                        <div>
                          <div className="font-semibold text-foreground">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="mb-2"
              >
                ← Back
              </Button>
              <h3 className="text-lg font-semibold text-center">How are you feeling?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentalStateOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setMentalState(option.value)}
                      className={`p-6 rounded-lg border-2 transition-all hover:scale-105 text-left ${
                        mentalState === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 ${option.color} mt-1`} />
                        <div>
                          <div className="font-semibold text-foreground">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {mentalState && (
                <Button
                  onClick={handleComplete}
                  className="w-full mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Complete Setup"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
