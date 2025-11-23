import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import Watermark from "@/components/Watermark";

const reflectionPrompts = [
  {
    category: "Gratitude",
    prompt: "What are three things you're grateful for today?",
  },
  {
    category: "Emotions",
    prompt: "How are you feeling right now? Describe your emotions without judgment.",
  },
  {
    category: "Growth",
    prompt: "What is one thing you learned about yourself this week?",
  },
  {
    category: "Challenges",
    prompt: "What challenge did you face recently, and how did you cope with it?",
  },
  {
    category: "Self-Care",
    prompt: "What self-care activities made you feel better recently?",
  },
  {
    category: "Future",
    prompt: "What is one small step you can take tomorrow to improve your mental wellness?",
  },
];

const MindReflection = () => {
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState("");

  const handleReflectionChange = (category: string, value: string) => {
    setReflections((prev) => ({ ...prev, [category]: value }));
  };

  const generatePDF = () => {
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    const hasReflections = Object.values(reflections).some(r => r.trim());
    if (!hasReflections) {
      toast.error("Please write at least one reflection");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(88, 86, 214);
    doc.text("Mind Reflection Journal", pageWidth / 2, yPosition, { align: "center" });
    
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Name: ${userName}`, margin, yPosition);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, yPosition, { align: "right" });
    
    yPosition += 15;

    reflectionPrompts.forEach((item) => {
      const reflection = reflections[item.category];
      if (reflection && reflection.trim()) {
        // Category heading
        doc.setFontSize(14);
        doc.setTextColor(88, 86, 214);
        doc.text(item.category, margin, yPosition);
        yPosition += 7;

        // Prompt
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const promptLines = doc.splitTextToSize(item.prompt, pageWidth - 2 * margin);
        doc.text(promptLines, margin, yPosition);
        yPosition += promptLines.length * 5 + 5;

        // Reflection
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const reflectionLines = doc.splitTextToSize(reflection, pageWidth - 2 * margin);
        doc.text(reflectionLines, margin, yPosition);
        yPosition += reflectionLines.length * 5 + 10;

        // Add new page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      }
    });

    doc.save(`mind-reflection-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Reflection journal downloaded successfully!");
  };

  return (
    <div className="min-h-screen relative">
      <Watermark />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Mind Reflection Journal
            </h1>
            <p className="text-lg text-muted-foreground">
              Take time to reflect on your mental wellness journey
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="userName">Your Name</Label>
              <input
                id="userName"
                type="text"
                className="w-full mt-2 px-4 py-2 border border-border rounded-lg bg-background"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </CardContent>
          </Card>

          {reflectionPrompts.map((item) => (
            <Card key={item.category} className="mb-6">
              <CardHeader>
                <CardTitle>{item.category}</CardTitle>
                <CardDescription>{item.prompt}</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Write your reflection here..."
                  value={reflections[item.category] || ""}
                  onChange={(e) => handleReflectionChange(item.category, e.target.value)}
                  className="min-h-32"
                />
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center mt-8">
            <Button onClick={generatePDF} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Download Reflection Journal as PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindReflection;
