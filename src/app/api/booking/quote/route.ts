import { buildQuote } from "@/lib/booking/engine";
import { jsonError, jsonOk } from "@/lib/booking/auth";
import type { QuoteRequest } from "@/lib/booking/engine";

/** POST /api/booking/quote — authoritative price quote (server-calculated). */
export async function POST(req: Request) {
  let body: Partial<QuoteRequest>;
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }

  const result = await buildQuote({
    roomTypeId: String(body.roomTypeId ?? ""),
    ratePlanId: String(body.ratePlanId ?? ""),
    checkIn: String(body.checkIn ?? ""),
    checkOut: String(body.checkOut ?? ""),
    adults: Number(body.adults ?? 2),
    children: Number(body.children ?? 0),
    roomCount: Number(body.roomCount ?? 1),
    promoCode: body.promoCode ? String(body.promoCode) : undefined,
    addonIds: Array.isArray(body.addonIds) ? body.addonIds : [],
  });

  if (!result.ok) return jsonError(result.error, result.message);
  return jsonOk(result.data);
}
