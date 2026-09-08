"use client";
import { useTheme } from "@/lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="hidden lg:flex fixed bottom-6 left-6 z-40 h-10 w-10 rounded-full border border-[#ece6dd] dark:border-white/10 bg-white dark:bg-[#222] text-[#aa8453] items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl hover:border-[#aa8453]"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
