import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format } from "date-fns";
import saravadamanaLogo from "@/assets/saravadamana-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/#about", label: "About Us" },
    { to: "/#gallery", label: "Gallery" }
  ];

  const mentalHealthLinks = [
    { to: "/primary-care", label: "Primary Prevention" },
    { to: "/secondary-care", label: "Secondary Prevention" },
    { to: "/tertiary-care", label: "Tertiary Prevention" }
  ];

  const resourcesLinks = [
    { to: "/#mood-tracker", label: "Mood Tracker" },
    { to: "/#ai-chat", label: "AI Support" },
    { to: "/#resources", label: "Support Resources" },
    { to: "/journal", label: "Journal" },
    { to: "/#wellness-tools", label: "Wellness Tools" },
    { to: "/#cbt-consultation", label: "CBT Consultation" }
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


          {/* Live Date & Time */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            <div className="text-sm font-medium">
              <span className="text-foreground">{format(currentTime, 'PPP')}</span>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-primary tabular-nums">{format(currentTime, 'p')}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            
            {/* Mental Health Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Mental Health
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background z-50">
                {mentalHealthLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mental Health Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  Mental Health Resources
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background z-50">
                {resourcesLinks.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <a href={link.to} className="cursor-pointer w-full">
                      {link.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mental Health Support */}
            <a
              href="/#ai-chat"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Mental Health Support
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.to}
                  href={link.to}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Mobile Date & Time */}
              <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 rounded-xl border border-primary/10 my-2">
                <Clock className="w-4 h-4 text-primary animate-pulse" />
                <div className="text-sm font-medium">
                  <div className="text-foreground">{format(currentTime, 'PPP')}</div>
                  <div className="text-primary tabular-nums mt-1">{format(currentTime, 'p')}</div>
                </div>
              </div>
              
              {/* Mental Health Section */}
              <div className="border-t pt-3 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">Mental Health</p>
                {mentalHealthLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Mental Health Resources Section */}
              <div className="border-t pt-3 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-2 mb-2">Mental Health Resources</p>
                {resourcesLinks.map((link) => (
                  <a
                    key={link.to}
                    href={link.to}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 pl-4 block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Mental Health Support */}
              <div className="border-t pt-3 mt-2">
                <a
                  href="/#ai-chat"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mental Health Support
                </a>
              </div>
              <div className="border-t pt-3 mt-2 space-y-2">
                {user ? (
                  <>
                    <p className="text-xs text-muted-foreground px-2 truncate">
                      {user.email}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
