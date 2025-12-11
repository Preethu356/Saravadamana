import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ComfortingCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "warm" | "calm" | "nature" | "glow";
  hoverable?: boolean;
  animated?: boolean;
  delay?: number;
}

const ComfortingCard = ({ 
  children, 
  className, 
  variant = "default",
  hoverable = true,
  animated = true,
  delay = 0
}: ComfortingCardProps) => {
  const variants = {
    default: "bg-card border-border/50",
    warm: "bg-gradient-to-br from-warm/5 to-comfort/5 border-warm/20",
    calm: "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20",
    nature: "bg-gradient-to-br from-secondary/5 to-primary/5 border-secondary/20",
    glow: "bg-card border-primary/30 shadow-glow"
  };

  const content = (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-300",
        variants[variant],
        hoverable && "hover:shadow-soft hover:scale-[1.01] hover:border-primary/30",
        className
      )}
    >
      {children}
    </div>
  );

  if (!animated) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {content}
    </motion.div>
  );
};

export default ComfortingCard;
