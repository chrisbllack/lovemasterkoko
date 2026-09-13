"use client";

import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RoomImageSliderProps {
  images: string[];
  alt: string;
  aspectClass?: string;
  autoSlideInterval?: number; // ms, default 6000 (6 seconds)
  showControls?: boolean;
}

export const RoomImageSlider = memo(function RoomImageSlider({
  images,
  alt,
  aspectClass = "aspect-[16/13.5]",
  autoSlideInterval = 6000,
  showControls = true,
}: RoomImageSliderProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const total = images.length;
  const isMulti = total > 1;

  const next = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setCurrentIdx((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Slow auto-sliding when multiple images exist
  useEffect(() => {
    if (!isMulti || isHovered) return;
    const timer = setInterval(next, autoSlideInterval);
    return () => clearInterval(timer);
  }, [isMulti, isHovered, next, autoSlideInterval]);

  if (!isMulti) {
    return (
      <div className={`overflow-hidden relative w-full ${aspectClass}`}>
        <Image
          src={images[0] || "/images/hero.jpg"}
          alt={alt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden relative w-full select-none ${aspectClass}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides with slow, graceful crossfade */}
      {images.map((img, idx) => {
        const isActive = idx === currentIdx;
        const safeSrc = encodeURI(img);
        return (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={safeSrc}
              alt={`${alt} — Photo ${idx + 1}`}
              fill
              className={`object-cover transition-transform duration-[6500ms] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={idx === 0}
            />
          </div>
        );
      })}

      {/* Subtle photo counter badge for suites with multiple views */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-condensed uppercase tracking-wider font-semibold bg-black/60 backdrop-blur-sm text-white/90 border border-white/15">
          {currentIdx + 1} / {total} Photos
        </span>
      </div>

      {/* Manual Prev / Next Controls (Click stops navigation to room link) */}
      {showControls && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-black/50 hover:bg-black/80 text-white/90 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-7 w-7 rounded-full bg-black/50 hover:bg-black/80 text-white/90 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-2.5 inset-x-0 z-20 flex items-center justify-center gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentIdx(idx);
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIdx
                ? "w-5 h-1.5 bg-[var(--accent)]"
                : "w-1.5 h-1.5 bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
});
