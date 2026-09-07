import type { Metadata } from "next";
import Link from "next/link";
import { HOTEL } from "@/lib/hotel";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Banky Hotel & Suites — a four-star luxury hotel in Ado-Ekiti with 28 rooms, fine dining, and a 300-seat event hall.",
  openGraph: {
    title: "About Banky Hotel & Suites",
    description:
      "A sanctuary of calm in Ekiti State with 28 bespoke rooms, authentic culinary artistry, and gracious hospitality.",
    images: ["/images/hero-exterior.jpg"],
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ];
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1b1b1b] dark:bg-[#0d0d0d]">
        <img src="/images/Hotel Lobby.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] dark:from-[#0d0d0d] via-[#1b1b1b]/60 to-[#1b1b1b]/80" />
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">About Banky Hotel</h1>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-white dark:bg-[#121212]">
        <div className="container-x max-w-4xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
            <div className="space-y-5">
              <span className="eyebrow text-[var(--accent)]">Since 2019</span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#222] dark:text-[#f4efe6]">A Sanctuary of Calm in Ekiti State</h2>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">Banky Hotel &amp; Suites was conceived as a private sanctuary for discerning travellers who desire the polish of an international boutique hotel paired with the authentic warmth of Ekiti hospitality.</p>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">Our 28 bespoke rooms and suites feature orthopedic beds, quiet climate control, unbroken high-speed Wi-Fi, and 24/7 dedicated generator power grid. Every detail — from the curated art on the walls to the hand-pressed linen — has been chosen with care.</p>
            </div>
            <div className="overflow-hidden border border-[#ece6dd] shadow-lg">
              <img src="/images/hero-exterior.jpg" alt="Hotel Exterior" className="w-full h-80 object-cover" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 text-center py-12 border-y border-[#ece6dd] dark:border-[#2e2b26]">
            {[
              { num: "28", label: "Luxury Rooms" },
              { num: "300", label: "Seating Capacity" },
              { num: "24/7", label: "Power & Security" },
            ].map((s) => (
              <div key={s.label}>
                <span className="font-display text-4xl text-[var(--accent)] block mb-1">{s.num}</span>
                <span className="eyebrow text-[#666] dark:text-[#a8a29e]">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/booking" className="btn-gold px-9 py-4 text-xs inline-flex items-center gap-2">Book Your Stay</Link>
          </div>
        </div>
      </section>
    </>
  );
}
