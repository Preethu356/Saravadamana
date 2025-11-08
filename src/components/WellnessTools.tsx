import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Brain, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const wellnessTools = [
  {
    icon: Brain,
    title: "PHQ-9 Depression Screening",
    description: "9-question assessment to evaluate symptoms of depression over the last 2 weeks.",
    color: "text-primary bg-primary/10",
    link: "/secondary-care?tool=phq9"
  },
  {
    icon: Heart,
    title: "WHO-5 Well-Being Index",
    description: "5-question assessment measuring current mental wellbeing and quality of life.",
    color: "text-secondary bg-secondary/10",
    link: "/secondary-care?tool=who5"
  },
  {
    icon: Activity,
    title: "GAD-7 Anxiety Screening",
    description: "7-question tool to screen for generalized anxiety disorder symptoms.",
    color: "text-accent bg-accent/10",
    link: "/secondary-care?tool=gad7"
  }
];

const WellnessTools = () => {
  return (
    <section id="wellness-tools" className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Wellness
            </span>{" "}
            Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional screening tools to help you understand your mental health status.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {wellnessTools.map(({ icon: Icon, title, description, color, link }) => (
            <Card 
              key={title}
              className="p-6 shadow-card border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:scale-105 bg-card/80 backdrop-blur-sm group"
            >
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>
              <Button 
                variant="default" 
                className="w-full"
                asChild
              >
                <Link to={link}>
                  Start Screening
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These screening tools provide informal assessments only. They are not diagnostic tools. 
            Please consult a mental health professional for proper diagnosis and treatment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WellnessTools;