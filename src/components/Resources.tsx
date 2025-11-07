import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Phone, Calendar, Shield, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const resources = [
  {
    icon: BookOpen,
    title: "Self-Care Library",
    description: "Access guided meditations, breathing exercises, and mindfulness practices.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Users,
    title: "Support Groups",
    description: "Connect with others who understand. Join moderated peer support communities.",
    color: "text-secondary bg-secondary/10",
  },
  {
    icon: Phone,
    title: "Crisis Hotline",
    description: "24/7 immediate support. National Suicide Prevention Lifeline: 988",
    color: "text-destructive bg-destructive/10",
  },
  {
    icon: Calendar,
    title: "Therapy Matching",
    description: "Find licensed therapists who specialize in your needs and accept your insurance.",
    color: "text-accent bg-accent/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is encrypted and never shared. Complete anonymity if you choose.",
    color: "text-primary bg-primary/10",
  },
  {
    icon: Heart,
    title: "Wellness Tools",
    description: "Track mood patterns, set goals, and celebrate your progress along the way.",
    color: "text-secondary bg-secondary/10",
  },
];

const Resources = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Resources
            </span>{" "}
            & Support
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for your mental wellness journey, all in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(({ icon: Icon, title, description, color }) => (
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
                variant="ghost" 
                className="w-full justify-start px-0 group-hover:text-primary"
                onClick={() => navigate("/resources")}
              >
                Learn More →
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-card">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Need Immediate Help?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If you're in crisis or having thoughts of suicide, please reach out immediately. You are not alone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                variant="destructive" 
                size="lg"
                onClick={() => window.open("tel:988", "_self")}
              >
                <Phone className="w-4 h-4" />
                Call 988 Now
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2"
                onClick={() => window.open("sms:741741?body=HOME", "_self")}
              >
                Text Crisis Line
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Resources;
