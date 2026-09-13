"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
  { src: "/images/corridor-hallway.jpg",    caption: "Impeccably kept corridors" },
  { src: "/images/corridor-hallway-2.jpg",  caption: "Every detail, considered" },
  { src: "/images/signature suite room.jpg", caption: "Signature Suite — our finest residence" },
  { src: "/images/Presidential.jpg",        caption: "Presidential Suite — stately luxury" },
  { src: "/images/Presidential1.jpg",       caption: "Presidential Suite — executive lounge & parlor" },
  { src: "/images/superexecutive.jpg",      caption: "Super Executive — generous proportions" },
  { src: "/images/executive.jpg",           caption: "Executive — built for productivity" },
  { src: "/images/Standard Plus.jpg",       caption: "Standard Plus — elevated comfort" },
  { src: "/images/Suite1.jpg",              caption: "Studio — designed for longer stays" },
  { src: "/images/Standard room.jpg",       caption: "Standard — bright & impeccably kept" },
  { src: "/images/OpenBar Garden.jpg",      caption: "Open-air garden bar & sit-out" },
  { src: "/images/OpenBar Garden 2.jpg",    caption: "Relax under open skies" },
  { src: "/images/OpenBar Garden 3.jpg",    caption: "Private garden courtyard" },
  { src: "/images/OpenBar sitout.jpg",      caption: "Evening cocktails in the garden" },
  { src: "/images/open air bar sitout.jpg", caption: "Al fresco dining & drinks" },
  { src: "/images/Ballard Table.jpg",       caption: "Billiards & evening recreation" },
  { src: "/images/lounge.jpg",              caption: "Unwind in style" },
  { src: "/images/dining.jpg",              caption: "Fine dining restaurant" },
  { src: "/images/Restaurant 2.jpg",        caption: "A feast for the senses" },
  { src: "/images/BankyHall.jpg",           caption: "300-seat Banky Hall for celebrations & conferences" },
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
            src={encodeURI(slide.src)}
            alt=""
            loading={i < 2 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

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
          <div className="max-w-3xl pb-6 sm:pb-8 mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-normal text-white leading-[1.1] text-center lg:text-left">
              Banky Hotel &amp; Suites
            </h1>
            <p className="mt-3 sm:mt-5 max-w-xl mx-auto lg:mx-0 text-[14px] leading-relaxed text-stone-100 font-normal text-center lg:text-left">
              Quiet luxury in the heart of Ado-Ekiti
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3.5">
              <Link href="/booking" className="btn-gold px-8 py-4 text-xs sm:text-sm inline-flex items-center gap-2.5 shadow-lg shadow-[var(--accent)]/30 font-medium">
                <span>Book Now</span><ArrowRight className="h-4 w-4" />
              </Link>
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
