"use client";
import Link from "next/link";
import { HOTEL, whatsappLink, bookingMessage } from "@/lib/hotel";
import { Mail, MapPin } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const LINKS = [
  { label: "Rooms & Suites", href: "/rooms" },
  { label: "Restaurant & Bar", href: "/dining" },
  { label: "Meetings & Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Reservations", href: "/booking" },
  { label: "FAQs", href: "/faqs" },
];

export function Footer() {
  return (
    <footer className="bg-[#0a2777] dark:bg-[#071d5a] text-white border-t" style={{ borderColor: "color-mix(in srgb, #0000dd 20%, transparent)" }}>
      <div className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img src="/images/banky-logo-gold.jpg" alt="Logo" className="h-12 w-12 rounded-full object-contain bg-white p-0.5" />
              <div>
                <span className="font-display text-2xl text-white block leading-tight font-normal">Banky</span>
                <span className="font-condensed text-[0.65rem] tracking-[0.25em] uppercase font-bold" style={{ color: "var(--accent-light)" }}>Hotel &amp; Suites</span>
              </div>
            </div>
            <p className="text-sm text-stone-200 font-medium leading-relaxed max-w-sm">
              A sanctuary of calm in Ekiti State. Twenty-eight appointed rooms and suites, authentic culinary artistry, and gracious hospitality.
            </p>
            <a href={whatsappLink(bookingMessage({}))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border text-white hover:text-white transition-all font-condensed tracking-[0.18em] uppercase text-xs py-3 px-6 rounded font-bold shadow-md" style={{ borderColor: "color-mix(in srgb, var(--accent) 60%, transparent)", backgroundColor: "var(--accent)" }}>
              <WhatsAppIcon className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-4">
            <h4 className="font-condensed text-xs uppercase tracking-[0.25em] font-bold mb-6" style={{ color: "var(--accent-light)" }}>Quick Links</h4>
            <div className="grid grid-cols-2 gap-3">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-stone-200 hover:text-white font-medium transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-5">
            <h4 className="font-condensed text-xs uppercase tracking-[0.25em] font-bold mb-6" style={{ color: "var(--accent-light)" }}>Contact</h4>
            <div className="space-y-4">
              <a href={`tel:${HOTEL.phone}`} className="flex items-start gap-3 text-sm text-stone-200 hover:text-white font-medium transition-colors">
                <PhoneSolidIcon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent-light)" }} />
                <span>{HOTEL.phone}</span>
              </a>
              <a href={`mailto:${HOTEL.email}`} className="flex items-start gap-3 text-sm text-stone-200 hover:text-white font-medium transition-colors">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent-light)" }} />
                <span className="break-all">{HOTEL.email}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-stone-200 font-medium">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--accent-light)" }} />
                <span>{HOTEL.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
        <div className="container-x flex flex-col sm:flex-row items-center justify-between text-xs text-stone-300 font-medium gap-2">
          <span>© {new Date().getFullYear()} Banky Hotel &amp; Suites. All Rights Reserved.</span>
          <span className="font-condensed uppercase tracking-[0.2em] font-bold" style={{ color: "var(--accent-light)" }}>Four-Star Luxury Hotel &middot; Ado-Ekiti</span>
        </div>
      </div>
    </footer>
  );
}
