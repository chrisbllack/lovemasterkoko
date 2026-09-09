import { transitionReservation, assignRoom, cancelBooking } from "@/lib/booking/engine";
import { requireStaff, jsonError, jsonOk } from "@/lib/booking/auth";
import { RESERVATION_STATUSES, type ReservationStatus } from "@/lib/booking/types";

/**
 * POST /api/admin/reservations/actions
 * Body: { reservationId, action: "transition"|"assign_room"|"cancel", ... }
 * Authorization is enforced here (server-side RBAC), never only in the UI.
 */
export async function POST(req: Request) {
  const auth = await requireStaff(req);
  if (!auth.ok) return jsonError(auth.error, auth.message, 401);
  const actor = auth.data;

  let body: {
    reservationId?: string;
    action?: string;
    status?: string;
    roomNumber?: string;
    reason?: string;
  };
  try {
    body = await req.json();
  } catch {
    return jsonError("VALIDATION_ERROR", "Invalid request body.");
  }

  const reservationId = String(body.reservationId ?? "");
  if (!reservationId) return jsonError("VALIDATION_ERROR", "reservationId is required.");

  switch (body.action) {
    case "transition": {
      const to = String(body.status ?? "") as ReservationStatus;
      if (!(RESERVATION_STATUSES as readonly string[]).includes(to)) {
        return jsonError("VALIDATION_ERROR", "Unknown status.");
      }
      // RBAC: only front_desk/admin/super_admin may check guests in or out;
      // finance may not change stay state.
      const deskRoles = ["admin", "super_admin", "front_desk", "reservations"];
      if (["checked_in", "checked_out", "completed", "no_show"].includes(to) && !deskRoles.includes(actor.role)) {
        return jsonError("UNAUTHORIZED", "Your role cannot perform this action.", 403);
      }
      const result = await transitionReservation(reservationId, to, actor, body.reason);
      if (!result.ok) return jsonError(result.error, result.message, 409);
      return jsonOk(result.data);
    }
    case "assign_room": {
      if (!["admin", "super_admin", "front_desk", "reservations"].includes(actor.role)) {
        return jsonError("UNAUTHORIZED", "Your role cannot assign rooms.", 403);
      }
      if (!body.roomNumber) return jsonError("VALIDATION_ERROR", "roomNumber is required.");
      const result = await assignRoom(reservationId, String(body.roomNumber), actor);
      if (!result.ok) return jsonError(result.error, result.message, 409);
      return jsonOk(result.data);
    }
    case "cancel": {
      const result = await cancelBooking(reservationId, { uid: actor.uid, type: "staff", role: actor.role }, body.reason);
      if (!result.ok) return jsonError(result.error, result.message, 409);
      return jsonOk(result.data);
    }
    default:
      return jsonError("VALIDATION_ERROR", "Unknown action.");
  }
}
