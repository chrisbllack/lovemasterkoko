import { createBooking } from "@/lib/booking/engine";
import { jsonError, jsonOk } from "@/lib/booking/auth";

type Body = {
  quoteId?: string;
  guest?: { name?: string; email?: string; phone?: string; country?: string };
  requests?: string;
  idempotencyKey?: string;
};

/** POST /api/booking/create — creates a pending reservation + payment hold. */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }

  if (!body.quoteId || !body.guest) {
    return jsonError("VALIDATION_ERROR", "quoteId and guest details are required.");
  }

  const result = await createBooking({
    quoteId: String(body.quoteId),
    guest: {
      name: String(body.guest.name ?? ""),
      email: String(body.guest.email ?? ""),
      phone: String(body.guest.phone ?? ""),
      country: body.guest.country ? String(body.guest.country) : undefined,
    },
    requests: body.requests ? String(body.requests) : undefined,
    bookingSource: "website",
    idempotencyKey: body.idempotencyKey ? String(body.idempotencyKey) : undefined,
  });

  if (!result.ok) return jsonError(result.error, result.message, result.error === "ROOM_UNAVAILABLE" ? 409 : 400);
  return jsonOk(result.data, 201);
}
