import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  Award,
  Activity,
  Brain,
  Heart,
  Moon,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data: statsData } = await supabase
        .from("user_wellness_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (statsData) setStats(statsData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const quickLinks = [
    { icon: Brain, label: "Personality Results", path: "/personality-screening", color: "text-purple-500" },
    { icon: Activity, label: "Mood History", path: "/mood-tracker", color: "text-blue-500" },
    { icon: Heart, label: "Wellness Plan", path: "/mind-plan", color: "text-pink-500" },
    { icon: Moon, label: "Sleep Routines", path: "/mind-your-sleep", color: "text-indigo-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <BackButton />

      <div className="container mx-auto px-4 pt-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-2xl text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground">
            {profile?.full_name || "Wellness Seeker"}
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              Joined {new Date(user?.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-primary">{stats.current_streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-secondary">{stats.total_sessions}</div>
              <div className="text-xs text-muted-foreground">Sessions</div>
            </Card>
            <Card className="p-4 text-center bg-card/50 backdrop-blur-sm">
              <div className="text-2xl font-bold text-accent">{stats.meditation_minutes}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </Card>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Achievements</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="px-3 py-1">
              🌟 Early Adopter
            </Badge>
            {stats?.current_streak >= 3 && (
              <Badge variant="secondary" className="px-3 py-1">
                🔥 3-Day Streak
              </Badge>
            )}
            {stats?.total_sessions >= 5 && (
              <Badge variant="secondary" className="px-3 py-1">
                💪 5 Sessions
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          <h2 className="font-semibold text-foreground">Quick Access</h2>
          {quickLinks.map((link) => (
            <Card
              key={link.path}
              onClick={() => navigate(link.path)}
              className="p-4 cursor-pointer hover:shadow-md transition-all bg-card/50 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <link.icon className={`h-5 w-5 ${link.color}`} />
                  <span className="font-medium text-foreground">{link.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => toast.info("Settings coming soon")}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start gap-3"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
