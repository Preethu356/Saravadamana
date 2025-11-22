import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ConsentModalProps {
  open: boolean;
  onConsent: (consent: {
    analytics: boolean;
    research: boolean;
    data_sharing: boolean;
  }) => void;
}

export const ConsentModal = ({ open, onConsent }: ConsentModalProps) => {
  const [analytics, setAnalytics] = useState(true);
  const [research, setResearch] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);

  const handleAccept = () => {
    onConsent({
      analytics,
      research,
      data_sharing: dataSharing,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Privacy & Consent</DialogTitle>
          <DialogDescription>
            We respect your privacy. Please choose what data you're comfortable sharing.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="analytics" 
              checked={analytics}
              onCheckedChange={(checked) => setAnalytics(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="analytics" className="text-sm font-medium cursor-pointer">
                Analytics & Usage Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Help us improve by tracking how you use the app (required for basic functionality)
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="research" 
              checked={research}
              onCheckedChange={(checked) => setResearch(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="research" className="text-sm font-medium cursor-pointer">
                Research Data
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow anonymized data to contribute to mental health research
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="data-sharing" 
              checked={dataSharing}
              onCheckedChange={(checked) => setDataSharing(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="data-sharing" className="text-sm font-medium cursor-pointer">
                Data Sharing
              </Label>
              <p className="text-sm text-muted-foreground">
                Share insights with healthcare providers (only with your explicit permission)
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
