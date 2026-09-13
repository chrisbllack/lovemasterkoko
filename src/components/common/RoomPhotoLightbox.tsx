"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";

interface RoomPhotoLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  roomName: string;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  onUploadClick?: () => void;
}

export function RoomPhotoLightbox({
  isOpen,
  images,
  currentIndex,
  roomName,
  onClose,
  onNavigate,
  onUploadClick,
}: RoomPhotoLightboxProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const total = images.length;
  const currentImg = images[currentIndex] || images[0] || "";

  // Reset zoom when switching images or closing
  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex, isOpen]);

  // Keyboard navigation & escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % total);
      } else if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + total) % total);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll when lightbox is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, currentIndex, total, onClose, onNavigate]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  if (!isOpen) return null;

  const getCleanFileName = (pathStr: string) => {
    try {
      const parts = pathStr.split("?")[0]?.split("/");
      return parts ? parts[parts.length - 1] || pathStr : pathStr;
    } catch {
      return pathStr;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="room-photo-lightbox-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${roomName} Photo Gallery Lightbox`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl text-white select-none"
      >
        {/* Top Control Bar */}
        <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 border-b border-white/10 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
              <ImageIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-medium text-white truncate">{roomName}</h3>
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-condensed tracking-wider bg-white/10 text-amber-300 border border-white/15">
                  {currentIndex + 1} / {total}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono truncate max-w-xs sm:max-w-md">
                {getCleanFileName(currentImg)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {onUploadClick && (
              <button
                type="button"
                onClick={onUploadClick}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-condensed tracking-wider uppercase transition-colors"
                title="Upload photos to this room"
              >
                <span>Upload Photos</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsZoomed((prev) => !prev)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title={isZoomed ? "Reset Zoom" : "Zoom In (1.5x)"}
              aria-label={isZoomed ? "Reset Zoom" : "Zoom In"}
            >
              {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:inline-flex p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            <a
              href={encodeURI(currentImg)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors"
              title="Open raw high-res image in new tab"
              aria-label="Open high-res image in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              id="lightbox-close-button"
              type="button"
              onClick={onClose}
              className="p-2 ml-1 rounded-full bg-white/15 hover:bg-red-500/80 text-white transition-colors"
              title="Close gallery (Esc)"
              aria-label="Close Lightbox Gallery"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Center Viewing Stage */}
        <main
          className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
          onClick={(e) => {
            // Close if clicking outside the image container
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          {/* Previous Arrow */}
          {total > 1 && (
            <button
              id="lightbox-prev-button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex - 1 + total) % total);
              }}
              aria-label="Previous image (Left Arrow)"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 hover:border-amber-400/50 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}

          {/* Active Image Display */}
          <div className="relative max-h-[72vh] sm:max-h-[76vh] max-w-[94vw] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImg}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <img
                  id="lightbox-active-image"
                  src={encodeURI(currentImg)}
                  alt={`${roomName} - View ${currentIndex + 1}`}
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className={`max-h-[70vh] sm:max-h-[75vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-transform duration-300 cursor-pointer ${
                    isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Arrow */}
          {total > 1 && (
            <button
              id="lightbox-next-button"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex + 1) % total);
              }}
              aria-label="Next image (Right Arrow)"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 hover:border-amber-400/50 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          )}
        </main>

        {/* Bottom Thumbnail Strip */}
        {total > 1 && (
          <footer className="shrink-0 px-4 sm:px-6 py-3 bg-black/60 border-t border-white/10 overflow-x-auto z-20">
            <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-full mx-auto">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => onNavigate(idx)}
                    aria-label={`Jump to image ${idx + 1}`}
                    className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-200 ${
                      isActive
                        ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-black scale-105 border-transparent"
                        : "opacity-60 hover:opacity-100 border border-white/20"
                    }`}
                  >
                    <div className="w-16 sm:w-20 aspect-[4/3]">
                      <img
                        src={encodeURI(img)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white/90">
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </footer>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
