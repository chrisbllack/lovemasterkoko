"use client";
import { useColorScheme, type ColorScheme } from "@/lib/ColorSchemeContext";
import { Palette, RotateCcw } from "lucide-react";
import { useState } from "react";

const schemes: { id: ColorScheme; label: string; colors: string[] }[] = [
  { id: "navy", label: "Navy Blue", colors: ["#0a2777", "#0000dd", "#fbb100"] },
  { id: "gold", label: "Classic Gold", colors: ["#aa8453", "#c5a880", "#f4eee6"] },
];

export function ColorSchemeToggle() {
  const { scheme, setScheme } = useColorScheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 left-4 z-40">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-white dark:bg-[#1c1a17] border border-[#ece6dd] dark:border-[#2e2b26] shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 group"
        aria-label="Change color scheme"
        title="Change color scheme"
      >
        <Palette className="h-4 w-4 text-[#666] dark:text-[#a8a29e] group-hover:text-[var(--accent)] transition-colors" />
      </button>

      {/* Popup */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-14 left-0 z-50 w-64 rounded-xl bg-white dark:bg-[#1c1a17] border border-[#ece6dd] dark:border-[#2e2b26] shadow-2xl p-4 animate-rise">
            <div className="flex items-center justify-between mb-3">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-[#666] dark:text-[#a8a29e] font-semibold">
                Color Scheme
              </span>
              <button
                onClick={() => {
                  setScheme("gold");
                  setOpen(false);
                }}
                className="flex items-center gap-1 text-[0.65rem] text-[var(--accent)] hover:opacity-80 font-condensed uppercase tracking-wider"
                title="Restore default"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>

            <div className="space-y-2">
              {schemes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScheme(s.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 ${
                    scheme === s.id
                      ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                      : "border-transparent hover:border-[var(--border)] hover:bg-[var(--surface-alt)]"
                  }`}
                >
                  {/* Color swatches */}
                  <div className="flex gap-1 shrink-0">
                    {s.colors.map((c, i) => (
                      <div
                        key={i}
                        className="h-5 w-5 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="text-left flex-1">
                    <div className="text-sm font-medium text-[var(--text-primary)]">
                      {s.label}
                    </div>
                    <div className="text-[0.6rem] text-[var(--text-muted)] font-condensed uppercase tracking-wider">
                      {s.id === "navy" ? "70% Blue · 20% Gold" : "Original theme"}
                    </div>
                  </div>
                  {scheme === s.id && (
                    <div className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
