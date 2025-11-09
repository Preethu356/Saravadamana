import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Flame } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Welcome to Flawless Healing";

  useEffect(() => {
    // Play welcome audio with a pleasant chime
    const audio = new Audio("https://actions.google.com/sounds/v1/ambiences/meditation_gong.ogg");
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Audio play failed:", err));
    setAudioPlayed(true);

    // Typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(typingInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: i % 3 === 0 ? 'rgba(255,255,255,0.3)' : i % 3 === 1 ? 'rgba(255,215,0,0.4)' : 'rgba(135,206,250,0.3)'
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                x: [null, Math.random() * window.innerWidth],
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2 
            }}
            className="mb-12 flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Heart className="w-28 h-28 text-yellow-300 fill-yellow-300 drop-shadow-2xl" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-6"
              >
                <Sparkles className="w-40 h-40 text-cyan-200/80" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-2"
              >
                <Flame className="w-32 h-32 text-orange-400/50" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-wider min-h-[120px] md:min-h-[150px]">
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                {displayedText}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-16 md:h-20 bg-white/80 ml-2 align-middle"
              />
            </h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: displayedText.length / fullText.length }}
              transition={{ duration: 0.3 }}
              className="h-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 mt-6 mx-auto max-w-2xl origin-left rounded-full shadow-lg"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/95 mt-12 font-light tracking-wide"
          >
            Your journey to mental wellness begins here
          </motion.p>

          {/* Pulse animation */}
          <motion.div
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.2, 0, 0.2]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [0.15, 0, 0.15]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-l from-orange-400/20 via-purple-400/20 to-blue-400/20 rounded-full blur-3xl -z-10"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
