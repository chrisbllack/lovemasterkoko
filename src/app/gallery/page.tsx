"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = { src: string; alt: string; category: string };

const GALLERY: GalleryItem[] = [
  // Lobby & Reception
  { src: "/images/Hotel Lobby.jpg", alt: "Hotel lobby with chandelier", category: "Lobby & Reception" },
  { src: "/images/lobby.jpg", alt: "Refined lobby interiors", category: "Lobby & Reception" },
  { src: "/images/Reception.jpg", alt: "Grand reception desk", category: "Lobby & Reception" },
  { src: "/images/Reception1.jpg", alt: "Reception area", category: "Lobby & Reception" },
  { src: "/images/corridor-hallway.jpg", alt: "Elegant corridors", category: "Lobby & Reception" },
  { src: "/images/corridor-hallway-2.jpg", alt: "Hallway details", category: "Lobby & Reception" },

  // Rooms & Suites
  { src: "/images/room-suite.jpg", alt: "Suite room interior", category: "Rooms & Suites" },
  { src: "/images/room-standard.jpg", alt: "Standard room", category: "Rooms & Suites" },
  { src: "/images/Signature Suite.jpg", alt: "Signature Suite", category: "Rooms & Suites" },
  { src: "/images/Diplomatic Suite.jpg", alt: "Diplomatic Suite", category: "Rooms & Suites" },
  { src: "/images/Super Executive.jpg", alt: "Super Executive room", category: "Rooms & Suites" },
  { src: "/images/Executive Suite.jpg", alt: "Executive Suite", category: "Rooms & Suites" },
  { src: "/images/executive-room.jpg", alt: "Executive room", category: "Rooms & Suites" },
  { src: "/images/Standard Plus.jpg", alt: "Standard Plus room", category: "Rooms & Suites" },
  { src: "/images/Duluxe.jpg", alt: "Deluxe room", category: "Rooms & Suites" },
  { src: "/images/Suite1.jpg", alt: "Studio suite", category: "Rooms & Suites" },
  { src: "/images/Standard room.jpg", alt: "Standard room", category: "Rooms & Suites" },

  // Dining & Bar
  { src: "/images/dining.jpg", alt: "Fine dining restaurant", category: "Dining & Bar" },
  { src: "/images/Restaurant 2.jpg", alt: "Restaurant setting", category: "Dining & Bar" },
  { src: "/images/lounge.jpg", alt: "Lounge area", category: "Dining & Bar" },
  { src: "/images/lounge-bar.jpg", alt: "Bar and cocktails", category: "Dining & Bar" },

  // Garden & Outdoor
  { src: "/images/OpenBar Garden.jpg", alt: "Open-air garden bar", category: "Garden & Outdoor" },
  { src: "/images/OpenBar Garden 2.jpg", alt: "Garden courtyard", category: "Garden & Outdoor" },
  { src: "/images/OpenBar Garden 3.jpg", alt: "Private garden area", category: "Garden & Outdoor" },
  { src: "/images/OpenBar sitout.jpg", alt: "Evening garden sitout", category: "Garden & Outdoor" },
  { src: "/images/open air bar sitout.jpg", alt: "Al fresco dining", category: "Garden & Outdoor" },
  { src: "/images/Ballard Table.jpg", alt: "Outdoor seating", category: "Garden & Outdoor" },

  // Events & Banqueting
  { src: "/images/events-hall.jpg", alt: "Banky Hall events venue", category: "Events & Banqueting" },
  { src: "/images/BankyHall.jpg", alt: "Banky Hall function room", category: "Events & Banqueting" },
];

const CATEGORIES = ["All", ...Array.from(new Set(GALLERY.map((g) => g.category)))];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);
  const lightboxItem = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  const nextImg = useCallback(() => {
    setLightboxIdx((p) => (p !== null ? (p + 1) % filtered.length : null));
  }, [filtered.length]);

  const prevImg = useCallback(() => {
    setLightboxIdx((p) => (p !== null ? (p - 1 + filtered.length) % filtered.length : null));
  }, [filtered.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, nextImg, prevImg]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1b1b1b] dark:bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b1b] dark:from-[#0d0d0d] via-[#1b1b1b]/80 to-[#1b1b1b]" />
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Visual Tour</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">Photo Gallery</h1>
          <p className="mt-4 text-sm text-stone-400 max-w-lg mx-auto">
            Explore Banky Hotel &amp; Suites through our curated collection — {GALLERY.length} photos across {CATEGORIES.length - 1} categories.
          </p>
        </div>
      </section>

      {/* Gallery with categories */}
      <section className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
        <div className="container-x">
          {/* Category tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActive(cat); setLightboxIdx(null); }}
                className={`px-4 py-2 text-xs font-condensed uppercase tracking-wider transition-all duration-300 border ${
                  active === cat
                    ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                    : "border-[#ece6dd] dark:border-[#2e2b26] text-[#666] dark:text-[#a8a29e] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Image count */}
          <p className="text-center text-xs text-[#999] dark:text-[#666] mb-8">
            Showing {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
          </p>

          {/* Masonry grid */}
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((item, i) => (
              <button
                key={item.src}
                onClick={() => setLightboxIdx(i)}
                className="break-inside-avoid overflow-hidden border border-[#ece6dd] dark:border-[#2e2b26] group cursor-pointer block w-full text-left"
              >
                <div className="relative">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
                    <span className="text-white text-xs font-condensed uppercase tracking-wider">{item.category}</span>
                    <span className="text-[var(--accent)] text-[0.65rem] font-condensed">View</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/booking" className="btn-gold px-9 py-4 text-xs inline-flex items-center gap-2">
              Book Your Stay
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIdx(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 z-[110] h-10 w-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImg(); }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-[110] h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); nextImg(); }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[110] h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center border border-white/20 bg-black/40 backdrop-blur-sm text-white hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Image */}
          <div className="max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="mt-3 text-center">
              <p className="text-white text-sm font-display">{lightboxItem.alt}</p>
              <p className="text-white/40 text-xs mt-1">
                {lightboxItem.category} &middot; {lightboxIdx! + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
