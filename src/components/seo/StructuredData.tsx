import { HOTEL, ROOMS } from "@/lib/hotel";

const SITE_URL = "https://bankyhotelandsuites.com";

/* ------------------------------------------------------------------ */
/*  Hotel / LocalBusiness schema (homepage)                            */
/* ------------------------------------------------------------------ */
export function HotelSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: HOTEL.name,
    description: "A four-star luxury hotel in Ado-Ekiti with 28 rooms and suites, fine dining, an open-air bar and Banky Hall for events.",
    url: SITE_URL,
    telephone: HOTEL.phone,
    email: HOTEL.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 5, Block II, Commercial Layout",
      addressLocality: "Ado-Ekiti",
      addressRegion: "Ekiti State",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 7.6211,
      longitude: 5.2214,
    },
    image: [`${SITE_URL}/images/hero.jpg`, `${SITE_URL}/images/hotel-front-right.jpg`, `${SITE_URL}/images/Hotel Lobby.jpg`],
    starRating: {
      "@type": "Rating",
      ratingValue: 4,
    },
    priceRange: "₦30,000 - ₦200,000",
    checkinTime: "14:00",
    checkoutTime: "12:00",
    numberOfRooms: 28,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
      { "@type": "LocationFeatureSpecification", name: "Bar", value: true },
      { "@type": "LocationFeatureSpecification", name: "Events Hall", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 Security", value: true },
      { "@type": "LocationFeatureSpecification", name: "Power Backup", value: true },
      { "@type": "LocationFeatureSpecification", name: "Room Service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
    ],
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Room / Product schema (room detail pages)                          */
/* ------------------------------------------------------------------ */
export function RoomSchema({ slug }: { slug: string }) {
  const room = ROOMS.find((r) => r.slug === slug) || ROOMS[0]!;
  const roomUrl = `${SITE_URL}/rooms/${room.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${room.name} — ${HOTEL.name}`,
    description: room.blurb,
    url: roomUrl,
    image: `${SITE_URL}${room.image}`,
    brand: {
      "@type": "Hotel",
      name: HOTEL.name,
    },
    offers: {
      "@type": "Offer",
      price: room.rate,
      priceCurrency: "NGN",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/booking?room=${room.slug}`,
      priceValidUntil: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.8,
      reviewCount: 120,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList schema (used on sub-pages)                          */
/* ------------------------------------------------------------------ */
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  FAQPage schema (FAQ page)                                          */
/* ------------------------------------------------------------------ */
export function FaqSchema() {
  const faqs = [
    { q: "What are your check-in and check-out times?", a: "Standard check-in begins at 2:00 PM and check-out is by 12:00 noon." },
    { q: "Is complimentary breakfast included?", a: "Yes, all room reservations include complimentary gourmet breakfast." },
    { q: "Where is Banky Hotel & Suites located?", a: "We are located at Plot 5, Block II, Commercial Layout, Ado-Ekiti, Ekiti State, Nigeria." },
    { q: "Do you have 24/7 security and uninterrupted power?", a: "Yes, we provide round-the-clock security and full multi-tier generator power backup." },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
