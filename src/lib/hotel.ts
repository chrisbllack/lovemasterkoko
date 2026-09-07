export const HOTEL = {
  name: "Banky Hotel & Suites",
  tagline: "Quiet Luxury in the Heart of Ado-Ekiti",
  address: "Ado-Ekiti, Ekiti State, Nigeria",
  phone: "+2347047004816",
  whatsapp: "2347047004816",
  email: "reservations@bankyhotelandsuites.com",
  website: "https://bankyhotelandsuites.com",
  checkIn: "2:00 PM",
  checkOut: "12:00 PM",
};

export type Room = {
  slug: string;
  name: string;
  rate: number;
  qty: number;
  occupancy: string;
  size: string;
  image: string;
  blurb: string;
  features: string[];
};

export const ROOMS: Room[] = [
  { slug: "signature-suite", name: "Signature Suite", rate: 200000, qty: 1, occupancy: "2 guests", size: "78 sqm", image: "/images/Signature Suite.jpg", blurb: "Our most private signature residence: a sunlit master living room, dressing area and a king canopy bedroom framed by full-height windows.", features: ["Private living room", "Butler service", "Complimentary breakfast", "VIP airport transfer"] },
  { slug: "presidential-suite", name: "Presidential Suite", rate: 100000, qty: 3, occupancy: "2 guests", size: "65 sqm", image: "/images/Diplomatic Suite.jpg", blurb: "A stately presidential residence with an executive parlor, marble bathroom, and expansive lounge suited for visiting dignitaries and VIPs.", features: ["Executive parlor", "King canopy bed", "Complimentary breakfast", "Late checkout"] },
  { slug: "super-executive", name: "Super Executive", rate: 60000, qty: 1, occupancy: "2 guests", size: "42 sqm", image: "/images/Super Executive.jpg", blurb: "Generous proportions, a private reading corner and soft daylight all afternoon.", features: ["King bed", "Reading corner", "Smart TV", "Daily housekeeping"] },
  { slug: "executive", name: "Executive", rate: 50000, qty: 8, occupancy: "2 guests", size: "36 sqm", image: "/images/Executive Suite.jpg", blurb: "Warm timber, crisp linen and an ergonomic work desk built for long, productive executive stays.", features: ["King bed", "Work desk", "Rain shower", "Complimentary Wi-Fi"] },
  { slug: "standard-plus", name: "Standard Plus", rate: 45000, qty: 4, occupancy: "2 guests", size: "34 sqm", image: "/images/Standard Plus.jpg", blurb: "An elevated take on our standard room, with an extended seating area and comfortable workspace.", features: ["Queen bed", "Seating area", "Smart TV", "Air conditioning"] },
  { slug: "deluxe", name: "Deluxe", rate: 40000, qty: 5, occupancy: "2 guests", size: "32 sqm", image: "/images/Duluxe.jpg", blurb: "Understated comfort with garden-facing windows, quiet atmosphere, and a calm, neutral palette.", features: ["Queen bed", "Garden view", "Smart TV", "24-hour room service"] },
  { slug: "studio", name: "Studio", rate: 35000, qty: 1, occupancy: "2 guests", size: "30 sqm", image: "/images/Suite1.jpg", blurb: "An open-plan studio designed for longer stays in the city, complete with a kitchenette nook.", features: ["Open plan", "Kitchenette", "Work nook", "Laundry service"] },
  { slug: "standard", name: "Standard", rate: 30000, qty: 5, occupancy: "2 guests", size: "28 sqm", image: "/images/Standard room.jpg", blurb: "Everything you need, nothing you don't — bright, quiet, air-conditioned and impeccably kept.", features: ["Double bed", "Smart TV", "Air conditioning", "Complimentary Wi-Fi"] },
];

export const naira = (v: number) => `₦${v.toLocaleString("en-NG")}`;

export function whatsappLink(msg: string) {
  return `https://wa.me/${HOTEL.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function bookingMessage(o: { room?: string; name?: string; checkIn?: string; checkOut?: string; guests?: string | number; rate?: number }) {
  return [
    `Hello ${HOTEL.name}, I would like to make a reservation.`,
    o.name ? `Name: ${o.name}` : null,
    o.room ? `Room: ${o.room}` : null,
    o.checkIn ? `Check-in: ${o.checkIn}` : null,
    o.checkOut ? `Check-out: ${o.checkOut}` : null,
    o.guests ? `Guests: ${o.guests}` : null,
    o.rate ? `Rate: ${naira(o.rate)} per night` : null,
  ].filter(Boolean).join("\n");
}

export function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0;
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000;
  return d > 0 ? Math.round(d) : 0;
}

export function makeReference() {
  return `BHS-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
