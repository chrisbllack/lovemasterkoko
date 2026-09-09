import { getRatePlans } from "@/lib/booking/engine";
import { jsonOk } from "@/lib/booking/auth";

/** GET /api/booking/rate-plans — public list of active rate plans. */
export async function GET() {
  const plans = await getRatePlans();
  return jsonOk({
    ratePlans: plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      priceModifier: p.priceModifier,
      cancellationPolicy: p.cancellationPolicy,
      freeCancellationDays: p.freeCancellationDays,
      depositPercent: p.depositPercent,
      minNights: p.minNights,
    })),
  });
}
