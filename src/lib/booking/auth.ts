import "server-only";
import { serverAuth, serverDb } from "./server";
import type { ApiResult } from "./types";

export type StaffActor = { uid: string; email: string; role: string };

/**
 * Verify a Firebase ID token from the Authorization header and resolve the
 * caller's role from user_roles/{uid} (falling back to the staff email
 * allowlist). All admin APIs must call this — authorization is enforced
 * server-side, never in the UI alone.
 */
export async function requireStaff(req: Request): Promise<ApiResult<StaffActor>> {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return { ok: false, error: "UNAUTHORIZED", message: "Authentication required." };
  }
  try {
    const decoded = await serverAuth().verifyIdToken(token);
    const uid = decoded.uid;
    const email = (decoded.email ?? "").toLowerCase();

    const roleDoc = await serverDb().collection("user_roles").doc(uid).get();
    const roleFromDoc = (roleDoc.data()?.role as string | undefined) ?? "";
    const allowlist = [
      "bankyhotelado@gmail.com",
      "chrisbllack@gmail.com",
      "admin@bankyhotelandsuites.com",
      "chrisbllackaidev@gmail.com",
      "infinityplussolutionsss@gmail.com",
    ];
    const role = roleFromDoc || (allowlist.includes(email) ? "admin" : "");

    if (!role) {
      return { ok: false, error: "UNAUTHORIZED", message: "Staff access required." };
    }
    return { ok: true, data: { uid, email, role } };
  } catch {
    return { ok: false, error: "UNAUTHORIZED", message: "Invalid or expired session token." };
  }
}

export function jsonError(error: string, message: string, status = 400): Response {
  return Response.json({ ok: false, error, message }, { status });
}

export function jsonOk<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data }, { status });
}
