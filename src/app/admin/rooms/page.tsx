"use client";
import { useState, useRef } from "react";
import { ROOMS, naira } from "@/lib/hotel";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminRooms() {
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedSlugRef = useRef<string>("deluxe");

  const triggerUpload = (slug: string) => {
    selectedSlugRef.current = slug;
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const slug = selectedSlugRef.current;
    setUploadingSlug(slug);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("slug", slug);

      const res = await fetch("/api/upload-room-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Successfully uploaded ${files.length} photo(s) for ${slug}!`);
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } catch (err) {
      console.error("Admin upload failed:", err);
    } finally {
      setUploadingSlug(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#222] mb-1">Rooms Management</h1>
          <p className="text-sm text-[#666]">Manage room categories, actual photography, rates, and availability.</p>
        </div>
        {successMsg && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/*"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room) => (
          <div key={room.slug} className="bg-white border border-[#ece6dd] rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="relative h-44 w-full bg-stone-100">
              <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => triggerUpload(room.slug)}
                disabled={uploadingSlug === room.slug}
                className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-medium backdrop-blur-sm transition-all cursor-pointer shadow-md disabled:opacity-60"
                title={`Upload photos for ${room.name}`}
              >
                {uploadingSlug === room.slug ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Photos</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <Link href={`/rooms/${room.slug}`} className="font-display text-lg text-[#222] hover:text-[#fbb100] transition-colors">
                  {room.name}
                </Link>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                  {room.qty} units
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-[#f3eee8]">
                <span className="text-[#666]">{room.occupancy}</span>
                <span className="font-display text-[#fbb100] font-semibold">{naira(room.rate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
