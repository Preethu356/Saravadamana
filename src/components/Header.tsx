import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import saravadamanaLogo from "@/assets/saravadamana-logo.png";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mentalHealthOpen, setMentalHealthOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been logged out."
      });
      navigate("/");
    }
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/gallery", label: "Gallery" }
  ];

  const mentalHealthLinks = [
    { to: "/primary-care", label: "Primary Prevention" },
    { to: "/secondary-care", label: "Secondary Prevention" },
    { to: "/tertiary-care", label: "Tertiary Prevention" }
  ];

  const resourcesLinks = [
    { to: "/mood-tracker", label: "Mood Tracker" },
    { to: "/ai-support", label: "AI Support" },
    { to: "/resources", label: "Support Resources" },
    { to: "/journal", label: "Journal" },
    { to: "/wellness-tools", label: "Wellness Tools" },
    { to: "/cbt-consultation", label: "CBT Consultation" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src={saravadamanaLogo} 
              alt="Saravadamana Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="hidden sm:inline font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Saravadamana
            </span>
          </Link>

          {/* Auth Buttons - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{user.email}</span>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Side Drawer Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background z-[100]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-2 mt-6">
                {/* Main Navigation */}
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mental Health Collapsible */}
                <Collapsible open={mentalHealthOpen} onOpenChange={setMentalHealthOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent">
                    Mental Health
                    <ChevronDown className={`w-4 h-4 transition-transform ${mentalHealthOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    {mentalHealthLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Mental Health Resources Collapsible */}
                <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent">
                    Mental Health Resources
                    <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 mt-1 space-y-1">
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-accent"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                {/* Mental Health Support */}
                <Link
                  to="/ai-support"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors py-3 px-4 rounded-lg hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mental Health Support
                </Link>

                {/* Auth Section */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  {user ? (
                    <>
                      <p className="text-xs text-muted-foreground px-4 truncate flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        {user.email}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="md:hidden space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to="/signup">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
