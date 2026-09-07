"use client";
import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Wifi, Coffee, Utensils, GlassWater, CalendarCheck } from "lucide-react";
import { PhoneSolidIcon } from "@/components/icons/PhoneSolidIcon";
import { ROOMS, HOTEL, naira } from "@/lib/hotel";

const FACILITIES = [
  { icon: Utensils, title: "Restaurant & Dining", desc: "Authentic Nigerian delicacies and international breakfast served daily by master chefs." },
  { icon: GlassWater, title: "Garden Bar & Sitout", desc: "Refreshing cocktails, cold beverages, and an open-air breeze in the private garden lounge." },
  { icon: CalendarCheck, title: "Banky Hall & Events", desc: "Air-conditioned 300-seat banqueting hall for wedding receptions and seminars." },
  { icon: Wifi, title: "High-Speed Wi-Fi", desc: "Complimentary unbroken fiber internet throughout all rooms and public lounges." },
  { icon: Shield, title: "24/7 Security & Power", desc: "Continuous multi-generator power backup and uniformed professional security." },
  { icon: Coffee, title: "Room Service", desc: "Attentive in-room dining and concierge assistance whenever you desire." },
];

const FAQS = [
  { q: "What are your check-in and check-out times?", a: "Standard check-in begins at 2:00 PM and check-out is by 12:00 noon. Early check-in or late check-out can be requested subject to room availability." },
  { q: "Is complimentary breakfast included?", a: "Yes, all room reservations include complimentary gourmet breakfast served daily in our fine dining restaurant." },
  { q: "Where is Banky Hotel & Suites located?", a: "We are located at Plot 5, Block II, Commercial Layout, Ado-Ekiti, Ekiti State, Nigeria — close to the city center and state administrative offices." },
  { q: "Do you have 24/7 security and uninterrupted power?", a: "Yes, we provide round-the-clock armed professional security, CCTV surveillance, and full multi-tier generator power backup." },
];

