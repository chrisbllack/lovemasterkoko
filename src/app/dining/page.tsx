import type { Metadata } from "next";
import Link from "next/link";
import { whatsappLink } from "@/lib/hotel";
import { BreadcrumbSchema } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "Restaurant & Bar",
  description:
    "Fine dining restaurant and open-air bar at Banky Hotel & Suites in Ado-Ekiti. Nigerian classics, continental cuisine, and handcrafted cocktails.",
  openGraph: {
    title: "Restaurant & Bar — Banky Hotel & Suites",
    description:
      "Authentic Nigerian delicacies, continental plates, and handcrafted cocktails in a serene garden setting.",
    images: ["/images/dining.jpg"],
  },
};

export default function DiningPage() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Dining", url: "/dining" },
  ];
  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 bg-[#1b1b1b] dark:bg-[#1a1a1d]">
        <img src="/images/dining.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b] dark:from-[#202023] via-[#1b1b1b]/60 to-[#1b1b1b]/80" />
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Culinary Experience</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white">Restaurant &amp; Bar</h1>
        </div>
      </section>
      <section className="py-16 sm:py-24 bg-white dark:bg-[#202023]">
        <div className="container-x max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
            <div className="space-y-5">
              <span className="eyebrow text-[var(--accent)]">Fine Dining</span>
              <h2 className="font-display font-normal text-3xl text-[#222] dark:text-[#f4efe6]">Dining: A Feast Steeped in Tradition</h2>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">Our master chef presents a carefully curated menu of Nigerian classics and continental delicacies. From a lavish breakfast spread to an elegant dinner service, every meal is crafted with the finest local ingredients.</p>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">Open daily for breakfast, lunch, and dinner. Room service available 24 hours.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#ece6dd] dark:border-[#2e2b26] shadow-md aspect-[16/10]">
              <img src="/images/dining.jpg" alt="Restaurant" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
          <div className="grid gap-12 md:grid-cols-2 items-center mb-16">
            <div className="overflow-hidden rounded-2xl border border-[#ece6dd] dark:border-[#2e2b26] shadow-md md:order-1 aspect-[16/10]">
              <img src="/images/lounge.jpg" alt="Bar" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="space-y-5 md:order-2">
              <span className="eyebrow text-[var(--accent)]">Cocktails &amp; Spirits</span>
              <h2 className="font-display font-normal text-3xl text-[#222] dark:text-[#f4efe6]">Open-Air Bar &amp; Lounge</h2>
              <p className="text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">Handcrafted cocktails, single malts, and relaxed evenings under the stars. Our garden bar offers a serene atmosphere with comfortable seating and a curated selection of local and international beverages.</p>
            </div>
          </div>

          {/* Landscape Dining Gallery Showcase */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <span className="eyebrow text-[var(--accent)] block mb-1">Atmosphere &amp; Ambience</span>
              <h3 className="font-display font-normal text-2xl sm:text-3xl text-[#222] dark:text-[#f4efe6]">Dining &amp; Lounge Spaces</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { src: "/images/Restaurant 2.jpg", title: "Restaurant Dining Hall" },
                { src: "/images/OpenBar Garden.jpg", title: "Open-Air Garden Terrace" },
                { src: "/images/Ballard Table.jpg", title: "Billiards & Lounge Bar" },
              ].map((item, idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl border border-[#ece6dd] dark:border-[#2e2b26] shadow-sm aspect-[16/10] relative group">
                  <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-condensed tracking-wider uppercase font-medium">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <Link href="/booking" className="btn-gold px-9 py-4 text-xs inline-flex items-center gap-2">Reserve a Table</Link>
          </div>
        </div>
      </section>
    </>
  );
}
