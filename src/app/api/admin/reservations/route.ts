import { listReservations } from "@/lib/booking/engine";
import { requireStaff, jsonError, jsonOk } from "@/lib/booking/auth";

/** GET /api/admin/reservations?status=&limit= — staff only. */
export async function GET(req: Request) {
  const auth = await requireStaff(req);
  if (!auth.ok) return jsonError(auth.error, auth.message, 401);

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 100);

  const reservations = await listReservations({ status, limit: Math.min(200, Math.max(1, limit)) });
  return jsonOk({ reservations });
}
