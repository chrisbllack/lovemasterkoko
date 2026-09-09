import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Server-side Firebase Admin SDK bootstrap.
 * Requires FIREBASE_SERVICE_ACCOUNT_JSON (the full service-account JSON) in env.
 * All server-authoritative booking writes flow through this module.
 */

let _db: Firestore | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;

export function getAdminApp(): App {
  const existing = getApps().find((a) => a.name === "banky-server");
  if (existing) return existing;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not set. Add the Firebase service-account JSON in Settings → Environment.",
    );
  }
  let credsJson: object;
  try {
    credsJson = JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON.");
  }
  return initializeApp({ credential: cert(credsJson as Parameters<typeof cert>[0]) }, "banky-server");
}

/** Lazy singletons so module import doesn't throw at build time. */
export function serverDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  _db.settings({ ignoreUndefinedProperties: true });
  return _db;
}

export function serverAuth() {
  if (_auth) return _auth;
  _auth = getAuth(getAdminApp());
  return _auth;
}

/** Collection names (single authoritative naming for the booking domain). */
export const COL = {
  roomTypes: "room_types",
  physicalRooms: "physical_rooms",
  ratePlans: "rate_plans",
  rateRules: "rate_rules",
  inventoryBlocks: "inventory_blocks",
  reservations: "reservations",
  holds: "booking_holds",
  promos: "promotions",
  addons: "addons",
  guests: "guests",
  payments: "payments",
  refunds: "refunds",
  auditLogs: "audit_logs",
  idempotency: "idempotency_keys",
} as const;
