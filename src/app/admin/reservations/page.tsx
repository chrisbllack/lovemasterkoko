"use client";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, KeyRound, XCircle, LogIn, LogOut } from "lucide-react";
import { naira } from "@/lib/hotel";
import type { Reservation, ReservationStatus } from "@/lib/booking/types";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  checked_in: "bg-blue-100 text-blue-700",
  checked_out: "bg-stone-200 text-stone-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-red-50 text-red-500",
  completed: "bg-emerald-50 text-emerald-600",
  inquiry: "bg-stone-100 text-stone-600",
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reservations?limit=200");
      const j = await res.json();
      if (j.ok) setReservations(j.data.reservations);
      else if (j.error === "UNAUTHORIZED") setAuthError(true);
    } catch {
      /* leave list empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const act = useCallback(
    async (reservationId: string, body: Record<string, unknown>) => {
      setBusyId(reservationId);
      setMessage(null);
      try {
        const res = await fetch("/api/admin/reservations/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reservationId, ...body }),
        });
        const j = await res.json();
        setMessage(j.ok ? "Done." : j.message || "Action failed.");
        if (j.ok) await load();
      } catch {
        setMessage("Action failed.");
      } finally {
        setBusyId(null);
      }
    },
    [load],
  );

  const filtered = reservations.filter((r) => {
    const s = search.toLowerCase();
    return (
      !s ||
      r.reference.toLowerCase().includes(s) ||
      r.guestName.toLowerCase().includes(s) ||
      r.guestEmail.toLowerCase().includes(s)
    );
  });

  if (authError) {
    return (
      <div className="bg-white dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] rounded-md p-10 text-center">
        <h2 className="font-display text-xl text-[#222] dark:text-white mb-2">Staff sign-in required</h2>
        <p className="text-sm text-[#666] dark:text-stone-400">
          Sign in with a staff account to view and manage reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#222] dark:text-white mb-1">Reservations</h1>
          <p className="text-sm text-[#666] dark:text-stone-400">Manage bookings, confirmations, check-ins and room assignment.</p>
        </div>
        <button onClick={load} className="text-xs font-condensed uppercase tracking-wider text-[#666] hover:text-[var(--accent)] inline-flex items-center gap-1">
          <Search className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {message && <div className="p-3 bg-[#fbf9f5] dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] rounded text-sm text-[#444] dark:text-stone-300">{message}</div>}

      <div className="bg-white dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] rounded-md p-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or reference…" aria-label="Search reservations" className="w-full text-sm bg-transparent outline-none placeholder:text-stone-400 text-stone-900 dark:text-white" />
      </div>

      <div className="bg-white dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] rounded-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#666] text-sm">Loading reservations…</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#666] dark:text-stone-400 text-sm">No reservations match.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f8f5f0] dark:bg-[#232019] border-b border-[#ece6dd] dark:border-[#2e2b26]">
                <tr>
                  {["Reference", "Guest", "Room", "Dates", "Total", "Status", "Payment", "Actions"].map((h) => (
                    <th key={h} className="text-left p-3 font-condensed uppercase tracking-wider text-xs text-[#666] dark:text-stone-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-[#ece6dd]/60 dark:border-[#2e2b26]/60 last:border-0 align-top">
                    <td className="p-3 font-medium text-[#222] dark:text-white whitespace-nowrap">{r.reference}</td>
                    <td className="p-3 text-[#444] dark:text-stone-300">
                      <div>{r.guestName}</div>
                      <div className="text-xs text-[#999]">{r.guestEmail}</div>
                    </td>
                    <td className="p-3 text-[#444] dark:text-stone-300 whitespace-nowrap">
                      {r.roomTypeName}
                      <div className="text-xs text-[#999]">{r.assignedRoomNumber ? `Rm ${r.assignedRoomNumber}` : "unassigned"}</div>
                    </td>
                    <td className="p-3 text-[#444] dark:text-stone-300 whitespace-nowrap text-xs">{r.checkIn} → {r.checkOut}<div className="text-[#999]">{r.nights}n · {r.adults + r.children} guests</div></td>
                    <td className="p-3 text-[#444] dark:text-stone-300 whitespace-nowrap">{naira(r.pricing.grandTotal / 100)}<div className="text-xs text-[#999]">paid {naira(r.pricing.amountPaid / 100)}</div></td>
                    <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs whitespace-nowrap ${STATUS_STYLES[r.status] ?? "bg-stone-100"}`}>{r.status}</span></td>
                    <td className="p-3 text-xs text-[#444] dark:text-stone-300 whitespace-nowrap">{r.paymentStatus}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1.5">
                        {busyId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#aa8453]" />
                        ) : (
                          <>
                            {r.status === "confirmed" && (
                              <button onClick={() => act(r.id, { action: "transition", status: "checked_in" })} title="Check in" className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                                <LogIn className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {r.status === "checked_in" && (
                              <button onClick={() => act(r.id, { action: "transition", status: "checked_out" })} title="Check out" className="p-1.5 rounded bg-stone-100 text-stone-600 hover:bg-stone-200">
                                <LogOut className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {["pending", "confirmed"].includes(r.status) && !r.assignedRoomNumber && (
                              <button
                                onClick={() => {
                                  const n = window.prompt("Assign room number:");
                                  if (n) act(r.id, { action: "assign_room", roomNumber: n.trim() });
                                }}
                                title="Assign room"
                                className="p-1.5 rounded bg-[#aa8453]/10 text-[#aa8453] hover:bg-[#aa8453]/20"
                              >
                                <KeyRound className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {["pending", "confirmed"].includes(r.status) && (
                              <button
                                onClick={() => {
                                  const reason = window.prompt("Cancellation reason:");
                                  if (reason !== null) act(r.id, { action: "cancel", reason });
                                }}
                                title="Cancel"
                                className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
