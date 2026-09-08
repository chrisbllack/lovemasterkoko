"use client";
import { use } from "react";
import Link from "next/link";
import { ROOMS, HOTEL, naira, whatsappLink, bookingMessage, makeReference } from "@/lib/hotel";
import { ArrowRight, Check } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { RoomSchema } from "@/components/seo/StructuredData";

export default function RoomDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const room = ROOMS.find((r) => r.slug === slug) || ROOMS[0]!;
  const ref = makeReference();

  return (
    <>
      <RoomSchema slug={slug} />
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1b1b1b] dark:bg-[#0d0d0d]">
        <img src={room.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] dark:from-[#0d0d0d] via-[#1b1b1b]/60 to-[#1b1b1b]/80" />
        <div className="container-x relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/rooms" className="text-xs font-condensed uppercase tracking-wider font-bold text-stone-300 hover:text-[var(--accent-light)] transition-colors">Rooms & Suites</Link>
            <span className="text-stone-400">/</span>
            <span className="text-xs font-condensed uppercase tracking-wider font-bold text-[var(--accent-light)]">{room.name}</span>
          </div>
          <h1 className="font-display font-normal text-4xl sm:text-5xl md:text-6xl text-white mb-3">{room.name}</h1>
          <p className="text-base sm:text-lg text-stone-100 font-medium max-w-2xl">{room.blurb}</p>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-2xl border border-[#ece6dd] dark:border-[#2e2b26] mb-8 shadow-md">
                <img src={room.image} alt={room.name} className="w-full h-[400px] sm:h-[500px] object-cover" />
              </div>
              <h2 className="font-display text-3xl font-bold text-stone-900 dark:text-white mb-4">About This Room</h2>
              <p className="text-base leading-relaxed text-stone-700 dark:text-stone-200 font-medium mb-8">{room.blurb}</p>
              <h3 className="font-display text-2xl font-bold text-stone-900 dark:text-white mb-4">Room Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-stone-800 dark:text-stone-100">
                    <Check className="h-4 w-4 text-[var(--accent)] shrink-0" /><span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="sticky top-28 rounded-2xl border border-[#ece6dd] dark:border-[#2e2b26] bg-white dark:bg-[#1c1a17] p-8 shadow-md">
                <div className="text-center mb-6">
                  <span className="eyebrow text-[var(--accent)] block mb-1">Starting from</span>
                  <span className="font-display text-4xl font-bold text-[var(--accent)]">{naira(room.rate)}</span>
                  <span className="text-xs font-condensed uppercase font-bold text-stone-600 dark:text-stone-300 block mt-1">per night</span>
                </div>
                <div className="space-y-3 mb-6 text-sm sm:text-base">
                  <div className="flex justify-between py-2.5 border-b border-[#ece6dd] dark:border-[#2e2b26]"><span className="text-stone-600 dark:text-stone-300 font-medium">Bed Type</span><span className="font-bold text-stone-900 dark:text-white">{room.bed}</span></div>
                  <div className="flex justify-between py-2.5 border-b border-[#ece6dd] dark:border-[#2e2b26]"><span className="text-stone-600 dark:text-stone-300 font-medium">Occupancy</span><span className="font-bold text-stone-900 dark:text-white">{room.occupancy}</span></div>
                  <div className="flex justify-between py-2.5 border-b border-[#ece6dd] dark:border-[#2e2b26]"><span className="text-stone-600 dark:text-stone-300 font-medium">Check-in</span><span className="font-bold text-stone-900 dark:text-white">{HOTEL.checkIn}</span></div>
                  <div className="flex justify-between py-2.5"><span className="text-stone-600 dark:text-stone-300 font-medium">Check-out</span><span className="font-bold text-stone-900 dark:text-white">{HOTEL.checkOut}</span></div>
                </div>
                <Link href={`/booking?room=${room.slug}`} className="btn-gold w-full py-4 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 mb-3 shadow-md">
                  <span>Book This Room</span><ArrowRight className="h-4 w-4" />
                </Link>
                <a href={whatsappLink(bookingMessage({ room: room.name, rate: room.rate }))} target="_blank" rel="noreferrer" className="w-full py-4 text-xs sm:text-sm inline-flex items-center justify-center gap-2 border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all font-condensed uppercase tracking-[0.18em] font-bold">
                  <span>WhatsApp Inquiry</span>
                </a>
                <a href={`tel:${HOTEL.phone}`} className="flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-[var(--accent)] transition-colors">
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
