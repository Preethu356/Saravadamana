import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-card border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">MindCare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your mental wellness companion. Supporting you every step of the way.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Crisis Support</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Find a Therapist</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Self-Care Tools</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Groups</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Emergency</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-destructive font-semibold">Crisis: 988</li>
              <li className="text-muted-foreground">Text: "HELLO" to 741741</li>
              <li className="text-muted-foreground">Veterans: 988 then 1</li>
              <li className="text-muted-foreground">Emergency: 911</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2024 MindCare. Made with care for mental wellness.</p>
          <p className="mt-2 text-xs">
            If you're experiencing a mental health crisis, please contact emergency services or call 988.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
