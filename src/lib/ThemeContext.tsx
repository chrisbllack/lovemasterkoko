"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "light", toggleTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

/**
 * Returns the "auto" theme based on Nigerian time (WAT = UTC+1).
 * Light: 6:45 AM – 6:45 PM WAT
 * Dark:  6:45 PM – 6:45 AM WAT
 */
function getWATTheme(): Theme {
  const now = new Date();
  // Convert to WAT (UTC+1)
  const watHour = (now.getUTCHours() + 1) % 24;
  const watMin = now.getUTCMinutes();
  const minutesSinceMidnight = watHour * 60 + watMin;

  const lightStart = 6 * 60 + 45; // 6:45 AM
  const darkStart = 18 * 60 + 45;  // 6:45 PM

  if (minutesSinceMidnight >= lightStart && minutesSinceMidnight < darkStart) {
    return "light";
  }
  return "dark";
}

const STORAGE_KEY = "banky-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check for saved manual preference
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      // No saved preference — use WAT auto-detection
      setTheme(getWATTheme());
    }
    setMounted(true);

    // Re-check auto theme every 5 minutes if no manual override
    const interval = setInterval(() => {
      const savedPreference = localStorage.getItem(STORAGE_KEY);
      if (!savedPreference) {
        setTheme(getWATTheme());
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Prevent flash: render nothing until mounted to avoid SSR mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {} }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
