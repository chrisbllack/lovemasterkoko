"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { HOTEL } from "@/lib/hotel";

/* ------------------------------------------------------------------ */
/*  Dynamic imports — below-fold sections load only when scrolled to    */
/* ------------------------------------------------------------------ */
const AboutSection = dynamic(() => import("@/components/home/sections").then((m) => m.AboutSection), { loading: () => <div className="h-96" /> });
const RoomsSection = dynamic(() => import("@/components/home/sections").then((m) => m.RoomsSection), { loading: () => <div className="h-96" /> });
const FacilitiesSection = dynamic(() => import("@/components/home/sections").then((m) => m.FacilitiesSection), { loading: () => <div className="h-96" /> });
const ExperiencesSection = dynamic(() => import("@/components/home/sections").then((m) => m.ExperiencesSection), { loading: () => <div className="h-96" /> });
const GallerySection = dynamic(() => import("@/components/home/sections").then((m) => m.GallerySection), { loading: () => <div className="h-96" /> });
const TestimonialsSection = dynamic(() => import("@/components/home/sections").then((m) => m.TestimonialsSection), { loading: () => <div className="h-96" /> });
const FaqSection = dynamic(() => import("@/components/home/sections").then((m) => m.FaqSection), { loading: () => <div className="h-96" /> });
const CtaSection = dynamic(() => import("@/components/home/sections").then((m) => m.CtaSection), { loading: () => <div className="h-64" /> });

/* ------------------------------------------------------------------ */
/*  Hero slides — every unique hotel image                             */
/* ------------------------------------------------------------------ */
const HERO_SLIDES = [
  { src: "/images/hero.jpg",                caption: "Welcome to Banky Hotel & Suites" },
  { src: "/images/hotel-front-left.jpg",    caption: "Elegant facade in the heart of Ado-Ekiti" },
  { src: "/images/hotel-front-right.jpg",   caption: "Where luxury meets Ekiti warmth" },
  { src: "/images/Reception.jpg",           caption: "Grand reception & concierge" },
  { src: "/images/Reception1.jpg",          caption: "Arrive in style" },
  { src: "/images/Hotel Lobby.jpg",         caption: "Elegant lobby & lounge areas" },
  { src: "/images/lobby.jpg",               caption: "Refined interiors throughout" },
  { src: "/images/corridor-hallway.jpg",    caption: "Impeccably kept corridors" },
  { src: "/images/corridor-hallway-2.jpg",  caption: "Every detail, considered" },
  { src: "/images/Signature Suite.jpg",     caption: "Signature Suite — our finest residence" },
  { src: "/images/Diplomatic Suite.jpg",    caption: "Presidential Suite — stately luxury" },
  { src: "/images/Super Executive.jpg",     caption: "Super Executive — generous proportions" },
  { src: "/images/Executive Suite.jpg",     caption: "Executive — built for productivity" },
  { src: "/images/executive-room.jpg",      caption: "Warm timber & crisp linen" },
  { src: "/images/Standard Plus.jpg",       caption: "Standard Plus — elevated comfort" },
  { src: "/images/Duluxe.jpg",              caption: "Deluxe — garden-facing calm" },
  { src: "/images/Suite1.jpg",              caption: "Studio — designed for longer stays" },
  { src: "/images/Standard room.jpg",       caption: "Standard — bright & impeccably kept" },
  { src: "/images/room-suite.jpg",          caption: "Thoughtfully appointed rooms" },
  { src: "/images/room-standard.jpg",       caption: "Everything you need, nothing you don't" },
  { src: "/images/OpenBar Garden.jpg",      caption: "Open-air garden bar & sitout" },
  { src: "/images/OpenBar Garden 2.jpg",    caption: "Relax under open skies" },
  { src: "/images/OpenBar Garden 3.jpg",    caption: "Private garden courtyard" },
  { src: "/images/OpenBar sitout.jpg",      caption: "Evening cocktails in the garden" },
  { src: "/images/open air bar sitout.jpg", caption: "Al fresco dining & drinks" },
  { src: "/images/Ballard Table.jpg",       caption: "Intimate seating under the stars" },
  { src: "/images/lounge.jpg",              caption: "Unwind in style" },
  { src: "/images/lounge-bar.jpg",          caption: "Crafted cocktails & fine spirits" },
  { src: "/images/dining.jpg",              caption: "Fine dining restaurant" },
  { src: "/images/Restaurant 2.jpg",        caption: "A feast for the senses" },
  { src: "/images/events-hall.jpg",         caption: "300-seat Banky Hall" },
  { src: "/images/BankyHall.jpg",           caption: "Celebrations & conferences" },
];

