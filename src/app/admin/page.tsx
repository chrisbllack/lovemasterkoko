"use client";
import { useState, useEffect } from "react";
import { CalendarRange, BedDouble, Users, DollarSign, MessageCircle } from "lucide-react";
import { naira } from "@/lib/hotel";

function StatCard({ icon: Icon, label, value, color }: { icon: typeof CalendarRange; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white border border-[#ece6dd] p-6 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <span className="eyebrow text-[#666]">{label}</span>
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${color}`}><Icon className="h-5 w-5" /></div>
      </div>
      <span className="font-display text-3xl text-[#222]">{value}</span>
    </div>
  );
}

export default function AdminOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-[#222] mb-1">Dashboard Overview</h1>
        <p className="text-sm text-[#666]">Welcome back. Here&apos;s your hotel at a glance.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BedDouble} label="Total Rooms" value="28" color="bg-[#aa8453]/10 text-[#aa8453]" />
        <StatCard icon={CalendarRange} label="Today&apos;s Arrivals" value="—" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Users} label="In House" value="—" color="bg-blue-100 text-blue-600" />
        <StatCard icon={DollarSign} label="Revenue (Month)" value={naira(0)} color="bg-amber-100 text-amber-600" />
      </div>
      <div className="bg-white border border-[#ece6dd] rounded-md p-6">
        <h2 className="font-display text-xl text-[#222] mb-4">Recent Reservations</h2>
        <p className="text-sm text-[#666]">No reservations yet. Connect Firebase Firestore to see live data.</p>
      </div>
    </div>
  );
}
