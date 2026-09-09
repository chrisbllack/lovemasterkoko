"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Clock,
  Flame,
  CheckCircle2,
  Utensils,
  Bell,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Send,
  Coffee,
  Wine,
  RefreshCw,
  PhoneCall,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MenuCategory,
  MenuItem,
  CartItem,
  QrOrder,
  DietaryTag,
} from "@/lib/qr-menu/types";
import {
  subscribeMenuCategories,
  subscribeMenuItems,
  submitGuestOrder,
  formatNaira,
} from "@/lib/qr-menu/store";

function QrMenuContent() {
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get("room") || searchParams.get("table") || "";
  const initialType = searchParams.get("table") ? "table" : "room";

  // Data state
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Navigation
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  // Cart state
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout form
  const [roomOrTable, setRoomOrTable] = useState(initialRoom);
  const [orderType, setOrderType] = useState<"room" | "table" | "poolside_garden">(
    (initialType as "room" | "table") || "room"
  );
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<QrOrder | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Subscribe to real-time menu categories and items
  useEffect(() => {
    const unsubCats = subscribeMenuCategories((newCats) => {
      setCategories(newCats.filter((c) => c.isActive));
    });

    const unsubItems = subscribeMenuItems((newItems) => {
      setItems(newItems);
      setLoading(false);
    });

    return () => {
      unsubCats();
      unsubItems();
    };
  }, []);

  // Update roomOrTable if searchParams change
  useEffect(() => {
    if (initialRoom && !roomOrTable) {
      setRoomOrTable(initialRoom);
    }
  }, [initialRoom, roomOrTable]);

  // Cart totals
  const totalItemsCount = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return Object.values(cart).reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  }, [cart]);

  // Add / reduce item in cart
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existing = prev[item.id];
      const newQty = existing ? existing.quantity + 1 : 1;
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: newQty,
        },
      };
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return {
        ...prev,
        [itemId]: {
          ...existing,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category match
      if (activeCategoryId !== "all" && item.categoryId !== activeCategoryId) {
        return false;
      }
      // Dietary filter
      if (selectedTag !== "all" && !item.dietary?.includes(selectedTag as DietaryTag)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchCat = item.categoryName?.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCat;
      }
      return true;
    });
  }, [items, activeCategoryId, selectedTag, searchQuery]);

  // Handle Order Submit
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomOrTable.trim()) {
      setSubmitError("Please enter your Room Number or Table Location.");
      return;
    }
    if (totalItemsCount === 0) {
      setSubmitError("Your order basket is empty.");
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const orderItems = Object.values(cart).map((ci) => ({
        id: ci.item.id,
        title: ci.item.title,
        categoryName: ci.item.categoryName,
        price: ci.item.price,
        quantity: ci.quantity,
        subtotal: ci.item.price * ci.quantity,
        notes: ci.notes,
      }));

      const newOrder = await submitGuestOrder({
        roomOrTable: roomOrTable.trim(),
        orderType,
        guestName: guestName.trim() || undefined,
        guestPhone: guestPhone.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
        items: orderItems,
        totalAmount,
        totalItems: totalItemsCount,
      });

      setPlacedOrder(newOrder);
      setCart({});
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      setSubmitError("Unable to transmit order to the kitchen. Please try again or call Front Desk.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compose WhatsApp message for concierge/kitchen notification
  const getWhatsAppLink = (order: QrOrder) => {
    const hotelNumber = "2348037166121"; // Banky Hotel Official WhatsApp / Phone
    const itemsList = order.items.map((i) => `• ${i.quantity}x ${i.title} (${formatNaira(i.subtotal)})`).join("%0A");
    const msg = `*NEW ORDER - BANKY HOTEL & SUITES*%0A%0A*Order #:* ${order.orderNumber}%0A*Location:* ${order.roomOrTable} (${order.orderType})%0A${order.guestName ? `*Guest:* ${order.guestName}%0A` : ""}${order.specialInstructions ? `*Special Notes:* ${order.specialInstructions}%0A` : ""}%0A*Items:*%0A${itemsList}%0A%0A*Total:* ${formatNaira(order.totalAmount)}%0A%0A_Sent via In-Room QR Dining_`;
    return `https://wa.me/${hotelNumber}?text=${msg}`;
  };

  return (
    <div className="min-h-screen bg-[#11100f] text-[#f4efe6] pb-32">
      {/* ── Top Hospitality Header ── */}
      <header className="sticky top-0 z-40 bg-[#171614]/95 backdrop-blur-md border-b border-stone-800/80 shadow-lg">
        <div className="max-w-xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#aa8453]/40 bg-[#222] p-1 flex-shrink-0">
              <Image
                src="/images/Banky Hotel & Suites Main Logo 1.png"
                alt="Banky Hotel Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <h1 className="font-display text-base sm:text-lg text-white font-medium tracking-wide leading-tight">
                Banky Hotel & Suites
              </h1>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[#aa8453] font-medium uppercase tracking-wider text-[10px]">
                  Room & Table Dining
                </span>
                {roomOrTable && (
                  <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                    {roomOrTable}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalItemsCount > 0 && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-[#aa8453] text-white rounded-full shadow-md active:scale-95 transition-transform"
                aria-label="View Cart"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-white text-[#111] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow">
                  {totalItemsCount}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* ── Search Bar ── */}
        <div className="max-w-xl mx-auto px-4 pb-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, pepper soup, jollof…"
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#aa8453] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 p-1 text-stone-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ── Category Horizontal Scrolling Bar ── */}
        <div className="max-w-xl mx-auto px-4 pb-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
          <button
            onClick={() => setActiveCategoryId("all")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
              activeCategoryId === "all"
                ? "bg-[#aa8453] text-white shadow-md shadow-[#aa8453]/20"
                : "bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-stone-700"
            }`}
          >
            All Items ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            const isActive = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-[#aa8453] text-white shadow-md shadow-[#aa8453]/20"
                    : "bg-stone-900/80 text-stone-400 border border-stone-800 hover:border-stone-700"
                }`}
              >
                {cat.name} {count > 0 && <span className="opacity-60 text-[10px] ml-1 font-mono">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* ── Dietary Quick Filter Pills ── */}
        <div className="max-w-xl mx-auto px-4 pb-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-stone-500 mr-1 flex-shrink-0">Filter:</span>
          {["all", "Chef Special", "Spicy", "Vegetarian", "Seafood", "Gluten-Free"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-2.5 py-0.5 rounded-md flex-shrink-0 transition-colors ${
                selectedTag === tag
                  ? "bg-stone-200 text-stone-900 font-semibold"
                  : "bg-stone-900 text-stone-400 border border-stone-800 hover:text-stone-200"
              }`}
            >
              {tag === "all" ? "All Tags" : tag}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Food & Drink Feed ── */}
      <main className="max-w-xl mx-auto px-4 pt-4">
        {/* Banner: In-room delivery notification */}
        <div className="mb-4 bg-gradient-to-r from-stone-900 via-[#1c1a17] to-stone-900 border border-[#aa8453]/30 rounded-xl p-3 flex items-center justify-between text-xs text-stone-300 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#aa8453]/20 text-[#aa8453]">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-white font-medium">Freshly Cooked To Order</p>
              <p className="text-stone-400 text-[11px]">Average prep & room delivery: 15–30 mins</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
              Kitchen Open
            </span>
          </div>
        </div>

        {/* Active Category Heading */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg text-white font-normal flex items-center gap-2">
            {activeCategoryId === "all"
              ? "All Dishes & Drinks"
              : categories.find((c) => c.id === activeCategoryId)?.name || "Menu Items"}
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && !loading && (
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-8 text-center my-8">
            <Utensils className="h-10 w-10 text-stone-600 mx-auto mb-3" />
            <p className="text-stone-300 font-medium">No dishes found</p>
            <p className="text-stone-500 text-xs mt-1">
              Try searching for something else or reset the category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategoryId("all");
                setSearchQuery("");
                setSelectedTag("all");
              }}
              className="mt-4 px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs font-medium hover:bg-stone-700"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Items Grid */}
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const cartEntry = cart[item.id];
            const qty = cartEntry?.quantity || 0;
            const isOutOfStock = !item.isAvailable;

            return (
              <article
                key={item.id}
                className={`relative bg-[#181715] border rounded-2xl p-3.5 transition-all duration-200 flex gap-3.5 ${
                  isOutOfStock
                    ? "border-stone-800/50 opacity-60 bg-stone-900/40"
                    : "border-stone-800/80 hover:border-stone-700 shadow-sm hover:shadow-md"
                }`}
              >
                {/* Food Image Thumbnail with Next.js Image */}
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 rounded-xl overflow-hidden bg-stone-900 border border-stone-800">
                  <Image
                    src={imageErrors[item.id] ? "/images/dining.jpg" : item.imageUrl || "/images/dining.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 112px, 120px"
                    className={`object-cover transition-transform duration-500 ${isOutOfStock ? "grayscale" : "group-hover:scale-105"}`}
                    onError={() => {
                      setImageErrors((prev) => ({ ...prev, [item.id]: true }));
                    }}
                    loading="lazy"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] flex items-center justify-center p-1 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/90 px-1.5 py-0.5 rounded border border-red-800/50">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {item.isFeatured && !isOutOfStock && (
                    <div className="absolute top-1.5 left-1.5 bg-[#aa8453]/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow">
                      Popular
                    </div>
                  )}
                </div>

                {/* Content details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="font-display text-sm sm:text-base text-white font-medium leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                    </div>

                    {/* Dietary Tags */}
                    {item.dietary && item.dietary.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.dietary.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                              tag === "Spicy"
                                ? "bg-red-950/80 text-red-400 border border-red-900/50"
                                : tag === "Chef Special"
                                ? "bg-amber-950/80 text-amber-300 border border-amber-900/50"
                                : tag === "Vegetarian"
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-900/50"
                                : tag === "Platter"
                                ? "bg-purple-950/80 text-purple-300 border border-purple-900/50"
                                : "bg-stone-800 text-stone-300"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-stone-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800/60">
                    <div>
                      <span className="font-display text-base font-semibold text-[#c89e63] tracking-tight">
                        {formatNaira(item.price)}
                      </span>
                      {item.preparationTime && (
                        <span className="text-[10px] text-stone-500 block">
                          ~{item.preparationTime}
                        </span>
                      )}
                    </div>

                    {/* Ordering Actions */}
                    {isOutOfStock ? (
                      <span className="text-[11px] text-stone-500 italic bg-stone-900 px-2.5 py-1 rounded-md border border-stone-800">
                        Unavailable
                      </span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => addToCart(item)}
                        className="h-8 px-3.5 bg-[#aa8453] hover:bg-[#967344] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 active:scale-95 transition-all shadow-sm shadow-[#aa8453]/20"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-lg p-0.5">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-7 w-7 flex items-center justify-center text-stone-300 hover:text-white bg-stone-800 rounded active:scale-90 transition-transform"
                          aria-label="Reduce quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white font-mono min-w-[1.2rem] text-center">
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="h-7 w-7 flex items-center justify-center text-white bg-[#aa8453] rounded active:scale-90 transition-transform"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Need Assistance Quick Banner */}
        <div className="mt-8 mb-4 p-4 rounded-xl bg-stone-900/50 border border-stone-800/80 text-center">
          <p className="text-xs text-stone-400">
            Have food allergies or specific dietary requests?
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <a
              href="tel:08037166121"
              className="inline-flex items-center gap-1.5 text-xs text-[#aa8453] hover:underline font-medium"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Call In-House Restaurant: 0803 716 6121
            </a>
          </div>
        </div>
      </main>

      {/* ── Floating "View Order" Cart Banner at Bottom ── */}
      <AnimatePresence>
        {totalItemsCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-4 inset-x-0 z-50 px-4 max-w-xl mx-auto"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full h-14 bg-gradient-to-r from-[#aa8453] via-[#b6915f] to-[#aa8453] text-white rounded-2xl px-5 flex items-center justify-between shadow-2xl shadow-black/80 border border-white/20 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center font-mono font-bold text-xs">
                  {totalItemsCount}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-sm tracking-wide block leading-tight">
                    View Your Order
                  </span>
                  <span className="text-[11px] text-white/80">
                    Tap to checkout & specify room
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-tight">
                  {formatNaira(totalAmount)}
                </span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Checkout Drawer / Cart Modal ── */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm">
            {/* Backdrop click */}
            <div
              className="flex-1"
              onClick={() => setIsCartOpen(false)}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="bg-[#171614] border-t border-stone-800 rounded-t-3xl max-w-xl w-full mx-auto max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Drawer handle & header */}
              <div className="p-4 border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#aa8453]/20 text-[#aa8453]">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-white font-medium">
                      In-House Dining Cart
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-full bg-stone-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Items list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Object.values(cart).map(({ item, quantity }) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-stone-900/70 border border-stone-800 p-3 rounded-xl"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-medium text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#aa8453] font-mono mt-0.5">
                        {formatNaira(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-lg p-0.5">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="h-6 w-6 flex items-center justify-center text-stone-300 hover:text-white bg-stone-800 rounded active:scale-90"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-white font-mono min-w-[1rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="h-6 w-6 flex items-center justify-center text-white bg-[#aa8453] rounded active:scale-90"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="w-16 text-right font-display text-xs font-semibold text-white">
                        {formatNaira(item.price * quantity)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Delivery Information Form */}
                <form id="qr-checkout-form" onSubmit={handlePlaceOrder} className="pt-3 space-y-3">
                  <div className="border-t border-stone-800 pt-3">
                    <label className="text-xs font-semibold text-stone-300 block mb-2 uppercase tracking-wider">
                      Delivery Destination <span className="text-red-400">*</span>
                    </label>

                    {/* Order Type Toggle */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { id: "room", label: "Room Service" },
                        { id: "table", label: "Restaurant Table" },
                        { id: "poolside_garden", label: "Open Bar / Sitout" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setOrderType(t.id as "room" | "table" | "poolside_garden")}
                          className={`py-2 px-1 text-center rounded-lg text-xs font-medium border transition-colors ${
                            orderType === t.id
                              ? "bg-[#aa8453] text-white border-[#aa8453]"
                              : "bg-stone-900 text-stone-400 border-stone-800 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Room or Table Input (Crucial) */}
                    <div>
                      <input
                        type="text"
                        required
                        value={roomOrTable}
                        onChange={(e) => setRoomOrTable(e.target.value)}
                        placeholder={
                          orderType === "room"
                            ? "e.g. Room 204 or Executive Suite 3"
                            : orderType === "table"
                            ? "e.g. Table 4 (Main Hall)"
                            : "e.g. Poolside Table 2 or Garden Sitout"
                        }
                        className="w-full h-11 px-3.5 rounded-xl bg-stone-950 border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#aa8453]"
                      />
                    </div>
                  </div>

                  {/* Guest Name & Phone (Optional) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">
                        Guest Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Mr. David"
                        className="w-full h-9 px-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#aa8453]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">
                        Phone / WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="e.g. 080..."
                        className="w-full h-9 px-3 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#aa8453]"
                      />
                    </div>
                  </div>

                  {/* Special Cooking Instructions */}
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">
                      Special Cooking Notes or Allergies (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Less spicy, extra serviettes, ice on the side, well done..."
                      className="w-full p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#aa8453] resize-none"
                    />
                  </div>

                  {submitError && (
                    <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                      <Info className="h-4 w-4 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Drawer footer / checkout action */}
              <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">{formatNaira(totalAmount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Delivery & Service</span>
                  <span className="text-emerald-400 font-mono">Complimentary In-House</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold text-white pt-1 border-t border-stone-800">
                  <span>Total Amount</span>
                  <span className="text-[#aa8453] font-display text-lg">
                    {formatNaira(totalAmount)}
                  </span>
                </div>

                <button
                  type="submit"
                  form="qr-checkout-form"
                  disabled={isSubmitting || totalItemsCount === 0}
                  className="w-full h-12 bg-[#aa8453] hover:bg-[#967344] disabled:bg-stone-800 disabled:text-stone-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#aa8453]/20 active:scale-[0.99] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending to Kitchen…</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Place In-House Order ({formatNaira(totalAmount)})</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Order Placed Confirmation Modal ── */}
      <AnimatePresence>
        {placedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#191816] border border-[#aa8453]/40 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative"
            >
              <div className="h-16 w-16 bg-emerald-950/80 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <span className="text-[11px] font-mono tracking-widest uppercase text-[#aa8453] bg-[#aa8453]/10 px-2.5 py-0.5 rounded-full border border-[#aa8453]/30">
                Order Received
              </span>

              <h3 className="font-display text-2xl text-white font-medium mt-2">
                Sent to Kitchen!
              </h3>
              <p className="text-stone-400 text-xs mt-1">
                Your order is now active and being prepared fresh by Banky Hotel chefs.
              </p>

              {/* Order summary card */}
              <div className="mt-4 bg-stone-900/90 border border-stone-800 rounded-xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Order ID</span>
                  <span className="font-mono text-white font-bold">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Destination</span>
                  <span className="text-white font-medium">{placedOrder.roomOrTable}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Total Items</span>
                  <span className="text-white">{placedOrder.totalItems} dishes & drinks</span>
                </div>
                <div className="flex justify-between items-center font-semibold pt-1 border-t border-stone-800">
                  <span className="text-stone-300">Total Amount</span>
                  <span className="text-[#aa8453] font-display text-sm">
                    {formatNaira(placedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Estimated time */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800">
                <Clock className="h-4 w-4 text-[#aa8453]" />
                <span>Estimated delivery to your room: <strong>15–25 mins</strong></span>
              </div>

              {/* Actions */}
              <div className="mt-5 space-y-2">
                <a
                  href={getWhatsAppLink(placedOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Notify Front Desk / Kitchen on WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    setIsCartOpen(false);
                  }}
                  className="w-full h-10 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium transition-colors"
                >
                  Close & Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function QrMenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121110] flex items-center justify-center text-stone-400 text-sm">Loading dining menu…</div>}>
      <QrMenuContent />
    </Suspense>
  );
}