/* ------------------------------------------------------------------ */
/*  Hero Slideshow                                                     */
/* ------------------------------------------------------------------ */
function HeroSlideshow() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HERO_SLIDES.length;

  const next = useCallback(() => setIdx((p) => (p + 1) % total), [total]);
  const prev = useCallback(() => setIdx((p) => (p - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      className="absolute inset-0 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — first 2 eagerly loaded, rest lazy */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <img
            src={slide.src}
            alt=""
            loading={i < 2 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      {/* Slide counter + caption */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-start justify-center pt-[18vh] sm:pt-[22vh]">
        <div className="text-center px-6">
          <p className="font-condensed text-[0.55rem] sm:text-[0.65rem] text-white/40 mb-1">
            {idx + 1} / {total}
          </p>
          <p
            key={idx}
            className="font-condensed text-[0.65rem] sm:text-xs uppercase tracking-[0.35em] text-[var(--accent)] font-semibold animate-fade-in"
          >
            {HERO_SLIDES[idx].caption}
          </p>
        </div>
      </div>

      {/* Navigation arrows - desktop only */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 hidden sm:flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)]"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 h-10 w-10 sm:h-12 sm:w-12 hidden sm:flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--accent)] hover:border-[var(--accent)]"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Progress bar + pause indicator - desktop only */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-40 hidden sm:flex items-center justify-center gap-3">
        <span className="text-white/30">
          {paused ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </span>
        <div className="w-48 h-1 bg-white/15 rounded-full overflow-hidden">
          <div
            key={idx}
            className="h-full bg-[var(--accent)] rounded-full"
            style={{ animation: paused ? "none" : `shrinkBar 5s linear` }}
          />
        </div>
        <span className="font-condensed text-[0.6rem] text-white/30 tabular-nums">
          {idx + 1}/{total}
        </span>
      </div>

      <style jsx>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function Home() {
  return (
    <>
      {/* HERO — critical, inlined */}
      <section className="relative min-h-[95svh] sm:min-h-[100svh] w-full overflow-hidden flex flex-col justify-end">
        <HeroSlideshow />
        <div className="container-x relative z-30 flex flex-col justify-end pt-28 pb-8 sm:pb-12">
          <div className="max-w-3xl pb-6 sm:pb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display text-white leading-[1.1]">
              Quiet luxury in the heart of Ado-Ekiti
            </h1>
            <p className="mt-3 sm:mt-5 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed text-stone-200">
              Twenty-eight appointed residences, an open-air garden sitout, and a master chef&apos;s table of Nigerian &amp; continental delicacies — held together by hospitality that remembers your name.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link href="/booking" className="btn-gold px-8 py-4 text-xs inline-flex items-center gap-2.5 shadow-lg shadow-[var(--accent)]/20">
                <span>Book Now</span><ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/rooms" className="btn-outline-white px-8 py-4 text-xs hidden sm:inline-flex items-center gap-2">
                <span>Explore All Suites</span>
              </Link>
              <a href={`tel:${HOTEL.phone}`} className="inline-flex items-center gap-2 text-xs font-condensed uppercase tracking-wider text-stone-300 hover:text-[var(--accent)] transition-colors ml-2">
                <PhoneSolidIcon className="h-3.5 w-3.5 text-[var(--accent)]" /><span>+234 704 700 4816</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BELOW-FOLD — dynamically split into separate chunks */}
      <AboutSection />
      <RoomsSection />
      <FacilitiesSection />
      <ExperiencesSection />
      <GallerySection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
