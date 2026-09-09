import { requireStaff, jsonError, jsonOk } from "@/lib/booking/auth";
import { getRoomTypes, listReservations } from "@/lib/booking/engine";
import { todayHotelISO } from "@/lib/booking/pricing";
import type { Reservation } from "@/lib/booking/types";

/** GET /api/admin/stats — live operational stats for the admin dashboard. */
export async function GET(req: Request) {
  const auth = await requireStaff(req);
  if (!auth.ok) return jsonError(auth.error, auth.message, 401);

  const today = todayHotelISO();
  const [reservations, roomTypes] = await Promise.all([listReservations({ limit: 300 }), getRoomTypes()]);

  const totalRooms = roomTypes.reduce((a, rt) => a + (rt.qty ?? 0), 0);
  const arrivals = reservations.filter((r) => r.checkIn === today && ["confirmed", "pending"].includes(r.status));
  const departures = reservations.filter((r) => r.checkOut === today && r.status === "checked_in");
  const inHouse = reservations.filter((r) => r.status === "checked_in");
  const monthPrefix = today.slice(0, 7);
  const revenue = reservations
    .filter((r) => r.paymentStatus === "successful" && (r.createdAt ?? "").startsWith(monthPrefix))
    .reduce((a, r) => a + (r.pricing?.amountPaid ?? 0), 0);

  return jsonOk({
    totalRooms,
    arrivals: arrivals.length,
    departures: departures.length,
    inHouse: inHouse.length,
    revenue,
    currency: "NGN",
    recent: reservations.slice(0, 8),
    today,
  });
}
