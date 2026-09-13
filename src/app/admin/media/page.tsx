"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, CheckCircle2, Loader2, Image as ImageIcon, Sparkles, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ROOMS } from "@/lib/hotel";

interface UploadedFile {
  name: string;
  size: number;
  url: string;
  roomMatch?: string;
}

export default function AdminMediaPage() {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [recentUploads, setRecentUploads] = useState<UploadedFile[]>([]);
  const [refreshKey, setRefreshKey] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setStatusMessage(null);

    const formData = new FormData();
    const fileArray = Array.from(files);
    fileArray.forEach((f) => formData.append("files", f));

    try {
      const res = await fetch("/api/upload-room-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Successfully uploaded and saved ${fileArray.length} photo(s) to public/images/!`);
        const newUploads: UploadedFile[] = fileArray.map((f, i) => {
          let roomMatch: string | undefined = undefined;
          const upper = f.name.toUpperCase();
          if (upper.includes("DELUXE")) roomMatch = "Deluxe Room";
          else if (upper.includes("EXECUTIVE")) roomMatch = "Executive Suite";
          else if (upper.includes("STANDARD PLUS") || upper.includes("STANDAR PLUS")) roomMatch = "Standard Plus Room";
          else if (upper.includes("STANDARD")) roomMatch = "Standard Room";
          else if (upper.includes("2 PLUS") || upper.includes("WHITE")) roomMatch = "Brand Logo (White Silhouette)";
          else if (upper.includes("LOGO")) roomMatch = "Brand Logo Asset";
          return {
            name: f.name,
            size: f.size,
            url: data.urls?.[i] || `/images/${f.name}`,
            roomMatch,
          };
        });
        setRecentUploads((prev) => [...newUploads, ...prev]);
        setRefreshKey(Date.now());
      } else {
        setStatusMessage(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMessage("Failed to upload image files to server.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-stone-900 mb-1">Room Photography &amp; Media</h1>
          <p className="text-sm text-stone-600">
            Upload your actual room photos directly to the server&apos;s <code className="bg-stone-200 px-1.5 py-0.5 rounded text-xs font-mono">public/images</code> folder.
          </p>
        </div>
        <button
          onClick={() => setRefreshKey(Date.now())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 bg-white hover:bg-stone-50 text-xs font-medium self-start sm:self-auto transition-colors shadow-sm"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Previews</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm font-medium">{statusMessage}</p>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
          dragOver
            ? "border-[var(--accent)] bg-amber-500/10 scale-[1.01]"
            : "border-stone-300 hover:border-stone-400 bg-white shadow-sm"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[var(--accent)]">
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-[#ffbf00]" />
            )}
          </div>
          <div>
            <h3 className="font-display text-xl text-stone-900">
              {uploading ? "Saving files directly to public/images/..." : "Drag & Drop Image Files Directly Here"}
            </h3>
            <p className="text-sm text-stone-500 mt-1 max-w-lg mx-auto">
              Drop any original image files — room photography (<strong className="text-stone-700">DELUXE MAIN1.jpeg</strong>, <strong className="text-stone-700">Standard PLUS.jpeg</strong>) or official brand logos (<strong className="text-stone-700">Banky Hotel &amp; Suites Main Logo plus.png</strong>). Saved byte-for-byte directly into <code className="bg-stone-100 px-1 py-0.5 rounded text-xs font-mono">public/images/</code> with zero AI editing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-6 py-2.5 rounded-xl bg-[#1b1b1b] hover:bg-[#333] text-white font-condensed uppercase tracking-wider text-xs font-semibold shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {uploading ? "Processing..." : "Browse Local Files"}
          </button>
        </div>
      </div>

      {/* Brand Logos & Identity Section */}
      <div className="bg-white border border-[#ece6dd] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h2 className="font-display text-xl text-stone-900">Official Brand Logos &amp; Identity Assets</h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Direct master vector/raster files stored in <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">public/images/</code>. No AI alteration applied.
            </p>
          </div>
          <span className="text-xs text-stone-400 font-mono">Original Brand Marks</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Logo 1: Full Brand Logo */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">Full Brand Logo</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">Color + Text</span>
            </div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white border border-stone-200 p-3 flex items-center justify-center relative">
              <img
                src={`/images/Banky Hotel & Suites Main Logo plus..png?t=${refreshKey}`}
                alt="Banky Full Brand Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/banky-desktop-logo.png?t=${refreshKey}`;
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-stone-700 font-medium truncate" title="Banky Hotel & Suites Main Logo plus..png">
                Banky Hotel &amp; Suites Main Logo plus..png
              </p>
              <p className="text-[10px] text-stone-500">Towers + crescent arch + &quot;BANKY HOTEL &amp; SUITES&quot;</p>
            </div>
          </div>

          {/* Logo 2: Color Icon Mark */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">Architectural Mark</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">Color Icon</span>
            </div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white border border-stone-200 p-3 flex items-center justify-center relative">
              <img
                src={`/images/Banky Hotel & Suites Main Logo plus.png?t=${refreshKey}`}
                alt="Banky 3-Tower Icon Mark"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/Banky Hotel & Suites Main Logo 1.png?t=${refreshKey}`;
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-stone-700 font-medium truncate" title="Banky Hotel & Suites Main Logo plus.png">
                Banky Hotel &amp; Suites Main Logo plus.png
              </p>
              <p className="text-[10px] text-stone-500">Royal blue 3-tower skyline with golden horizon crescent</p>
            </div>
          </div>

          {/* Logo 3: White Silhouette Mark */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800">White Silhouette Mark</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-100 font-medium">Monochrome</span>
            </div>
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#14120f] border border-stone-800 p-3 flex items-center justify-center relative">
              <img
                src={`/images/Banky Hotel & Suites Main Logo 2 plus..png?t=${refreshKey}`}
                alt="Banky White Silhouette Logo"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/Banky Hotel & Suites Main Logo 2 plus.png?t=${refreshKey}`;
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-stone-700 font-medium truncate" title="Banky Hotel & Suites Main Logo 2 plus..png">
                Banky Hotel &amp; Suites Main Logo 2 plus..png
              </p>
              <p className="text-[10px] text-stone-500">Pure white silhouette mark for dark backdrops &amp; footer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Rooms Status */}
      <div>
        <h2 className="font-display text-xl text-stone-900 mb-4">Current Room Photo Status</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Deluxe Room Box */}
          <div className="bg-white border border-[#ece6dd] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-stone-900">Deluxe Room Suite</h3>
                <p className="text-xs text-stone-500">Auto-slides every 6s on /rooms/deluxe</p>
              </div>
              <Link
                href="/rooms/deluxe"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium"
              >
                <span>View Live Page</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/DELUXE MAIN1.jpeg?t=${refreshKey}`}
                    alt="Deluxe Main 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/deluxe.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN1
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">DELUXE MAIN1.jpeg</p>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/DELUXE MAIN2.jpeg?t=${refreshKey}`}
                    alt="Deluxe Main 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/deluxe.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN2
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">DELUXE MAIN2.jpeg</p>
              </div>
            </div>
          </div>

          {/* Executive Room Box */}
          <div className="bg-white border border-[#ece6dd] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-stone-900">Executive Suite</h3>
                <p className="text-xs text-stone-500">Auto-slides or switches with video tour</p>
              </div>
              <Link
                href="/rooms/executive"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium"
              >
                <span>View Live Page</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/EXECUTIVE Main.jpeg?t=${refreshKey}`}
                    alt="Executive Main"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/executive.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN1
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">EXECUTIVE Main.jpeg</p>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/EXECUTIVE MAIN2.jpeg?t=${refreshKey}`}
                    alt="Executive Main 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/executive.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN2
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">EXECUTIVE MAIN2.jpeg</p>
              </div>
            </div>
          </div>

          {/* Standard Plus Room Box */}
          <div className="bg-white border border-[#ece6dd] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-stone-900">Standard Plus Suite</h3>
                <p className="text-xs text-stone-500">Auto-slides smoothly every 6s on /rooms/standard-plus</p>
              </div>
              <Link
                href="/rooms/standard-plus"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium"
              >
                <span>View Live Page</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/Standard PLUS.jpeg?t=${refreshKey}`}
                    alt="Standard Plus 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/Standard Plus.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN1
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">Standard PLUS.jpeg</p>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/STANDARD PLUS MAIN .jpeg?t=${refreshKey}`}
                    alt="Standard Plus 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/STANDARD PLUS MAIN.jpeg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN2
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">STANDARD PLUS MAIN .jpeg</p>
              </div>
            </div>
          </div>

          {/* Standard Room Box */}
          <div className="bg-white border border-[#ece6dd] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-stone-900">Standard Room</h3>
                <p className="text-xs text-stone-500">Auto-slides smoothly every 6s on /rooms/standard</p>
              </div>
              <Link
                href="/rooms/standard"
                target="_blank"
                className="inline-flex items-center gap-1 text-xs text-[var(--accent)] hover:underline font-medium"
              >
                <span>View Live Page</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/Standard room.jpg?t=${refreshKey}`}
                    alt="Standard Room 1"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/Standard roomx.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN1
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">Standard room.jpg</p>
              </div>

              <div className="space-y-1.5">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative">
                  <img
                    src={`/images/standard.jpg?t=${refreshKey}`}
                    alt="Standard Room 2"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/Standard room.jpg";
                    }}
                  />
                  <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    MAIN2
                  </span>
                </div>
                <p className="text-[11px] font-mono text-stone-600 truncate">standard.jpg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      {recentUploads.length > 0 && (
        <div className="bg-white border border-[#ece6dd] rounded-2xl p-6 shadow-sm">
          <h3 className="font-display text-lg text-stone-900 mb-4">Files Saved in this Session</h3>
          <div className="divide-y divide-stone-100">
            {recentUploads.map((f, i) => (
              <div key={i} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img src={`${f.url}?t=${refreshKey}`} alt={f.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-stone-900">{f.name}</p>
                    <p className="text-xs text-stone-500">{(f.size / 1024).toFixed(1)} KB {f.roomMatch && `· Mapped to ${f.roomMatch}`}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Saved in public/images
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
