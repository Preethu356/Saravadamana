import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{ background: 'var(--gradient-olive)' }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      >
        {/* Smooth animated orbs */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        />

        {/* Main content */}
        <div className="relative z-10 text-center px-8">
          {/* Peace symbol */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ 
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="mb-8 flex justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-20 h-20 text-white/90 fill-white/20 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          {/* Text with zoom effect */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.05, 1],
              opacity: [0, 1, 1]
            }}
            transition={{ 
              duration: 1.2,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-light tracking-[0.3em] text-white/95"
              animate={{ 
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Welcome to Sarvadamana
            </motion.h1>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
