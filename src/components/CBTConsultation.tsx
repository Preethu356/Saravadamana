import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, UserCheck, Shield } from "lucide-react";

const CBTConsultation = () => {
  const handleConsultation = () => {
    window.location.href = "tel:7337748629";
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto border-2 border-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-2">Free Expert CBT Consultation</CardTitle>
            <CardDescription className="text-lg">
              One complimentary Cognitive Behavioral Therapy session per person
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Expert Therapist</h4>
                    <p className="text-sm text-muted-foreground">
                      Certified CBT practitioner with extensive experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Flexible Scheduling</h4>
                    <p className="text-sm text-muted-foreground">
                      Book your session at a time convenient for you
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Confidential & Safe</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete privacy and professional ethical standards
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-center items-center text-center">
                <Phone className="h-12 w-12 text-primary mb-4" />
                <h4 className="font-semibold mb-2">Contact for Free Consultation</h4>
                <p className="text-2xl font-bold mb-4">7337748629</p>
                <Button onClick={handleConsultation} size="lg" className="w-full">
                  Call Now
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Limited to one free session per person
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">What is CBT?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Cognitive Behavioral Therapy (CBT) is an evidence-based psychological treatment that helps you identify and change negative thought patterns and behaviors. It's highly effective for:
              </p>
              <div className="grid md:grid-cols-2 gap-2">
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Depression and anxiety
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Stress management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Panic disorders
                  </li>
                </ul>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> OCD and phobias
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Sleep problems
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span> Relationship issues
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CBTConsultation;
