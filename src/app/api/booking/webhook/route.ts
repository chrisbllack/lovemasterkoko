import { isValidWebhookSignature } from "@/lib/booking/paystack";
import {
  verifyAndConfirmPayment,
  markPaymentFailed,
  getReservationByReference,
} from "@/lib/booking/engine";
import { serverDb, COL } from "@/lib/booking/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/booking/webhook — Paystack webhook receiver.
 * - Validates the x-paystack-signature HMAC before anything else.
 * - Persists the event for idempotency (replayed deliveries are ignored).
 * - charge.success → verify + confirm reservation.
 * - Other outcomes → mark failed and release the hold.
 */
export async function POST(req: Request) {
  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  let valid = false;
  try {
    valid = await isValidWebhookSignature(rawBody, signature);
  } catch (e) {
    console.error("webhook signature check error:", e);
    return Response.json({ ok: false, message: "Webhook configuration error." }, { status: 500 });
  }
  if (!valid) {
    return Response.json({ ok: false, message: "Invalid signature." }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: string; status?: string; amount?: number; channel?: string; paid_at?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false, message: "Invalid payload." }, { status: 400 });
  }

  const reference = event.data?.reference ?? "";
  if (!reference) return Response.json({ ok: true, message: "No reference; ignored." }, { status: 200 });

  // Idempotency: skip events we've already processed
  const eventDoc = serverDb().collection("webhook_events").doc(reference + ":" + event.event);
  const eventSnap = await eventDoc.get();
  if (eventSnap.exists) {
    return Response.json({ ok: true, message: "Already processed." }, { status: 200 });
  }
  await eventDoc.set({ receivedAt: new Date().toISOString(), event: event.event ?? "" });

  const bksRef = reference.split("-P")[0];
  const reservation = await getReservationByReference(bksRef);
  if (!reservation) {
    return Response.json({ ok: true, message: "Unknown reservation; ignored." }, { status: 200 });
  }

  if (event.event === "charge.success") {
    // Re-verify with Paystack before trusting the webhook payload.
    const { verifyTransaction } = await import("@/lib/booking/paystack");
    try {
      const v = await verifyTransaction(reference);
      if (v.paid && v.currency === "NGN") {
        await verifyAndConfirmPayment({
          reservationId: reservation.id,
          paystackReference: v.reference,
          amountPaid: v.amount,
          channel: v.channel,
          paidAt: v.paidAt,
        });
      }
    } catch (e) {
      console.error("webhook charge.success handling failed:", e);
      // Return 200 so Paystack doesn't endlessly retry a permanent failure;
      // the failure is recorded for observability.
      await eventDoc.set({ error: String(e) }, { merge: true });
    }
  } else if (event.event?.startsWith("charge.")) {
    await markPaymentFailed(reservation.id, event.event);
  }

  return Response.json({ ok: true }, { status: 200 });
}
