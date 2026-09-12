"use client";
import { useState, useEffect } from "react";
import { CalendarRange, BedDouble, Users, DollarSign, LogIn, LogOut } from "lucide-react";
import { naira } from "@/lib/hotel";
import type { Reservation } from "@/lib/booking/types";
import {
  RevenueTrendChart,
  DailyTrendItem,
  MonthMetadata,
} from "@/components/admin/RevenueTrendChart";

function StatCard({ icon: Icon, label, value, color }: { icon: typeof CalendarRange; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] p-6 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow text-[#666] dark:text-stone-400">{label}</span>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
      </div>
      <span className="font-display text-3xl text-[#222] dark:text-white">{value}</span>
    </div>
  );
}

export default function AdminOverview() {
  const [stats, setStats] = useState<{
    totalRooms: number;
    arrivals: number;
    departures: number;
    inHouse: number;
    revenue: number;
    recent: Reservation[];
    today: string;
    dailyTrends?: DailyTrendItem[];
    monthMetadata?: MonthMetadata;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((j) => (j.ok ? setStats(j.data) : null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    checked_in: "bg-blue-100 text-blue-700",
    checked_out: "bg-stone-200 text-stone-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-red-50 text-red-500",
    completed: "bg-emerald-50 text-emerald-600",
    inquiry: "bg-stone-100 text-stone-600",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#222] dark:text-white mb-1">Dashboard Overview</h1>
        <p className="text-sm text-[#666] dark:text-stone-400">
          {stats ? `Live operations for ${stats.today}.` : "Loading live operations…"}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={BedDouble} label="Rooms" value={stats?.totalRooms ?? "—"} color="bg-[#fbb100]/10 text-[#fbb100]" />
        <StatCard icon={LogIn} label="Arrivals Today" value={stats?.arrivals ?? "—"} color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Users} label="In House" value={stats?.inHouse ?? "—"} color="bg-blue-100 text-blue-600" />
        <StatCard icon={LogOut} label="Departures Today" value={stats?.departures ?? "—"} color="bg-stone-200 text-stone-700" />
        <StatCard icon={DollarSign} label="Revenue (Month)" value={stats ? naira(stats.revenue / 100) : "—"} color="bg-amber-100 text-amber-600" />
      </div>

      {/* Daily Revenue Trends Line Chart (Recharts) */}
      <RevenueTrendChart
        data={stats?.dailyTrends ?? []}
        metadata={stats?.monthMetadata}
        totalRevenueNaira={stats ? Math.round(stats.revenue / 100) : 0}
        loading={loading}
      />

      <div className="bg-white dark:bg-[#1a1815] border border-[#ece6dd] dark:border-[#2e2b26] rounded-md p-6">
        <h2 className="font-display text-xl text-[#222] dark:text-white mb-4">Recent Reservations</h2>
        {loading ? (
          <p className="text-sm text-[#666]">Loading…</p>
        ) : !stats || stats.recent.length === 0 ? (
          <p className="text-sm text-[#666] dark:text-stone-400">No reservations yet. New bookings from the website will appear here in real time.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#ece6dd] dark:border-[#2e2b26] text-left">
                  <th className="p-2 font-condensed uppercase tracking-wider text-xs text-[#666]">Ref</th>
                  <th className="p-2 font-condensed uppercase tracking-wider text-xs text-[#666]">Guest</th>
                  <th className="p-2 font-condensed uppercase tracking-wider text-xs text-[#666]">Room</th>
                  <th className="p-2 font-condensed uppercase tracking-wider text-xs text-[#666]">Dates</th>
                  <th className="p-2 font-condensed uppercase tracking-wider text-xs text-[#666]">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((r) => (
                  <tr key={r.id} className="border-b border-[#ece6dd]/60 dark:border-[#2e2b26]/60 last:border-0">
                    <td className="p-2 font-medium text-[#222] dark:text-white">{r.reference}</td>
                    <td className="p-2 text-[#444] dark:text-stone-300">{r.guestName}</td>
                    <td className="p-2 text-[#444] dark:text-stone-300">{r.roomTypeName}{r.assignedRoomNumber ? ` · Rm ${r.assignedRoomNumber}` : ""}</td>
                    <td className="p-2 text-[#444] dark:text-stone-300">{r.checkIn} → {r.checkOut}</td>
                    <td className="p-2"><span className={`px-2 py-0.5 rounded-full text-xs ${statusStyles[r.status] ?? "bg-stone-100"}`}>{r.status}</span></td>
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
