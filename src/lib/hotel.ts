export const HOTEL = {
  name: "Banky Hotel & Suites",
  tagline: "Quiet Luxury in the Heart of Ado-Ekiti",
  address: "Km 5 NDLEA Junction Ado-Iworoko Road, Adebayo, Ado-Ekiti, Ekiti State, Nigeria",
  phone: "+2349035879708",
  whatsapp: "2349035879708",
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
  bed: string;
  image: string;
  blurb: string;
  features: string[];
};

export const ROOMS: Room[] = [
  { slug: "signature-suite", name: "Signature Suite", rate: 200000, qty: 1, occupancy: "2 guests", bed: "King Canopy Bed", image: "/images/signature suite room.jpg", blurb: "Our premier signature residence: a sunlit master living parlor, private dressing area, and an opulent king canopy bedroom framed by full-height windows.", features: ["Private living room", "Butler service", "Complimentary breakfast", "VIP airport transfer"] },
  { slug: "presidential-suite", name: "Presidential Suite", rate: 100000, qty: 3, occupancy: "2 guests", bed: "King Canopy Bed", image: "/images/Diplomatic Suite.jpg", blurb: "A stately presidential residence featuring an executive parlor, marble-finished bathroom, and expansive entertaining lounge suited for visiting dignitaries and VIPs.", features: ["Executive parlor", "King canopy bed", "Complimentary breakfast", "Late checkout"] },
  { slug: "super-executive", name: "Super Executive", rate: 60000, qty: 1, occupancy: "2 guests", bed: "King Bed", image: "/images/superexecutive.jpg", blurb: "An expansive, peaceful haven featuring a private reading corner, plush bedding, and soft natural daylight throughout the day.", features: ["King bed", "Reading corner", "Smart TV", "Daily housekeeping"] },
  { slug: "executive", name: "Executive", rate: 50000, qty: 8, occupancy: "2 guests", bed: "King Bed", image: "/images/executive.jpg", blurb: "Rich warm timber, crisp Egyptian cotton linen, and an ergonomic workstation tailored for restful and productive executive stays.", features: ["King bed", "Work desk", "Rain shower", "Complimentary Wi-Fi"] },
  { slug: "standard-plus", name: "Standard Plus", rate: 45000, qty: 4, occupancy: "2 guests", bed: "Queen Bed", image: "/images/Standard Plus.jpg", blurb: "An elevated retreat offering an extended lounge seating area, comfortable dedicated workspace, and serene courtyard views.", features: ["Queen bed", "Seating area", "Smart TV", "Air conditioning"] },
  { slug: "deluxe", name: "Deluxe", rate: 40000, qty: 5, occupancy: "2 guests", bed: "Queen Bed", image: "/images/deluxe.jpg", blurb: "Understated luxury with scenic garden-facing windows, a quiet ambiance, and a soothing contemporary neutral palette.", features: ["Queen bed", "Garden view", "Smart TV", "24-hour room service"] },
  { slug: "studio", name: "Studio", rate: 35000, qty: 1, occupancy: "2 guests", bed: "Queen Bed", image: "/images/Suite1.jpg", blurb: "A versatile open-plan studio residence designed for extended city stays, complete with an integrated kitchenette and cozy dining nook.", features: ["Open plan", "Kitchenette", "Work nook", "Laundry service"] },
  { slug: "standard", name: "Standard", rate: 30000, qty: 5, occupancy: "2 guests", bed: "Double Bed", image: "/images/Standard room.jpg", blurb: "A welcoming, quiet sanctuary featuring premium bedding, whisper-quiet climate control, and refined contemporary essentials.", features: ["Double bed", "Smart TV", "Air conditioning", "Complimentary Wi-Fi"] },
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

export type AvailabilityResult = {
  available: boolean;
  availableRoomsCount: number;
  message: string;
};

/**
 * Placeholder function to simulate checking room inventory for given dates.
 * Simulates network latency and verifies room availability against inventory.
 */
export async function checkAvailability(params: {
  roomSlug: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
}): Promise<AvailabilityResult> {
  // Simulate network / database inventory check delay
  await new Promise((resolve) => setTimeout(resolve, 700));

  const room = ROOMS.find((r) => r.slug === params.roomSlug);
  if (!room) {
    return {
      available: false,
      availableRoomsCount: 0,
      message: "Selected room category was not found.",
    };
  }

  const nights = nightsBetween(params.checkIn, params.checkOut);
  if (nights <= 0) {
    return {
      available: false,
      availableRoomsCount: 0,
      message: "Please select valid check-in and check-out dates.",
    };
  }

  // Simulate available inventory from room configuration
  const availableCount = Math.max(1, room.qty);

  return {
    available: true,
    availableRoomsCount: availableCount,
    message: `${room.name} is available for your dates (${availableCount} room${availableCount > 1 ? "s" : ""} left in inventory).`,
  };
}