/* ------------------------------------------------------------------ */
/*  About                                                              */
/* ------------------------------------------------------------------ */
export const AboutSection = memo(function AboutSection() {
  return (
    <section className="bg-[#f8f5f0] dark:bg-[#1c1a17] py-20 sm:py-28 border-b border-[#ece6dd] dark:border-[#2e2b26]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}>
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-[var(--accent)]" />
              <span className="eyebrow text-[var(--accent)]">Banky Hotel &amp; Suites</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6] leading-[1.12]">Enjoy a Calm Haven in Ado-Ekiti</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#666] dark:text-[#a8a29e]">Banky Hotel &amp; Suites was conceived as a private sanctuary for discerning travellers who desire the polish of an international boutique hotel paired with the authentic warmth of Ekiti hospitality.</p>
            <p className="text-sm sm:text-base leading-relaxed text-[#666] dark:text-[#a8a29e]">Our 28 bespoke rooms and suites feature orthopedic beds, quiet climate control, unbroken high-speed Wi-Fi, and 24/7 dedicated generator power grid.</p>
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#ece6dd] dark:border-[#2e2b26]">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border border-[var(--accent)] flex items-center justify-center text-[var(--accent)]"><PhoneSolidIcon className="h-5 w-5" /></div>
                <div>
                  <span className="font-condensed uppercase tracking-wider text-xs text-[var(--accent)] font-semibold block">Reservation Hotline</span>
                  <a href={`tel:${HOTEL.phone}`} className="font-display text-xl sm:text-2xl text-[#222] dark:text-[#f4efe6] hover:text-[var(--accent)] transition-colors">{HOTEL.phone}</a>
                </div>
              </div>
              <Link href="/booking" className="btn-gold px-8 py-3.5 text-xs">Check Availability</Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="overflow-hidden border border-[#ece6dd] dark:border-[#2e2b26] shadow-lg">
              <Image src="/images/hero-exterior.jpg" alt="Hotel exterior" width={400} height={500} className="h-72 sm:h-96 w-full object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 50vw, 25vw" />
            </div>
            <div className="overflow-hidden border border-[#ece6dd] dark:border-[#2e2b26] shadow-lg mt-8 sm:mt-12">
              <Image src="/images/OpenBar Garden.jpg" alt="Garden bar" width={400} height={500} className="h-72 sm:h-96 w-full object-cover hover:scale-105 transition-transform duration-700" sizes="(max-width: 1024px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  Rooms                                                              */
/* ------------------------------------------------------------------ */
export const RoomsSection = memo(function RoomsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-[#121212]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 1200px" }}>
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-6 bg-[var(--accent)]" />
            <span className="eyebrow text-[var(--accent)]">Luxury Accommodations</span>
            <span className="h-px w-6 bg-[var(--accent)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6]">Rooms &amp; Suites</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">              {ROOMS.slice(0, 8).map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`} className="group block border border-[#ece6dd] dark:border-[#2e2b26] bg-white dark:bg-[#1c1a17] overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-[var(--accent)]">
              <div className="overflow-hidden h-56">
                <Image src={room.image} alt={room.name} width={400} height={280} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              </div>
              <div className="p-5">                  <span className="eyebrow text-[var(--accent)] block mb-1">{room.size} · {room.occupancy}</span>
                  <h3 className="font-display text-lg text-[#222] dark:text-[#f4efe6] mb-2">{room.name}</h3>
                  <p className="text-xs text-[#666] dark:text-[#a8a29e] leading-relaxed line-clamp-2 mb-3">{room.blurb}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg text-[var(--accent)]">{naira(room.rate)}</span>
                  <span className="text-[10px] font-condensed uppercase tracking-wider text-[var(--accent)]">/ night</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/booking" className="btn-gold px-9 py-4 text-xs inline-flex items-center gap-2 shadow-md">
            <span>Book Direct &amp; Save 10%</span><ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  Facilities                                                         */
/* ------------------------------------------------------------------ */
export const FacilitiesSection = memo(function FacilitiesSection() {
  return (
    <section className="bg-[#f8f5f0] dark:bg-[#1c1a17] py-20 sm:py-28 border-y border-[#ece6dd] dark:border-[#2e2b26]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}>
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-6 bg-[var(--accent)]" />
            <span className="eyebrow text-[var(--accent)]">Our Services</span>
            <span className="h-px w-6 bg-[var(--accent)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6]">Hotel Facilities</h2>
        </div>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="border border-[#ece6dd] dark:border-[#2e2b26] bg-white dark:bg-[#1c1a17] p-8 transition-all duration-300 hover:border-[var(--accent)] hover:shadow-md">
                <div className="h-14 w-14 border border-[var(--accent)] flex items-center justify-center text-[var(--accent)] mb-6"><Icon className="h-6 w-6" /></div>
                <h3 className="font-display text-xl text-[#222] dark:text-[#f4efe6] mb-2.5">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  Experiences                                                        */
/* ------------------------------------------------------------------ */
export const ExperiencesSection = memo(function ExperiencesSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-[#121212]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 700px" }}>
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-6 bg-[var(--accent)]" />
            <span className="eyebrow text-[var(--accent)]">Explore The Grounds</span>
            <span className="h-px w-6 bg-[var(--accent)]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6]">Dining &amp; Banqueting</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { img: "/images/dining.jpg", title: "Fine Dining Restaurant", tag: "Culinary Art", copy: "Nigerian classics and continental plates, served breakfast through dinner.", href: "/dining" },
            { img: "/images/lounge.jpg", title: "Open-Air Bar & Lounge", tag: "Cocktails & Spirits", copy: "Handcrafted cocktails, single malts, and relaxed evenings under the stars.", href: "/dining" },
            { img: "/images/BankyHall.jpg", title: "Banky Hall", tag: "Banqueting & Events", copy: "Lustrous hall with seating for up to 300 guests for weddings and conferences.", href: "/events" },
          ].map((c) => (
            <Link key={c.title} href={c.href} className="group relative overflow-hidden border border-[#ece6dd] dark:border-[#2e2b26] block">
              <Image src={c.img} alt={c.title} width={600} height={420} className="h-72 sm:h-80 md:h-[420px] w-full object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 border border-white/10 bg-[#1b1b1b]/95 p-5 text-white">
                <span className="font-condensed text-[0.66rem] tracking-[0.24em] uppercase text-[var(--accent)] font-semibold block mb-1">{c.tag}</span>
                <h3 className="text-xl font-display text-white">{c.title}</h3>
                <p className="mt-1 text-xs text-stone-300 line-clamp-2">{c.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */
export const GallerySection = memo(function GallerySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#f8f5f0] dark:bg-[#1c1a17] border-t border-[#ece6dd] dark:border-[#2e2b26]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}>
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="eyebrow text-[var(--accent)] block mb-2">Hotel Atmosphere</span>            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6]">Photo Gallery</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["/images/Hotel Lobby.jpg", "/images/Restaurant 2.jpg", "/images/lounge-bar.jpg", "/images/corridor-hallway.jpg", "/images/dining.jpg", "/images/events-hall.jpg", "/images/lobby.jpg", "/images/room-suite.jpg"].map((img, i) => (              <div key={i} className={`overflow-hidden border border-[#ece6dd] dark:border-[#2e2b26] ${i === 0 || i === 5 ? "md:col-span-2 md:row-span-2" : ""}`}>
              <Image src={img} alt="Gallery" width={400} height={300} className="w-full h-full object-cover min-h-[180px] hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/gallery" className="btn-outline-gold px-8 py-3.5 text-xs inline-flex items-center gap-2 transition-all">
            <span>View Full Photo Gallery</span><ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
export const TestimonialsSection = memo(function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#1b1b1b] text-white" style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}>
      <div className="container-x text-center">
        <span className="eyebrow text-[var(--accent)] block mb-2">What Our Guests Say</span>        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-12 text-white">Testimonials</h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {[
            { name: "Chief Adeleke", text: "An outstanding luxury experience. The Signature Suite exceeded every expectation — the butler service and attention to detail were world-class.", rating: 5 },
            { name: "Mrs. Oluwaseun", text: "We held our wedding reception at Banky Hall and it was absolutely perfect. The coordination team made our day seamless and magical.", rating: 5 },
            { name: "Dr. Adebayo", text: "Best hotel in Ado-Ekiti by far. The executive rooms are immaculate, the Wi-Fi is genuinely fast, and the restaurant serves the best jollof rice in town.", rating: 5 },
          ].map((t) => (              <div key={t.name} className="p-8 border border-white/10 bg-white/5 dark:bg-white/[0.03] text-left">
              <div className="flex gap-1 text-[var(--accent)] mb-4">
                {Array.from({ length: t.rating }).map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="text-sm text-stone-300 leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-[var(--accent)] font-semibold">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
export const FaqSection = memo(function FaqSection() {
  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-[#121212]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}>
      <div className="container-x max-w-3xl">
        <div className="text-center mb-14">
          <span className="eyebrow text-[var(--accent)] block mb-2">Questions &amp; Answers</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#222] dark:text-[#f4efe6]">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">            {FAQS.map((f, i) => (
              <details key={i} className="group border border-[#ece6dd] dark:border-[#2e2b26] p-6">                <summary className="font-display text-lg text-[#222] dark:text-[#f4efe6] cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <span className="text-[var(--accent)] group-open:rotate-45 transition-transform text-2xl font-condensed">+</span>
              </summary>                <p className="mt-4 text-sm text-[#666] dark:text-[#a8a29e] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */
export const CtaSection = memo(function CtaSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#1b1b1b] dark:bg-[#0d0d0d] text-white text-center border-t border-[var(--accent)]/30">
      <div className="container-x max-w-2xl mx-auto space-y-5">
        <span className="font-condensed text-xs uppercase tracking-[0.3em] font-semibold text-[var(--accent)] block">Direct Reservation Privilege</span>
        <h2 className="text-3xl sm:text-5xl font-display text-white leading-tight">Book Your Next Stay in Ado-Ekiti</h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg mx-auto">
          Experience serene luxury with immediate room confirmation, dedicated concierge assistance, and guaranteed best rates when booking direct.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link href="/booking" className="btn-gold px-9 py-4 text-xs inline-flex items-center gap-2 shadow-lg">
            <span>Check Availability &amp; Book</span><ArrowRight className="h-4 w-4" />
          </Link>
          <a href={`tel:${HOTEL.phone}`} className="btn-outline-white px-9 py-4 text-xs inline-flex items-center gap-2">
            <PhoneSolidIcon className="h-4 w-4" /><span>+234 704 700 4816</span>
          </a>
        </div>
      </div>
    </section>
  );
});
