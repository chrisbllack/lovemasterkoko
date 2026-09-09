import { getAddons } from "@/lib/booking/engine";
import { jsonOk } from "@/lib/booking/auth";

/** GET /api/booking/addons — public list of active add-ons. */
export async function GET() {
  const addons = await getAddons();
  return jsonOk({
    addons: addons.map((a) => ({ id: a.id, name: a.name, price: a.price, unit: a.unit, description: a.description })),
  });
}
