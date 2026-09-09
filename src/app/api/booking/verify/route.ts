import { verifyTransaction } from "@/lib/booking/paystack";
import {
  verifyAndConfirmPayment,
  getReservationByReference,
  serverPaymentByGatewayRef,
} from "@/lib/booking/engine";
import { jsonError, jsonOk } from "@/lib/booking/auth";
import type { Reservation } from "@/lib/booking/types";

/**
 * POST /api/booking/verify
 * Body: { reference } — either the Paystack transaction reference
 * ("<BKS-...>-P<hex>") or the Banky reservation reference ("BKS-...").
 *
 * The browser's payment result is NEVER trusted: this route re-verifies the
 * transaction with Paystack, checks amount & currency, then confirms the
 * reservation. Idempotent — safe to call multiple times.
 */
export async function POST(req: Request) {
  let body: { reference?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }
  if (!body.reference) return jsonError("VALIDATION_ERROR", "Payment reference is required.");

  const input = String(body.reference).trim();

  // Resolve the reservation either way.
  let reservation: Reservation | null;
  let paystackRef: string | null;
  if (input.includes("-P")) {
    // Paystack reference: "<BKS-...>-P<hex>"
    paystackRef = input;
    reservation = await getReservationByReference(input.split("-P")[0]);
  } else {
    // Banky reference: resolve the latest pending/processing payment intent.
    reservation = await getReservationByReference(input.toUpperCase());
    paystackRef = reservation ? await serverPaymentByGatewayRef(reservation.id) : null;
  }
  if (!reservation) return jsonError("RESERVATION_NOT_FOUND", "Reservation not found for this payment.", 404);
  if (!paystackRef) {
    return jsonError(
      "PAYMENT_PENDING",
      "No pending payment found for this reference. If you completed payment, wait a moment and try again.",
      202,
    );
  }

  try {
    const v = await verifyTransaction(paystackRef);

    if (v.status === "failed" || v.status === "abandoned") {
      return jsonError("PAYMENT_FAILED", "The payment was not completed. You can try again from your booking.", 402);
    }
    if (v.status !== "success") {
      return jsonError("PAYMENT_PENDING", "The payment is still processing. This page will update shortly.", 202);
    }
    if (v.currency !== "NGN") {
      return jsonError("PAYMENT_FAILED", "Unexpected payment currency.", 400);
    }

    const result = await verifyAndConfirmPayment({
      reservationId: reservation.id,
      paystackReference: v.reference,
      amountPaid: v.amount,
      channel: v.channel,
      paidAt: v.paidAt,
    });
    if (!result.ok) return jsonError(result.error, result.message, 400);

    return jsonOk({
      status: result.data.status,
      paymentStatus: result.data.paymentStatus,
      reference: reservation.reference,
      amountPaid: v.amount,
      balanceDue: Math.max(0, reservation.pricing.grandTotal - reservation.pricing.amountPaid - v.amount),
    });
  } catch (e) {
    console.error("verify failed:", e);
    return jsonError("PAYMENT_FAILED", "Payment verification failed. Please contact support with your reference.", 502);
  }
}
