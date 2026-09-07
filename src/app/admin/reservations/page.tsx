"use client";
import { useState } from "react";

export default function AdminReservations() {
  const [search, setSearch] = useState("");
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-[#222] mb-1">Reservations</h1>
          <p className="text-sm text-[#666]">Manage guest bookings, confirmations, and check-ins.</p>
        </div>
      </div>
      <div className="bg-white border border-[#ece6dd] rounded-md p-4 flex gap-3">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or reference..." className="flex-1 text-sm bg-transparent outline-none placeholder:text-stone-400" />
      </div>
      <div className="bg-white border border-[#ece6dd] rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#f8f5f0] border-b border-[#ece6dd]">
            <tr>
              <th className="text-left p-4 font-condensed uppercase tracking-wider text-xs text-[#666]">Reference</th>
              <th className="text-left p-4 font-condensed uppercase tracking-wider text-xs text-[#666]">Guest</th>
              <th className="text-left p-4 font-condensed uppercase tracking-wider text-xs text-[#666]">Room</th>
              <th className="text-left p-4 font-condensed uppercase tracking-wider text-xs text-[#666]">Dates</th>
              <th className="text-left p-4 font-condensed uppercase tracking-wider text-xs text-[#666]">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colSpan={5} className="p-8 text-center text-[#666]">Connect Firebase Firestore to see live reservations.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
