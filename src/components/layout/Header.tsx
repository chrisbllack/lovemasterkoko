"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calendar, Sun, Moon } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { HOTEL } from "@/lib/hotel";
import { useTheme } from "@/lib/ThemeContext";
import { BankyLogo } from "@/components/common/BankyLogo";

const NAVY_PAGES = ["/rooms", "/dining", "/events", "/gallery", "/about", "/contact"];

const NAV = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/dining", label: "Restaurant & Bar" },
  { to: "/events", label: "Meetings & Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isNavyPage = NAVY_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const iconBtnColor = scrolled
    ? isNavyPage
      ? "text-white hover:text-[var(--accent-light)]"
      : theme === "dark"
      ? "text-[#f4efe6] hover:text-[var(--accent-light)]"
      : "text-[var(--text-primary)] hover:text-[var(--accent)]"
    : "text-white hover:text-[var(--accent-light)]";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div className={`transition-all duration-400 ${scrolled ? (isNavyPage ? "bg-[#0a2777] backdrop-blur-xl border-b border-[#0000dd]/20 shadow-sm" : (theme === "dark" ? "bg-[#161616]/95 backdrop-blur-xl border-b border-white/10 shadow-sm" : "bg-white/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm")) : "bg-transparent border-b border-transparent"}`}>
        <div className={`container-x flex items-center justify-between transition-all duration-300 ${scrolled ? "py-3" : "py-4 sm:py-5"}`}>
          {/* Left — Hamburger on mobile & tablet; Phone on desktop */}
          <div className="flex-1 flex items-center justify-start">
            {/* Mobile & Tablet: Hamburger menu icon at top-left with no border and no background */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className={`lg:hidden p-2 -ml-2 bg-transparent border-none shadow-none transition-transform active:scale-90 flex items-center justify-center cursor-pointer ${iconBtnColor}`}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop: Phone number */}
            <a
              href={`tel:${HOTEL.phone}`}
              className={`hidden lg:inline-flex items-center gap-2 font-condensed text-[0.76rem] tracking-[0.16em] uppercase font-medium py-1.5 px-3 ${scrolled ? (isNavyPage ? "text-white/90 hover:text-white" : (theme === "dark" ? "text-[#f4efe6] hover:text-[var(--accent-light)]" : "text-[var(--text-primary)] hover:text-[var(--accent)]")) : "text-white/90 hover:text-white"}`}
            >
              <PhoneSolidIcon className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
              <span>+234 903 587 9708</span>
            </a>
          </div>

          {/* Center — logo + brand name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
            <span className="relative shrink-0 flex items-center justify-center bg-transparent p-0 transition-transform duration-300 group-hover:scale-105 w-[68px] sm:w-[82px] h-[46px] sm:h-[54px]">
              {/* Logo 1: Banky Hotel & Suites Main Logo 1 (active on transparent navigation bar) */}
              <img
                src="/images/Banky Hotel & Suites Main Logo 1.png"
                alt="Banky Hotel & Suites Main Logo"
                className={`absolute inset-0 w-full h-full object-contain transition-all duration-350 ease-in-out ${
                  scrolled
                    ? "opacity-0 scale-95 pointer-events-none"
                    : "opacity-100 scale-100"
                }`}
              />

              {/* Logo 2: Solid logo (active when scrolled down after the header) */}
              <div
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-350 ease-in-out ${
                  scrolled
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <BankyLogo
                  className="w-full h-full object-contain transition-all duration-300"
                  variant={!isNavyPage && theme === "light" ? "dark" : "white"}
                />
              </div>
            </span>
            <div className="flex flex-col">
              <span className={`font-display text-xl sm:text-2xl md:text-3xl tracking-tight transition-colors leading-tight ${scrolled ? (isNavyPage ? "text-white" : (theme === "dark" ? "text-[#f4efe6]" : "text-[var(--text-primary)]")) : "text-white"}`}>
                Banky
              </span>
              <span className={`font-condensed text-[0.6rem] sm:text-[0.66rem] tracking-[0.26em] uppercase transition-opacity ${scrolled ? (isNavyPage ? "text-white/70" : (theme === "dark" ? "text-stone-400" : "text-stone-500")) : "text-white/85"}`}>
                Hotel &amp; Suites
              </span>
            </div>
          </Link>

          {/* Right — Day/Night toggle on mobile & tablet; Reserve + Day/Night + Menu on desktop */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
            {/* Mobile & Tablet Mode: Day or Night toggle button at the top-right */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className={`p-2 -mr-2 sm:mr-0 bg-transparent border-none shadow-none transition-transform active:scale-90 flex items-center justify-center cursor-pointer ${iconBtnColor}`}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            {/* Desktop: Reserve button */}
            <Link
              href="/booking"
              className="hidden lg:inline-flex rounded-none px-5 sm:px-6 py-2 sm:py-2.5 text-[0.76rem] font-condensed font-medium tracking-[0.22em] uppercase text-white transition-all min-h-[40px] items-center gap-1.5"
              style={{ backgroundColor: "var(--accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--accent-dark)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--accent)"}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Reserve Room</span>
            </Link>

            {/* Desktop: Menu button */}
            <button
              onClick={() => setOpen(!open)}
              className={`hidden lg:flex items-center gap-2 h-10 sm:h-11 px-3 sm:px-4 transition-all duration-300 active:scale-95 border ${scrolled ? (isNavyPage ? "bg-white/10 text-white border-white/20" : (theme === "dark" ? "bg-[#222] text-[#f4efe6] border-[#444]" : "bg-[var(--text-primary)] text-white border-[var(--text-primary)]")) : "bg-transparent text-white border-white/30 hover:bg-white/10"}`}
            >
              <span className="hidden sm:inline font-condensed text-xs uppercase tracking-[0.22em] font-medium">{open ? "Close" : "Menu"}</span>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-[#1b1b1b] text-white flex flex-col justify-between overflow-y-auto animate-fade-in">
          <div className="container-x py-4 sm:py-6 flex items-center justify-between border-b border-white/10 shrink-0">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <span className="shrink-0 flex items-center justify-center bg-transparent p-0">
                <BankyLogo
                  className="w-[68px] sm:w-[80px] h-auto"
                  variant="white"
                />
              </span>
              <div>
                <span className="font-display text-xl sm:text-2xl text-white block leading-tight font-normal">Banky Hotel &amp; Suites</span>
                <span className="font-condensed text-[0.62rem] tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>The Luxury Experience</span>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white transition-all" style={{ ["--tw-ring-opacity" as string]: "1" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="container-x py-8 sm:py-12 md:py-16 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-6" style={{ color: "var(--accent)" }}>
              <span className="h-px w-6" style={{ backgroundColor: "var(--accent)" }} />
              <span className="font-condensed text-xs uppercase tracking-[0.25em] font-medium">Navigation Menu</span>
            </div>
            <div className="space-y-2">
              {NAV.map((item, i) => (
                <Link key={item.to} href={item.to} onClick={() => setOpen(false)} className="flex items-center justify-between py-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-stone-200 hover:text-[var(--accent)] transition-all border-b border-white/5 hover:translate-x-2 group">
                  <span className="flex items-baseline gap-4">
                    <span className="font-condensed text-xs sm:text-sm tracking-[0.2em] opacity-60" style={{ color: "var(--accent)" }}>0{i + 1}.</span>
                    <span>{item.label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="container-x py-4 border-t border-white/10 flex justify-between items-center text-xs text-stone-400 shrink-0">
            <span>&copy; {new Date().getFullYear()} Banky Hotel &amp; Suites</span>
            <span className="font-condensed uppercase tracking-[0.2em]" style={{ color: "var(--accent)" }}>Four-Star Luxury Hotel &middot; Ado-Ekiti</span>
          </div>
        </div>
      )}
    </header>
  );
}
