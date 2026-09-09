import { initiatePayment } from "@/lib/booking/paystack";
import { getReservationById } from "@/lib/booking/engine";
import { serverDb, COL } from "@/lib/booking/server";
import { jsonError, jsonOk } from "@/lib/booking/auth";

/**
 * POST /api/booking/pay
 * Body: { reservationId }
 * Returns a Paystack authorization URL for the reservation's deposit.
 * The amount is taken from the reservation record — never from the client.
 */
export async function POST(req: Request) {
  let body: { reservationId?: string; origin?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }
  if (!body.reservationId) return jsonError("VALIDATION_ERROR", "reservationId is required.");

  const reservation = await getReservationById(String(body.reservationId));
  if (!reservation) return jsonError("RESERVATION_NOT_FOUND", "Reservation not found.", 404);
  if (reservation.paymentStatus === "successful") {
    return jsonError("INVALID_BOOKING_STATE", "This reservation is already paid.", 409);
  }
  if (reservation.status === "cancelled") {
    return jsonError("INVALID_BOOKING_STATE", "This reservation was cancelled.", 409);
  }

  const amount = reservation.pricing.depositDue;
  if (amount <= 0) return jsonError("VALIDATION_ERROR", "Nothing to pay for this reservation.");

  const origin = body.origin || new URL(req.url).origin;
  const reference = `${reservation.reference}-P${Date.now().toString(36).toUpperCase()}`;

  try {
    const init = await initiatePayment({
      email: reservation.guestEmail,
      amountKobo: amount,
      reference,
      callbackUrl: `${origin}/booking/confirmation?ref=${encodeURIComponent(reservation.reference)}`,
      metadata: {
        reservationId: reservation.id,
        reference: reservation.reference,
        guestName: reservation.guestName,
      },
    });

    // Record the intended transaction (idempotency / reconciliation)
    await serverDb()
      .collection(COL.payments)
      .add({
        reservationId: reservation.id,
        reference: reservation.reference,
        gateway: "paystack",
        gatewayReference: reference,
        amount,
        currency: reservation.pricing.currency,
        status: "processing",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

    return jsonOk({ authorizationUrl: init.authorizationUrl, reference, amount });
  } catch (e) {
    console.error("pay init failed:", e);
    return jsonError("PAYMENT_FAILED", "Could not start the payment. Please try again.", 502);
  }
}
