"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ROOMS, HOTEL, naira, nightsBetween, whatsappLink, bookingMessage, makeReference } from "@/lib/hotel";
import { CreditCard, Lock, CheckCircle2, Calendar, User } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

function BookingForm() {
  const sp = useSearchParams();
  const defaultSlug = sp.get("room") || ROOMS[0]!.slug;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [slug, setSlug] = useState(defaultSlug);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [requests, setRequests] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [ref] = useState(makeReference);

  const room = ROOMS.find((r) => r.slug === slug) || ROOMS[0]!;
  const nights = nightsBetween(checkIn, checkOut);
  const total = room.rate * Math.max(nights, 1);

  const handleWhatsApp = () => {
    const msg = bookingMessage({ room: room.name, name, checkIn, checkOut, guests: adults + children, rate: room.rate });
    window.open(whatsappLink(msg), "_blank");
  };

  const handlePaystack = () => {
    // Redirect to Paystack inline payment
    window.open(`https://paystack.shop/pay/lni6oqnifn`, "_blank");
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="font-display text-3xl text-[#222] mb-3">Booking Confirmed!</h2>
        <p className="text-sm text-[#666] mb-2">Your reservation reference is <strong className="text-[var(--accent)]">{ref}</strong></p>
        <p className="text-sm text-[#666] mb-8">A confirmation has been sent to {email || "your email"}. You can also reach us on WhatsApp for instant confirmation.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={whatsappLink(bookingMessage({ room: room.name, name, checkIn, checkOut, guests: adults + children, rate: room.rate }))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 text-xs font-condensed uppercase tracking-[0.16em] font-semibold hover:bg-[#20bd5a] transition-colors">
            <WhatsAppIcon className="h-4 w-4" />Confirm on WhatsApp
          </a>
          <button onClick={() => setSubmitted(false)} className="btn-gold px-6 py-3 text-xs">Book Another Room</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <form onSubmit={(e) => { e.preventDefault(); if (name && email && phone && checkIn && checkOut) setSubmitted(true); }} className="space-y-8">
        {/* Dates */}
        <div className="glass p-6 rounded-md space-y-5 border border-[#ece6dd]/80">
          <div className="flex items-center gap-2 border-b border-[#ece6dd]/60 pb-3">
            <span className="h-6 w-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold flex items-center justify-center">1</span>
            <h3 className="font-display text-lg text-[#222]">Stay Dates &amp; Suite Category</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="eyebrow text-[#666] block mb-1">Check-in Date *</label>
              <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none text-[#222]" />
            </div>
            <div>
              <label className="eyebrow text-[#666] block mb-1">Check-out Date *</label>
              <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} min={checkIn || new Date().toISOString().split("T")[0]} className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none text-[#222]" />
            </div>
            <div>
              <label className="eyebrow text-[#666] block mb-1">Adults</label>
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none text-[#222]">
                {[1, 2, 3, 4, 5].map((a) => <option key={a} value={a}>{a} {a === 1 ? "Adult" : "Adults"}</option>)}
              </select>
            </div>
            <div>
              <label className="eyebrow text-[#666] block mb-1">Children</label>
              <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none text-[#222]">
                {[0, 1, 2, 3].map((c) => <option key={c} value={c}>{c} {c === 1 ? "Child" : "Children"}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="eyebrow text-[#666] block mb-1">Suite Category</label>
              <select value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none text-[#222]">
                {ROOMS.map((r) => <option key={r.slug} value={r.slug}>{r.name} ({r.size}) — {naira(r.rate)} / night</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Guest Info */}
        <div className="glass p-6 rounded-md space-y-5 border border-[#ece6dd]/80">
          <div className="flex items-center gap-2 border-b border-[#ece6dd]/60 pb-3">
            <span className="h-6 w-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold flex items-center justify-center">2</span>
            <h3 className="font-display text-lg text-[#222]">Primary Guest Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="eyebrow text-[#666] block mb-1">Full Name *</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chief Adeleke Johnson" className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none placeholder:text-stone-400 text-[#222]" />
            </div>
            <div>
              <label className="eyebrow text-[#666] block mb-1">Email Address *</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="guest@domain.com" className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none placeholder:text-stone-400 text-[#222]" />
            </div>
            <div>
              <label className="eyebrow text-[#666] block mb-1">Phone / WhatsApp *</label>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none placeholder:text-stone-400 text-[#222]" />
            </div>
            <div className="sm:col-span-2">
              <label className="eyebrow text-[#666] block mb-1">Special Requests</label>
              <textarea rows={2} value={requests} onChange={(e) => setRequests(e.target.value)} placeholder="High floor, quiet wing, anniversary setup..." className="w-full border-b border-[#ece6dd] py-2 text-sm bg-transparent outline-none resize-none placeholder:text-stone-400 text-[#222]" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={!name || !email || !phone || !checkIn || !checkOut} className="btn-gold w-full min-h-[52px] text-xs inline-flex items-center justify-center gap-2 disabled:opacity-50 shadow-md">
          <Lock className="h-4 w-4" /><span>Confirm Reservation</span>
        </button>
      </form>

      {/* Sidebar */}
      <aside className="h-fit rounded-xl p-6 sm:p-8 space-y-5 border border-[#ece6dd]/80 bg-white shadow-md lg:sticky lg:top-28">
        <div>
          <span className="eyebrow text-[var(--accent)]">Stay Breakdown</span>
          <h2 className="mt-1 text-2xl font-display text-[#222]">{room.name}</h2>
        </div>
        <div className="overflow-hidden border border-[#ece6dd] rounded-md">
          <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-[#666]">Room Rate</span><span>{naira(room.rate)} / night</span></div>
          {checkIn && checkOut && <>
            <div className="flex justify-between"><span className="text-[#666]">Dates</span><span>{checkIn} → {checkOut}</span></div>
            <div className="flex justify-between"><span className="text-[#666]">Duration</span><span>{nights} night{nights !== 1 ? "s" : ""}</span></div>
            <div className="flex justify-between"><span className="text-[#666]">Guests</span><span>{adults + children}</span></div>
            <div className="flex justify-between border-t border-[#ece6dd] pt-3 font-bold text-[#222]">
              <span>Total</span>
              <span className="text-[var(--accent)]">{naira(total)}</span>
            </div>
          </>}
        </div>
        <div className="space-y-2">
          <button onClick={handlePaystack} className="w-full btn-gold py-3.5 text-xs inline-flex items-center justify-center gap-2 shadow-md">
            <CreditCard className="h-4 w-4" />Pay Online with Paystack
          </button>
          <button onClick={handleWhatsApp} className="w-full py-3.5 text-xs inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-condensed uppercase tracking-[0.18em] font-semibold hover:bg-[#20bd5a] transition-colors">
            <WhatsAppIcon className="h-4 w-4" />Book via WhatsApp
          </button>
        </div>
        <p className="text-[11px] text-center text-stone-400">Front desk hotline: {HOTEL.phone}</p>
      </aside>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 bg-[#1b1b1b]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b1b] via-[#1b1b1b]/80 to-[#1b1b1b]" />
        <div className="container-x relative z-10 text-center">
          <span className="eyebrow text-[var(--accent)] block mb-3">Online Reservations</span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white mb-4">Book Your Stay</h1>
          <p className="text-sm text-stone-300 max-w-xl mx-auto">Secure your room directly for the best rates, instant confirmation, and dedicated concierge support.</p>
        </div>
      </section>
      <section className="py-10 sm:py-16 md:py-20 bg-white">
        <div className="container-x">
          <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading booking form...</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
