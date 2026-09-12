"use client";
import { ROOMS, naira } from "@/lib/hotel";
import { Pencil } from "lucide-react";

export default function AdminRooms() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[#222] mb-1">Rooms Management</h1>
        <p className="text-sm text-[#666]">Manage room categories, rates, and availability.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROOMS.map((room) => (
          <div key={room.slug} className="bg-white border border-[#ece6dd] rounded-2xl overflow-hidden shadow-sm">
            <img src={room.image} alt={room.name} className="w-full h-40 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg text-[#222]">{room.name}</h3>
                <button className="p-1.5 text-[#666] hover:text-[#fbb100] transition-colors"><Pencil className="h-4 w-4" /></button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#666]">{room.qty} units · {room.occupancy}</span>
                <span className="font-display text-[#fbb100]">{naira(room.rate)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
