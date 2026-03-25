import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

const SharedDisplay = () => {
  const [dotIndex, setDotIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => setDotIndex((prev) => (prev + 1) % 4), 500);
    return () => clearInterval(timer);
  }, []);

  const dots = ".".repeat(dotIndex);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-foreground hover:text-primary transition-colors">
          <Home className="w-7 h-7" />
        </Link>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 -mt-16">
        {/* Card icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 sm:w-28 sm:h-28 bg-foreground rounded-2xl flex items-center justify-center"
        >
          <svg
            viewBox="0 0 64 64"
            className="w-14 h-14 sm:w-16 sm:h-16 text-background"
            fill="currentColor"
          >
            {/* Person silhouette */}
            <circle cx="22" cy="20" r="8" />
            <path d="M10 40c0-6.627 5.373-12 12-12s12 5.373 12 12v2H10v-2z" />
            {/* Card lines */}
            <rect x="38" y="18" width="18" height="3" rx="1.5" />
            <rect x="38" y="26" width="18" height="3" rx="1.5" />
            <rect x="38" y="34" width="12" height="3" rx="1.5" />
          </svg>
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative"
        >
          <div className="bg-foreground text-background rounded-2xl px-8 py-5 text-center min-w-[280px] sm:min-w-[340px]">
            <p className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2">
              <span>🪪</span>
              <span>Hey! Tap Your Card{dots}</span>
            </p>
            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2.5 h-2.5 rounded-full bg-background/60"
                />
              ))}
            </div>
          </div>
          {/* Triangle pointer */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-t-[14px] border-l-transparent border-r-transparent border-t-foreground" />
        </motion.div>

        {/* Admin button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4"
        >
          <Link to="/login">
            <Button className="gradient-primary-bold text-primary-foreground rounded-full px-8 py-3 text-base font-bold shadow-lg hover:shadow-xl transition-shadow gap-2">
              <User className="w-5 h-5" />
              ADMIN
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedDisplay;
