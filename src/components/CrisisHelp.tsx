import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Heart, AlertCircle } from "lucide-react";

interface CrisisHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrisisHelp = ({ isOpen, onClose }: CrisisHelpProps) => {
  const helplines = [
    {
      name: "TELEMANAS (Tele Mental Health Assistance)",
      number: "14416",
      description: "National tele-mental health program",
      hours: "Available 24/7",
      featured: true
    },
    {
      name: "KIRAN Mental Health Helpline",
      number: "1800-599-0019",
      description: "24/7 toll-free helpline",
      hours: "Available 24/7"
    },
    {
      name: "Vandrevala Foundation",
      number: "1860-2662-345",
      description: "Mental health support",
      hours: "24/7"
    },
    {
      name: "iCall Psychosocial Helpline",
      number: "022-25521111",
      description: "Professional counseling",
      hours: "Mon-Sat, 8 AM - 10 PM"
    },
    {
      name: "Snehi",
      number: "91-22-27546669",
      description: "Crisis intervention",
      hours: "24/7"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl">You're Not Alone - Help is Available</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="p-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive mb-2">Emergency Services</h3>
                <p className="text-sm mb-3">
                  If you're in immediate danger or having thoughts of self-harm, please call:
                </p>
                <Button 
                  variant="destructive" 
                  size="lg"
                  className="w-full font-bold text-lg"
                  asChild
                >
                  <a href="tel:112">📞 Dial 112 (Emergency)</a>
                </Button>
              </div>
            </div>
          </Card>

          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              Mental Health Helplines (India)
            </h3>
            <div className="grid gap-4">
              {helplines.map((helpline, idx) => (
                <Card 
                  key={idx} 
                  className={`p-4 transition-colors ${
                    helpline.featured 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {helpline.name}
                        {helpline.featured && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">{helpline.description}</p>
                      <p className="text-xs text-muted-foreground">{helpline.hours}</p>
                    </div>
                    <Button 
                      variant={helpline.featured ? "default" : "outline"}
                      size="sm"
                      asChild
                    >
                      <a href={`tel:${helpline.number.replace(/\s/g, '')}`} className="whitespace-nowrap">
                        📞 {helpline.number}
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-2 text-sm">What to Expect When You Call</h4>
            <ul className="text-sm space-y-1.5 text-muted-foreground">
              <li>• Trained counselors will listen without judgment</li>
              <li>• Calls are confidential and free</li>
              <li>• You can remain anonymous if you prefer</li>
              <li>• They can provide immediate emotional support and resources</li>
            </ul>
          </Card>

          <div className="flex gap-2">
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CrisisHelp;
