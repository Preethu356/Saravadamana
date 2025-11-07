import { Heart, Shield, Users } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 py-12 mt-20 border-t">
      <div className="container mx-auto px-4">
        {/* About Us Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              About Saravadamana
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Saravadamana is dedicated to making mental health support accessible to everyone. 
              We combine compassionate AI technology with evidence-based practices to provide 
              immediate emotional support, coping strategies, and resources for mental well-being. 
              Our mission is to create a safe, judgment-free space where anyone can seek help 
              and find support on their mental health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Safe & Private</h4>
              <p className="text-sm text-muted-foreground">
                Your conversations are confidential and secure
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Compassionate Care</h4>
              <p className="text-sm text-muted-foreground">
                Non-judgmental support whenever you need it
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Always Available</h4>
              <p className="text-sm text-muted-foreground">
                24/7 access to mental health resources
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <p className="text-center text-sm">
            <strong>Emergency Support:</strong> If you're in crisis, please call{" "}
            <a href="tel:14416" className="font-bold underline hover:text-primary">
              TELEMANAS (14416)
            </a>
            {" "}or{" "}
            <a href="tel:112" className="font-bold underline hover:text-primary">
              Emergency Services (112)
            </a>
          </p>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="text-center space-y-3 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            This is a supportive tool, not a replacement for professional medical advice, 
            diagnosis, or treatment. Always seek the advice of qualified health providers.
          </p>
          <p className="text-sm font-medium">
            © 2025 Saravadamana. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Created by Dr Preetham K S Gowda
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
