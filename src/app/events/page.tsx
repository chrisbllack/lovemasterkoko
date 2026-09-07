import type { Metadata } from "next";
import Link from "next/link";
import { HOTEL, naira, whatsappLink, bookingMessage } from "@/lib/hotel";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Meetings & Events — Banky Hall",
  description:
    "Book Banky Hall for weddings, conferences, and corporate events in Ado-Ekiti. 300-seat air-conditioned banqueting hall with full staging and AV.",
  openGraph: {
    title: "Banky Hall — Events & Banqueting",
    description:
      "A 300-seat banqueting hall for grand weddings, corporate summits, and gala celebrations in Ado-Ekiti.",
    images: ["/images/BankyHall.jpg"],
  },
};

export default function EventsPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Events", url: "/events" },
  ];
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1b1b1b] dark:bg-[#0d0d0d]">
        <img src="/images/BankyHall.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] dark:from-[#0d0d0d] via-[#1b1b1b]/60 to-[#1b1b1b]/80" />
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Banqueting &amp; Events</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">Banky Hall</h1>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
        <div className="container-x max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
            <div className="space-y-5">
              <span className="eyebrow text-[var(--accent)]">300-Seat Capacity</span>
              <h2 className="font-display text-3xl text-[#222] dark:text-[#f4efe6]">A Venue for Every Occasion</h2>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">A versatile, fully air-conditioned 300-seat banqueting hall configured for grand weddings, corporate summits, AGMs, and gala celebrations in Ado-Ekiti.</p>
              <div className="space-y-3">
                {["Up to 300 seated guests", "Air-conditioned climate control", "Integrated audio/PA & staging", "Crystal chandeliers & drapery", "Bridal / VIP dressing suite", "Dedicated banquet coordination"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#666] dark:text-[#a8a29e]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shrink-0" /><span>{f}</span></div>
                ))}
              </div>
              <p className="font-display text-2xl text-[var(--accent)]">{naira(150000)} <span className="text-xs font-condensed text-stone-400">/ event</span></p>
            </div>
            <div className="overflow-hidden border border-[#ece6dd]"><img src="/images/BankyHall.jpg" alt="Banky Hall" className="w-full h-80 object-cover" /></div>
          </div>
          <div className="text-center">
            <a href={whatsappLink(`Hello, I would like to book Banky Hall for an event.`)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 text-xs font-condensed uppercase tracking-[0.16em] font-semibold hover:bg-[#20bd5a] transition-colors mr-3">
              <WhatsAppIcon className="h-4 w-4" />Inquire on WhatsApp
            </a>
            <a href={`tel:${HOTEL.phone}`} className="btn-gold px-6 py-3 text-xs">Call to Reserve</a>
          </div>
        </div>
      </section>
    </>
  );
}
