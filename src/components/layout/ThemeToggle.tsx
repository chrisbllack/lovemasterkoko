"use client";
import { useTheme } from "@/lib/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme, watTimeString } = useTheme();

  const titleText = theme === "light"
    ? `Switch to night mode · Lagos auto-schedule (07:00 PM – 06:59 AM WAT)${watTimeString ? ` · Current: ${watTimeString}` : ""}`
    : `Switch to day mode · Lagos auto-schedule (07:00 AM – 06:59 PM WAT)${watTimeString ? ` · Current: ${watTimeString}` : ""}`;

  return (
    <button
      onClick={toggleTheme}
      aria-label={titleText}
      title={titleText}
      className="hidden lg:flex fixed bottom-6 left-6 z-40 h-10 w-10 rounded-full border border-[#ece6dd] dark:border-[#3a3a42] bg-white dark:bg-[#28282d] text-[#fbb100] items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 hover:shadow-xl hover:border-[#fbb100]"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}
