"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  BellOff,
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  Phone,
  MessageSquare,
  Volume2,
  VolumeX,
} from "lucide-react";
import { QrOrder, OrderStatus } from "@/lib/qr-menu/types";
import {
  subscribeOrders,
  updateOrderStatusInDb,
  playOrderChime,
  formatNaira,
} from "@/lib/qr-menu/store";

export default function AdminQrOrdersPage() {
  const [orders, setOrders] = useState<QrOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const previousOrderCountRef = useRef<number>(0);

  // Subscribe to real-time orders
  useEffect(() => {
    const unsub = subscribeOrders((newOrders) => {
      // If there are more orders than before, play sound chime
      if (
        previousOrderCountRef.current > 0 &&
        newOrders.length > previousOrderCountRef.current &&
        soundEnabled
      ) {
        playOrderChime();
      }
      previousOrderCountRef.current = newOrders.length;
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsub();
  }, [soundEnabled]);

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchLoc = o.roomOrTable.toLowerCase().includes(q);
      const matchGuest = (o.guestName || "").toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.title.toLowerCase().includes(q));
      return matchNum || matchLoc || matchGuest || matchItem;
    }
    return true;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const inProgressCount = orders.filter((o) => o.status === "in_progress").length;
  const fulfilledCount = orders.filter((o) => o.status === "fulfilled").length;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatusInDb(orderId, newStatus);
  };

  const formatTimeAgo = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins === 1) return "1 min ago";
      if (diffMins < 60) return `${diffMins} mins ago`;
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}h ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl sm:text-3xl text-stone-900 font-semibold">
              Kitchen & Bar Live Orders
            </h1>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time feed of guest orders placed from rooms, restaurant tables, and poolside sitouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playOrderChime();
            }}
            className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors ${
              soundEnabled
                ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                : "bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200"
            }`}
            title="Toggle kitchen chime sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-600" /> : <VolumeX className="h-4 w-4" />}
            <span>Chime {soundEnabled ? "Active" : "Muted"}</span>
          </button>
        </div>
      </div>

      {/* ── Operational Metric Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div
          onClick={() => setFilterStatus("all")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "all"
              ? "bg-stone-900 text-white border-stone-900 shadow-md"
              : "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
          }`}
        >
          <span className="text-xs uppercase font-medium tracking-wider opacity-80 block mb-1">
            Total Orders
          </span>
          <span className="font-display text-2xl font-bold">{orders.length}</span>
        </div>

        <div
          onClick={() => setFilterStatus("pending")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "pending"
              ? "bg-amber-500 text-white border-amber-600 shadow-md"
              : "bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs uppercase font-medium tracking-wider">Queue / New</span>
            {pendingCount > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-600 animate-ping" />
            )}
          </div>
          <span className="font-display text-2xl font-bold">{pendingCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus("in_progress")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "in_progress"
              ? "bg-blue-600 text-white border-blue-700 shadow-md"
              : "bg-blue-50 text-blue-900 border-blue-200 hover:border-blue-400"
          }`}
        >
          <span className="text-xs uppercase font-medium tracking-wider block mb-1">
            Cooking / In Prep
          </span>
          <span className="font-display text-2xl font-bold">{inProgressCount}</span>
        </div>

        <div
          onClick={() => setFilterStatus("fulfilled")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            filterStatus === "fulfilled"
              ? "bg-emerald-600 text-white border-emerald-700 shadow-md"
              : "bg-emerald-50 text-emerald-900 border-emerald-200 hover:border-emerald-400"
          }`}
        >
          <span className="text-xs uppercase font-medium tracking-wider block mb-1">
            Fulfilled Today
          </span>
          <span className="font-display text-2xl font-bold">{fulfilledCount}</span>
        </div>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-stone-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Room, Order #, Guest or Item…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-600"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending Queue" },
            { id: "in_progress", label: "In Progress" },
            { id: "fulfilled", label: "Fulfilled" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Live Orders List ── */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 text-sm">
          Connecting to kitchen order stream…
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500">
          <Utensils className="h-10 w-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-700 font-medium text-base">No active orders</p>
          <p className="text-xs text-stone-400 mt-1">
            Incoming orders scanned from rooms or restaurant tables will pop up here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const isPending = order.status === "pending";
            const isInProgress = order.status === "in_progress";
            const isFulfilled = order.status === "fulfilled";
            const isCancelled = order.status === "cancelled";

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-sm flex flex-col justify-between overflow-hidden ${
                  isPending
                    ? "border-amber-300 ring-2 ring-amber-400/20"
                    : isInProgress
                    ? "border-blue-300"
                    : isFulfilled
                    ? "border-emerald-200 opacity-90"
                    : "border-stone-200 opacity-60"
                }`}
              >
                {/* Header bar */}
                <div className="p-4 border-b border-stone-100 bg-stone-50/70 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {formatTimeAgo(order.createdAt)}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-900 text-white font-semibold text-xs tracking-wide">
                        {order.roomOrTable}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 font-mono">
                        {order.orderType}
                      </span>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div>
                    {isPending && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase tracking-wider border border-amber-300 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                        Pending
                      </span>
                    )}
                    {isInProgress && (
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider border border-blue-300">
                        In Progress
                      </span>
                    )}
                    {isFulfilled && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Fulfilled
                      </span>
                    )}
                    {isCancelled && (
                      <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[11px] font-bold uppercase tracking-wider">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Guest info & Special notes */}
                <div className="p-4 flex-1 space-y-3">
                  {(order.guestName || order.guestPhone) && (
                    <div className="text-xs text-stone-600 flex items-center justify-between pb-2 border-b border-stone-100">
                      <span>Guest: <strong>{order.guestName || "In-House Guest"}</strong></span>
                      {order.guestPhone && (
                        <a
                          href={`tel:${order.guestPhone}`}
                          className="text-blue-600 hover:underline flex items-center gap-1 font-mono"
                        >
                          <Phone className="h-3 w-3" />
                          {order.guestPhone}
                        </a>
                      )}
                    </div>
                  )}

                  {order.specialInstructions && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-amber-700">
                        Special Instructions:
                      </span>
                      {order.specialInstructions}
                    </div>
                  )}

                  {/* Order Items Table */}
                  <div className="space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-50">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded bg-stone-100 font-mono font-bold text-stone-800 flex items-center justify-center text-[11px]">
                            {item.quantity}×
                          </span>
                          <span className="text-stone-800 font-medium">{item.title}</span>
                        </div>
                        <span className="text-stone-500 font-mono">{formatNaira(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                    <span className="text-xs text-stone-500 font-medium">Total Bill</span>
                    <span className="text-base font-bold text-stone-900 font-display">
                      {formatNaira(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, "in_progress")}
                        className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <span>Start Preparing</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "cancelled")}
                        className="h-9 px-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {isInProgress && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, "fulfilled")}
                        className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Ready & Delivered</span>
                      </button>
                    </>
                  )}

                  {isFulfilled && (
                    <button
                      onClick={() => handleStatusChange(order.id, "in_progress")}
                      className="w-full h-8 text-stone-500 hover:text-stone-800 text-xs font-medium"
                    >
                      Reopen to In Progress
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
