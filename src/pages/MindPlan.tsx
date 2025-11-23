import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Watermark from "@/components/Watermark";

const wellnessActivities = [
  { id: "meditation", label: "Daily Meditation (10-15 min)", category: "Mindfulness" },
  { id: "exercise", label: "Physical Exercise (30 min)", category: "Physical Health" },
  { id: "journaling", label: "Reflective Journaling", category: "Self-Reflection" },
  { id: "sleep", label: "Consistent Sleep Schedule", category: "Rest" },
  { id: "nutrition", label: "Balanced Nutrition", category: "Physical Health" },
  { id: "social", label: "Social Connection", category: "Relationships" },
  { id: "breathing", label: "Breathing Exercises", category: "Mindfulness" },
  { id: "hobby", label: "Engage in Hobbies", category: "Joy" },
  { id: "nature", label: "Time in Nature", category: "Environment" },
  { id: "gratitude", label: "Gratitude Practice", category: "Positive Thinking" },
];

const MindPlan = () => {
  const [userName, setUserName] = useState("");
  const [goals, setGoals] = useState("");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [duration, setDuration] = useState("7");

  const toggleActivity = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId]
    );
  };

  const generatePDF = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!goals.trim()) {
      toast.error("Please describe your wellness goals");
      return;
    }

    if (selectedActivities.length === 0) {
      toast.error("Please select at least one activity");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Title
    doc.setFontSize(22);
    doc.setTextColor(88, 86, 214);
    doc.text("Personal Mental Wellness Plan", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Name: ${userName}`, margin, yPosition);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPosition, { align: "right" });
    
    yPosition += 10;
    doc.text(`Plan Duration: ${duration} days`, margin, yPosition);
    
    yPosition += 15;

    // Goals Section
    doc.setFontSize(16);
    doc.setTextColor(88, 86, 214);
    doc.text("My Wellness Goals", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const goalLines = doc.splitTextToSize(goals, pageWidth - 2 * margin);
    doc.text(goalLines, margin, yPosition);
    yPosition += goalLines.length * 6 + 15;

    // Selected Activities
    doc.setFontSize(16);
    doc.setTextColor(88, 86, 214);
    doc.text("My Daily Wellness Activities", margin, yPosition);
    yPosition += 10;

    const selectedActivityDetails = wellnessActivities.filter((a) =>
      selectedActivities.includes(a.id)
    );

    selectedActivityDetails.forEach((activity) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`✓ ${activity.label}`, margin + 5, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`(${activity.category})`, margin + 10, yPosition + 5);
      
      yPosition += 12;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    yPosition += 10;

    // Weekly Tracker
    doc.setFontSize(16);
    doc.setTextColor(88, 86, 214);
    doc.text("Weekly Progress Tracker", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    doc.text("Activity", margin, yPosition);
    days.forEach((day, index) => {
      doc.text(day, margin + 60 + index * 15, yPosition);
    });
    yPosition += 8;

    selectedActivityDetails.forEach((activity) => {
      const activityLabel = activity.label.substring(0, 25);
      doc.text(activityLabel, margin, yPosition);
      
      days.forEach((_, index) => {
        doc.rect(margin + 60 + index * 15, yPosition - 3, 8, 8);
      });
      
      yPosition += 10;

      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save(`mind-plan-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Wellness plan downloaded successfully!");
  };

  return (
    <div className="min-h-screen relative">
      <Watermark />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Create Your Mind Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Design a personalized mental wellness plan tailored to your needs
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="userName">Your Name</Label>
                <input
                  id="userName"
                  type="text"
                  className="w-full mt-2 px-4 py-2 border border-border rounded-lg bg-background"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="duration">Plan Duration (days)</Label>
                <select
                  id="duration"
                  className="w-full mt-2 px-4 py-2 border border-border rounded-lg bg-background"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="21">21 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Wellness Goals</CardTitle>
              <CardDescription>
                What do you hope to achieve with this wellness plan?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-32 px-4 py-2 border border-border rounded-lg bg-background"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Describe your mental wellness goals..."
              />
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Select Your Daily Activities
              </CardTitle>
              <CardDescription>
                Choose activities you commit to practicing regularly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wellnessActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                    <Checkbox
                      id={activity.id}
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={() => toggleActivity(activity.id)}
                    />
                    <label
                      htmlFor={activity.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">{activity.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.category}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button onClick={generatePDF} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Download Mind Plan as PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindPlan;
