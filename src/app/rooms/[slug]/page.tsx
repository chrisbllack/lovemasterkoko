"use client";
import { use, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ROOMS, HOTEL, naira, whatsappLink, bookingMessage } from "@/lib/hotel";
import { ArrowRight, Check, Play, Pause, Volume2, VolumeX, Upload, Sparkles } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { RoomSchema } from "@/components/seo/StructuredData";
import { RoomImageSlider } from "@/components/common/RoomImageSlider";

export default function RoomDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const room = ROOMS.find((r) => r.slug === slug) || ROOMS[0]!;

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [customVideoSrc, setCustomVideoSrc] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<string[] | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Reduced speed by 50% from 0.65x down to ~0.33x for ultra-smooth luxurious slow motion
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.33);

  const defaultRoomImages = room.images && room.images.length > 0 ? room.images : [room.image];
  const roomImages = customImages && customImages.length > 0 ? customImages : defaultRoomImages;
  const [activeHeaderImgIdx, setActiveHeaderImgIdx] = useState(0);

  const isExecutive = room.slug === "executive";
  const defaultVideo = isExecutive ? "/videos/executive-room.mp4" : room.video;
  const activeVideoSrc = customVideoSrc || defaultVideo;
  const hasVideo = Boolean(activeVideoSrc);

  // Smooth, slow crossfade every 6 seconds for rooms with multiple views and no video
  useEffect(() => {
    if (hasVideo || roomImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveHeaderImgIdx((prev) => (prev + 1) % roomImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [hasVideo, roomImages.length]);

  const applySpeed = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      videoRef.current.defaultPlaybackRate = rate;
      // Preserve pitch for audio playback if unmuted
      if ("preservesPitch" in videoRef.current) {
        (videoRef.current as HTMLVideoElement & { preservesPitch: boolean }).preservesPitch = true;
      }
    }
  };

  useEffect(() => {
    if (videoRef.current && hasVideo) {
      applySpeed(playbackSpeed);
    }
  }, [activeVideoSrc, hasVideo, videoLoaded, playbackSpeed]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const speeds = [0.25, 0.33, 0.5, 0.75, 1];
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const next = speeds[nextIdx] ?? 0.33;
    setPlaybackSpeed(next);
    applySpeed(next);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("slug", room.slug);

      const res = await fetch("/api/upload-room-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.urls && data.urls.length > 0) {
        const freshUrls = data.urls.map((u: string) => `${u}?t=${Date.now()}`);
        setCustomImages(freshUrls);
        setActiveHeaderImgIdx(0);
        setUploadSuccessMessage(data.message || `Loaded ${data.urls.length} actual photo(s)`);
        setTimeout(() => setUploadSuccessMessage(null), 6000);
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slug", room.slug);

      const res = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        // Bust cache so new video reloads instantly
        setCustomVideoSrc(`${data.url}?t=${Date.now()}`);
        setVideoLoaded(false);
      }
    } catch (err) {
      console.error("Video upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <RoomSchema slug={slug} />
      <section className="relative min-h-[440px] sm:min-h-[500px] md:min-h-[560px] pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#111111] overflow-hidden flex flex-col justify-end">
        {/* Background Video Header rendered in Landscape mode */}
        {hasVideo && (
          <video
            ref={videoRef}
            id="executive-room-header-video"
            src={activeVideoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onLoadedData={() => {
              setVideoLoaded(true);
              applySpeed(playbackSpeed);
            }}
            onPlay={() => {
              applySpeed(playbackSpeed);
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? "opacity-75" : "opacity-0"
            }`}
          />
        )}

        {/* Hero image presentation / multi-image smooth 6s slideshow */}
        {!hasVideo && roomImages.length > 1 ? (
          roomImages.map((img, idx) => {
            const isActive = idx === activeHeaderImgIdx;
            return (
              <div
                key={img}
                className={`absolute inset-0 overflow-hidden transition-opacity duration-[2000ms] ease-in-out ${
                  isActive ? "opacity-85 z-0" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  id={`room-header-slide-${idx}`}
                  src={encodeURI(img)}
                  alt={`${room.name} — View ${idx + 1}`}
                  className={`w-full h-full object-cover transition-transform duration-[6500ms] ease-out ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
            );
          })
        ) : (
          <img
            id="room-header-fallback-image"
            src={encodeURI(room.image)}
            alt={room.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              hasVideo && videoLoaded ? "opacity-25" : "opacity-80"
            }`}
          />
        )}

        {/* Cinematic dark film vignette & gradients to protect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-[#111111]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-[#111111]/70 pointer-events-none" />

        {/* Multi-image slideshow badge & photo upload button for rooms like Deluxe */}
        {!hasVideo && (
          <div className="absolute top-24 sm:top-28 right-4 sm:right-8 z-20 flex flex-wrap items-center gap-2">
            {roomImages.length > 1 && (
              <span
                id="gallery-slide-badge"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-condensed tracking-wider uppercase text-amber-300 font-medium shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Slides Every 6s ({activeHeaderImgIdx + 1}/{roomImages.length})</span>
              </span>
            )}
            {roomImages.length > 1 && (
              <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/15 px-2.5 py-1.5 rounded-full">
                {roomImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`View photo ${idx + 1}`}
                    onClick={() => setActiveHeaderImgIdx(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === activeHeaderImgIdx
                        ? "w-4 h-1.5 bg-[var(--accent)]"
                        : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              id="room-photo-upload-trigger"
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhotos}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/35 backdrop-blur-md border border-amber-400/40 text-[11px] sm:text-xs font-condensed tracking-wider uppercase text-amber-200 hover:text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
              title="Upload your actual room photos directly to this page"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{uploadingPhotos ? "Saving..." : "Upload Actual Photos"}</span>
            </button>

            <input
              ref={photoInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>
        )}

        {/* Upload success notification */}
        {uploadSuccessMessage && (
          <div className="absolute top-36 sm:top-40 right-4 sm:right-8 z-30 bg-emerald-900/90 text-emerald-100 text-xs px-3.5 py-2 rounded-lg border border-emerald-500/40 backdrop-blur-md shadow-lg animate-fadeIn">
            ✓ {uploadSuccessMessage}
          </div>
        )}

        {/* Video controls & Live status badge */}
        {hasVideo && (
          <div className="absolute top-24 sm:top-28 right-4 sm:right-8 z-20 flex flex-wrap items-center gap-2">
            <span
              id="video-live-badge"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-condensed tracking-wider uppercase text-amber-300 font-medium shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Video Header ({playbackSpeed}x Slow Speed)</span>
            </span>

            <button
              id="video-speed-toggle"
              type="button"
              onClick={cycleSpeed}
              aria-label={`Change playback speed, currently ${playbackSpeed}x`}
              className="px-2.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-[var(--accent-light)] text-[11px] sm:text-xs font-condensed tracking-wider uppercase font-semibold transition-colors shadow-sm"
              title="Toggle playback speed"
            >
              {playbackSpeed}x
            </button>

            <button
              id="video-playback-toggle"
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-[var(--accent-light)] transition-colors shadow-sm"
              title={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              id="video-audio-toggle"
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute Video" : "Mute Video"}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/15 text-white hover:text-[var(--accent-light)] transition-colors shadow-sm"
              title={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <button
              id="video-upload-trigger"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-condensed tracking-wider uppercase text-white transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              title="Upload new video file for this room"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{uploading ? "Uploading..." : "Replace Video"}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/*"
              className="hidden"
              onChange={handleVideoUpload}
            />
          </div>
        )}

        <div className="container-x relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/rooms" className="text-xs font-condensed uppercase tracking-wider font-medium text-stone-300 hover:text-[var(--accent-light)] transition-colors">Rooms & Suites</Link>
            <span className="text-stone-400">/</span>
            <span className="text-xs font-condensed uppercase tracking-wider font-medium text-[var(--accent-light)]">{room.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-white">{room.name}</h1>
            {hasVideo && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-condensed uppercase tracking-wider bg-[var(--accent)]/20 text-[var(--accent-light)] border border-[var(--accent)]/40 font-medium">
                <Sparkles className="h-3 w-3" /> Video Tour
              </span>
            )}
          </div>
          <p className="text-base sm:text-lg text-stone-100 font-normal max-w-2xl">{room.blurb}</p>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-white dark:bg-[#202023]">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-[#ece6dd] dark:border-[#3a3a42] mb-4 shadow-md">
                <RoomImageSlider
                  images={roomImages}
                  alt={room.name}
                  aspectClass="aspect-[16/10]"
                  autoSlideInterval={6000}
                />
              </div>

              {roomImages.length > 1 && (
                <div className="mb-8 grid grid-cols-2 gap-3">
                  {roomImages.map((img, idx) => (
                    <div
                      key={img}
                      className="group relative overflow-hidden rounded-xl border border-[#ece6dd] dark:border-[#3a3a42] bg-stone-100 dark:bg-stone-800 transition-all hover:border-[var(--accent)]"
                    >
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img
                          src={encodeURI(img)}
                          alt={`${room.name} Photo ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-condensed uppercase tracking-wider bg-black/70 text-white font-medium backdrop-blur-sm">
                          Photo {idx + 1}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-[#28282d] border-t border-[#ece6dd] dark:border-[#3a3a42]">
                        <p className="text-xs font-medium text-stone-800 dark:text-stone-200 truncate">
                          {idx === 0 ? "King Bed & Ambient Mood Lighting" : "Media Wall, Desk & Wardrobe Suite"}
                        </p>
                        <p className="text-[10px] text-stone-600 dark:text-stone-300 font-mono mt-0.5">
                          {img.replace("/images/", "")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h2 className="font-display text-3xl font-normal text-stone-900 dark:text-white mb-4">About This Room</h2>
              <p className="text-base leading-relaxed text-stone-700 dark:text-stone-200 font-normal mb-8">{room.blurb}</p>
              <h3 className="font-display text-2xl font-normal text-stone-900 dark:text-white mb-4">Room Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm sm:text-base font-normal text-stone-800 dark:text-stone-100">
                    <Check className="h-4 w-4 text-[var(--accent)] shrink-0" /><span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-2xl border border-[#ece6dd] dark:border-[#3a3a42] bg-white dark:bg-[#28282d] p-8 shadow-md">
                <div className="text-center mb-6">
                  <span className="eyebrow text-[var(--accent)] block mb-1">Starting from</span>
                  <span className="font-display text-4xl font-normal text-[var(--accent)]">{naira(room.rate)}</span>
                  <span className="text-xs font-condensed uppercase font-normal text-stone-600 dark:text-stone-300 block mt-1">per night</span>
                </div>
                <div className="space-y-3 mb-6 text-sm sm:text-base font-normal">
                  <div className="flex justify-between py-2.5 border-b border-[#ece6dd] dark:border-[#2e2b26]"><span className="text-stone-600 dark:text-stone-300 font-normal">Occupancy</span><span className="font-medium text-stone-900 dark:text-white">{room.occupancy}</span></div>
                  <div className="flex justify-between py-2.5 border-b border-[#ece6dd] dark:border-[#2e2b26]"><span className="text-stone-600 dark:text-stone-300 font-normal">Check-in</span><span className="font-medium text-stone-900 dark:text-white">{HOTEL.checkIn}</span></div>
                  <div className="flex justify-between py-2.5"><span className="text-stone-600 dark:text-stone-300 font-normal">Check-out</span><span className="font-medium text-stone-900 dark:text-white">{HOTEL.checkOut}</span></div>
                </div>
                <Link href={`/booking?room=${room.slug}`} className="btn-gold w-full py-4 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 mb-3 shadow-md">
                  <span>Book This Room</span><ArrowRight className="h-4 w-4" />
                </Link>
                <a href={whatsappLink(bookingMessage({ room: room.name, rate: room.rate }))} target="_blank" rel="noreferrer" className="w-full py-4 text-xs sm:text-sm inline-flex items-center justify-center gap-2 border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all font-condensed uppercase tracking-[0.18em] font-medium">
                  <span>WhatsApp Inquiry</span>
                </a>
                <a href={`tel:${HOTEL.phone}`} className="flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-200 hover:text-[var(--accent)] transition-colors">
                  <PhoneSolidIcon className="h-4 w-4 text-[var(--accent)]" /><span>Call to Reserve: {HOTEL.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
