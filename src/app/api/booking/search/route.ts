import { searchAvailability } from "@/lib/booking/engine";
import { jsonError, jsonOk } from "@/lib/booking/auth";
import type { AvailabilityQuery } from "@/lib/booking/types";

/** POST /api/booking/search — real inventory availability search. */
export async function POST(req: Request) {
  let body: Partial<AvailabilityQuery>;
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }

  const result = await searchAvailability({
    checkIn: String(body.checkIn ?? ""),
    checkOut: String(body.checkOut ?? ""),
    adults: Number(body.adults ?? 2),
    children: Number(body.children ?? 0),
    roomCount: Number(body.roomCount ?? 1),
  });

  if (!result.ok) return jsonError(result.error, result.message);
  return jsonOk(result.data);
}
