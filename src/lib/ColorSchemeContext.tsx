"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type ColorScheme = "gold" | "navy";

interface ColorSchemeContextValue {
  scheme: ColorScheme;
  setScheme: (s: ColorScheme) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  scheme: "gold",
  setScheme: () => {},
});

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}

export function ColorSchemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>("gold");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("banky-color-scheme") as ColorScheme | null;
      if (saved === "navy" || saved === "gold") {
        setSchemeState(saved);
        document.documentElement.setAttribute("data-scheme", saved);
      } else {
        document.documentElement.setAttribute("data-scheme", "gold");
      }
    } catch {
      document.documentElement.setAttribute("data-scheme", "gold");
    }
  }, []);

  const setScheme = useCallback((s: ColorScheme) => {
    setSchemeState(s);
    document.documentElement.setAttribute("data-scheme", s);
    try {
      localStorage.setItem("banky-color-scheme", s);
    } catch {}
  }, []);

  // Sync attribute on re-render
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-scheme", scheme);
    }
  }, [scheme, mounted]);

  return (
    <ColorSchemeContext.Provider value={{ scheme, setScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}
