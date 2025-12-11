import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Cloud, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WarmGreetingProps {
  userName?: string;
}

const WarmGreeting = ({ userName }: WarmGreetingProps) => {
  const [greeting, setGreeting] = useState("");
  const [subGreeting, setSubGreeting] = useState("");
  const [icon, setIcon] = useState<React.ElementType>(Sun);
  const [name, setName] = useState(userName || "");

  useEffect(() => {
    fetchUserName();
    updateGreeting();
  }, [userName]);

  const fetchUserName = async () => {
    if (userName) {
      setName(userName);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profile?.full_name) {
        setName(profile.full_name.split(' ')[0]);
      }
    }
  };

  const updateGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    let timeGreeting = "";
    let timeIcon = Sun;
    let motivational = "";

    if (hour >= 5 && hour < 12) {
      timeGreeting = "Good morning";
      timeIcon = Sun;
      const morningMessages = [
        "A fresh start awaits you today",
        "May your day be filled with calm moments",
        "Start with kindness to yourself",
        "Every morning brings new possibilities"
      ];
      motivational = morningMessages[Math.floor(Math.random() * morningMessages.length)];
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = "Good afternoon";
      timeIcon = Cloud;
      const afternoonMessages = [
        "Take a moment to breathe deeply",
        "You're doing better than you think",
        "A little pause can recharge your spirit",
        "Remember to be gentle with yourself"
      ];
      motivational = afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
    } else if (hour >= 17 && hour < 21) {
      timeGreeting = "Good evening";
      timeIcon = Heart;
      const eveningMessages = [
        "Reflect on the good moments of today",
        "Wind down with self-compassion",
        "You've made it through another day",
        "Evening peace is yours to embrace"
      ];
      motivational = eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    } else {
      timeGreeting = "Good night";
      timeIcon = Moon;
      const nightMessages = [
        "Rest well, tomorrow is a new beginning",
        "Let go of today's worries gently",
        "Sweet dreams and peaceful rest await",
        "You deserve this moment of calm"
      ];
      motivational = nightMessages[Math.floor(Math.random() * nightMessages.length)];
    }

    // Weekend special messages
    if (day === 0 || day === 6) {
      const weekendAdditions = [
        " — enjoy your weekend!",
        " — time for self-care",
        " — relax and recharge"
      ];
      motivational += weekendAdditions[Math.floor(Math.random() * weekendAdditions.length)];
    }

    setGreeting(timeGreeting);
    setSubGreeting(motivational);
    setIcon(timeIcon);
  };

  const IconComponent = icon;

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <IconComponent className="w-8 h-8 text-comfort" />
        </motion.div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {greeting}{name && `, ${name}`}
        </h1>
      </div>
      <motion.p 
        className="text-muted-foreground text-lg flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Sparkles className="w-4 h-4 text-accent" />
        {subGreeting}
      </motion.p>
    </motion.div>
  );
};

export default WarmGreeting;
