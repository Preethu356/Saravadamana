import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  LogOut, 
  User as UserIcon, 
  ChevronDown, 
  Home, 
  Image, 
  Heart, 
  Brain, 
  Activity,
  MessageCircle,
  BookOpen,
  Calendar,
  Smile,
  Sparkles,
  Shield,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import saravadamanaLogo from "@/assets/sarvadamana-symbol.png";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mentalHealthOpen, setMentalHealthOpen] = useState(false);
  const [preventionOpen, setPreventionOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [wellnessStats, setWellnessStats] = useState<{
    current_streak: number;
    total_sessions: number;
    meditation_minutes: number;
  } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchWellnessStats(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchWellnessStats(session.user.id);
        } else {
          setWellnessStats(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Realtime subscription for wellness stats updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('wellness-stats-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_wellness_stats',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Wellness stats changed:', payload);
          if (payload.new && typeof payload.new === 'object') {
            const newData = payload.new as any;
            setWellnessStats({
              current_streak: newData.current_streak || 0,
              total_sessions: newData.total_sessions || 0,
              meditation_minutes: newData.meditation_minutes || 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchWellnessStats = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_wellness_stats')
      .select('current_streak, total_sessions, meditation_minutes')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching wellness stats:', error);
      return;
    }

    if (!data) {
      // Initialize stats row for existing users who signed up before the trigger was added
      const { data: inserted, error: insertError } = await supabase
        .from('user_wellness_stats')
        .insert({ 
          user_id: userId,
          current_streak: 1,
          total_sessions: 1,
          meditation_minutes: 0
        })
        .select('current_streak, total_sessions, meditation_minutes')
        .single();

      if (insertError) {
        console.error('Error initializing wellness stats:', insertError);
        return;
      }

      setWellnessStats(inserted);
      return;
    }

    setWellnessStats(data);
  };

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
    { to: "/", label: "Home", icon: Home, color: "text-primary" },
    { to: "/dashboard", label: "Dashboard", icon: Activity, color: "text-accent" },
    { to: "/gallery", label: "Gallery", icon: Image, color: "text-secondary" }
  ];

  const mentalHealthLinks = [
    { to: "/school-mental-health", label: "School Mental Health", icon: BookOpen, color: "text-blue-500" },
    { to: "/workplace-mental-health", label: "Workplace Mental Health", icon: Activity, color: "text-green-500" },
    { to: "/women-mental-health", label: "Women's Mental Health", icon: Heart, color: "text-pink-500" },
    { to: "/old-age-mental-health", label: "Senior Mental Health", icon: Users, color: "text-purple-500" }
  ];

  const preventionLinks = [
    { to: "/mental-health-prevention", label: "Prevention Overview", icon: Shield, color: "text-cyan-500" },
    { to: "/primary-care", label: "Primary Prevention", icon: Heart, color: "text-green-500" },
    { to: "/secondary-care", label: "Secondary Prevention", icon: Activity, color: "text-blue-500" },
    { to: "/tertiary-care", label: "Tertiary Prevention", icon: Brain, color: "text-purple-500" }
  ];

  const resourcesLinks = [
    { to: "/mood-tracker", label: "Mood Tracker", icon: Smile, color: "text-yellow-500" },
    { to: "/ai-support", label: 'Talk to "Mini Menti"', icon: Sparkles, color: "text-cyan-500" },
    { to: "/resources", label: "Support Resources", icon: BookOpen, color: "text-orange-500" },
    { to: "/journal", label: "Journal", icon: BookOpen, color: "text-pink-500" },
    { to: "/wellness-tools", label: "Wellness Tools", icon: Activity, color: "text-teal-500" },
    { to: "/cbt-consultation", label: "CBT Consultation", icon: Calendar, color: "text-indigo-500" }
  ];

  // Dynamic wellness badges based on real user data
  const getBadges = () => {
    if (!wellnessStats) return [];
    
    const badges: { label: string; icon: string; color: "default" | "secondary" | "destructive" | "outline" }[] = [];
    
    // Streak badge
    if (wellnessStats.current_streak > 0) {
      badges.push({
        label: `${wellnessStats.current_streak} Day Streak`,
        icon: "🔥",
        color: "default"
      });
    }
    
    // Sessions badge
    if (wellnessStats.total_sessions >= 5) {
      badges.push({
        label: `${wellnessStats.total_sessions} Sessions`,
        icon: "⭐",
        color: "secondary"
      });
    }
    
    // Meditation badge
    if (wellnessStats.meditation_minutes >= 30) {
      badges.push({
        label: "Mindful",
        icon: "🧘",
        color: "outline"
      });
    }

    // Always show a gentle starter badge so something is visible
    if (badges.length === 0) {
      badges.push({ label: "Getting Started", icon: "🌱", color: "outline" });
    }
    
    return badges;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img 
              src={saravadamanaLogo} 
              alt="Sarvadamana Logo" 
              className="w-10 h-10 object-contain"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="flex flex-col">
              <motion.span 
                className="font-bold text-xl relative"
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="relative inline-block bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  Sarvadamana
                </span>
                {/* Burning effect overlay */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 via-orange-500/20 to-transparent blur-sm"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                {/* Healing glow effect */}
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-500/20 blur-md -z-10"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.95, 1.1, 0.95]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
              </motion.span>
              <span className="text-xs text-muted-foreground tracking-wide bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                "Promote Protect Prevent"
              </span>
            </div>
          </Link>

          {/* Floating Badges - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            {user && getBadges().length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                {getBadges().map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ 
                      opacity: 1, 
                      y: [0, -8, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                      ease: "easeInOut"
                    }}
                  >
                    <Badge variant={badge.color} className="shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <span className="mr-1">{badge.icon}</span>
                      {badge.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Auth Buttons */}
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
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[380px] bg-gradient-to-b from-background to-muted/20 z-[100] overflow-y-auto">
              <SheetHeader className="border-b pb-4">
                <SheetTitle className="text-left flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Menu
                  </span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-1 mt-6">
                {/* Main Navigation */}
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="group flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-primary/10 hover:shadow-sm hover:translate-x-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className={`w-5 h-5 ${link.color} group-hover:scale-110 transition-transform`} />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}

                {/* Mental Health Collapsible */}
                <div className="mt-2">
                  <Collapsible open={mentalHealthOpen} onOpenChange={setMentalHealthOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 border-2 border-transparent hover:border-primary/20 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <span>Mental Health</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mentalHealthOpen ? 'rotate-180 text-primary' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      {mentalHealthLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all py-2.5 px-4 pl-14 rounded-lg hover:bg-accent/50 hover:translate-x-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Prevention Collapsible */}
                <div className="mt-2">
                  <Collapsible open={preventionOpen} onOpenChange={setPreventionOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 border-2 border-transparent hover:border-cyan-500/20 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span>Prevention</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${preventionOpen ? 'rotate-180 text-cyan-500' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      {preventionLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all py-2.5 px-4 pl-14 rounded-lg hover:bg-accent/50 hover:translate-x-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Mental Health Resources Collapsible */}
                <div className="mt-2">
                  <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen}>
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-semibold text-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-secondary/10 hover:to-accent/10 border-2 border-transparent hover:border-secondary/20 group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span>Resources</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${resourcesOpen ? 'rotate-180 text-secondary' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-2 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      {resourcesLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.to}
                            to={link.to}
                            className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-all py-2.5 px-4 pl-14 rounded-lg hover:bg-accent/50 hover:translate-x-1"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className={`w-4 h-4 ${link.color} group-hover:scale-110 transition-transform`} />
                            <span>{link.label}</span>
                          </Link>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Mental Health Support */}
                <div className="mt-2">
                  <Link
                    to="/ai-support"
                    className="group flex items-center gap-3 text-sm font-medium text-foreground hover:text-primary transition-all py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 border-2 border-transparent hover:border-accent/20 hover:translate-x-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <span>Mental Health Support</span>
                  </Link>
                </div>

                {/* Auth Section */}
                <div className="border-t pt-4 mt-6 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 mb-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-border/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2 shadow-sm hover:shadow-md transition-all"
                        onClick={handleSignOut}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="md:hidden space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-2 hover:bg-accent"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to="/login">Login</Link>
                      </Button>
                      <Button
                        size="sm"
                        className="w-full shadow-sm hover:shadow-md transition-all"
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
