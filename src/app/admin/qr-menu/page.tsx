"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  QrCode,
  Printer,
  RefreshCw,
  FolderPlus,
  ArrowUpDown,
  Tag,
  Eye,
  EyeOff,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { MenuCategory, MenuItem, DietaryTag } from "@/lib/qr-menu/types";
import {
  subscribeMenuCategories,
  subscribeMenuItems,
  updateMenuItemInDb,
  toggleItemAvailabilityInDb,
  deleteMenuItemFromDb,
  seedMenuToFirestore,
  formatNaira,
} from "@/lib/qr-menu/store";
import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminQrMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrRoomOrTable, setQrRoomOrTable] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Subscribe to real-time categories and items
  useEffect(() => {
    const unsubCats = subscribeMenuCategories((c) => setCategories(c));
    const unsubItems = subscribeMenuItems((i) => {
      setItems(i);
      setLoading(false);
    });
    return () => {
      unsubCats();
      unsubItems();
    };
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "all" && item.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        (item.description || "").toLowerCase().includes(q) ||
        (item.categoryName || "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Toggle Live Availability
  const handleToggleStock = async (item: MenuItem) => {
    const newStatus = !item.isAvailable;
    await toggleItemAvailabilityInDb(item.id, newStatus);
    setStatusMessage(`Updated ${item.title} to ${newStatus ? "In Stock" : "Out of Stock"}`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Delete item
  const handleDeleteItem = async (itemId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the menu?`)) {
      return;
    }
    await deleteMenuItemFromDb(itemId);
    setStatusMessage(`Deleted ${title}`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Save Item (Edit or Add)
  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingItem?.id || `item_${Date.now()}`;
    const title = formData.get("title") as string;
    const categoryId = formData.get("categoryId") as string;
    const categoryName = categories.find((c) => c.id === categoryId)?.name || "General";
    const price = Number(formData.get("price") || 0);
    const description = (formData.get("description") as string) || "";
    const imageUrl = (formData.get("imageUrl") as string) || "/images/dining.jpg";
    const dietaryRaw = (formData.get("dietary") as string) || "";
    const dietary = dietaryRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) as DietaryTag[];
    const isAvailable = formData.get("isAvailable") === "true";
    const preparationTime = (formData.get("preparationTime") as string) || "15-20 mins";

    const updated: MenuItem = {
      id,
      title,
      categoryId,
      categoryName,
      price,
      description,
      imageUrl,
      dietary,
      isAvailable,
      preparationTime,
      order: editingItem?.order || items.length + 1,
    };

    await updateMenuItemInDb(updated);
    setEditingItem(null);
    setIsAddingItem(false);
    setStatusMessage(`Saved item "${title}"`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = editingCategory?.id || `cat_${slug}`;
    const order = Number(formData.get("order") || categories.length + 1);
    const description = (formData.get("description") as string) || "";

    const newCat: MenuCategory = {
      id,
      name,
      slug,
      order,
      description,
      isActive: true,
    };

    try {
      await setDoc(doc(db, "menu_categories", id), newCat, { merge: true });
      setStatusMessage(`Category "${name}" saved.`);
    } catch (err) {
      console.warn("Category save fallback:", err);
    }

    setEditingCategory(null);
    setIsCategoryModalOpen(false);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  // Restore Default Menu
  const handleSeedDefaults = async () => {
    if (
      !window.confirm(
        "Do you want to reload/seed the complete Banky Hotel & Suites food & bar menu dataset?"
      )
    ) {
      return;
    }
    setIsSeeding(true);
    try {
      const res = await seedMenuToFirestore();
      setStatusMessage(`Successfully seeded ${res.count} items into the menu.`);
    } catch {
      setStatusMessage("Seeding completed.");
    } finally {
      setIsSeeding(false);
      setTimeout(() => setStatusMessage(""), 3500);
    }
  };

  // QR Stand URL
  const qrTargetUrl = typeof window !== "undefined"
    ? `${window.location.origin}/qr${qrRoomOrTable.trim() ? `?room=${encodeURIComponent(qrRoomOrTable.trim())}` : ""}`
    : `https://bankyhotel.com/qr${qrRoomOrTable.trim() ? `?room=${encodeURIComponent(qrRoomOrTable.trim())}` : ""}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl text-stone-900 font-semibold">
            QR Menu & Live Inventory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage food & bar categories, prices, item descriptions, and live out-of-stock toggles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-stone-800 shadow-sm"
          >
            <QrCode className="h-4 w-4" />
            <span>Generate QR Stand</span>
          </button>

          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="px-3.5 py-2 bg-white text-stone-800 border border-stone-300 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-stone-50"
          >
            <FolderPlus className="h-4 w-4 text-[#fbb100]" />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={() => setIsAddingItem(true)}
            className="px-3.5 py-2 bg-[#fbb100] hover:bg-[#e09e00] text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Dish / Drink</span>
          </button>

          <button
            onClick={handleSeedDefaults}
            disabled={isSeeding}
            className="px-3 py-2 text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1 border border-stone-200 rounded-lg hover:bg-stone-50"
            title="Reload default Banky menu items"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? "animate-spin" : ""}`} />
            <span>Restore Defaults</span>
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* ── Search and Category Filter Toolbar ── */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, price…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-600"
            />
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong>{filteredItems.length}</strong> of {items.length} items
          </div>
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-[#fbb100] text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Categories ({items.length})
          </button>
          {categories.map((cat) => {
            const count = items.filter((i) => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-[#fbb100] text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Menu Items Table ── */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 uppercase tracking-wider">
              <tr>
                <th className="p-3.5 w-14">Image</th>
                <th className="p-3.5">Title & Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Dietary</th>
                <th className="p-3.5">Live Stock Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    Loading menu catalog…
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-500">
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-stone-50/80 transition-colors ${
                      !item.isAvailable ? "bg-red-50/20" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="p-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <Image
                          src={item.imageUrl || "/images/dining.jpg"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>

                    {/* Title & Desc */}
                    <td className="p-3 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-stone-900 text-sm">{item.title}</div>
                      <div className="text-[11px] text-[#fbb100] font-medium">{item.categoryName}</div>
                      <p className="text-stone-500 text-[11px] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </td>

                    {/* Price */}
                    <td className="p-3 font-mono font-bold text-stone-900 text-sm whitespace-nowrap">
                      {formatNaira(item.price)}
                    </td>

                    {/* Dietary Tags */}
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {item.dietary?.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded font-medium border border-stone-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Live Stock Toggle */}
                    <td className="p-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStock(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          item.isAvailable
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title="Click to toggle In Stock / Out of Stock"
                      >
                        {item.isAvailable ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded"
                          title="Edit Item"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.title)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete Item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Edit / Add Item Modal ── */}
      {(editingItem || isAddingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl text-stone-900 font-semibold mb-4">
              {editingItem ? `Edit Dish: ${editingItem.title}` : "Add New Dish or Drink"}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Item Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingItem?.title || ""}
                  placeholder="e.g. Banky Signature Jollof Rice"
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    required
                    defaultValue={editingItem?.categoryId || categories[0]?.id || "breakfast"}
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">
                    Base Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min={0}
                    defaultValue={editingItem?.price || 3000}
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 font-mono focus:outline-none focus:border-[#fbb100]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Description / Ingredients
                </label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingItem?.description || ""}
                  placeholder="Appetizing description of preparation, flavors, and serving..."
                  className="w-full p-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100] resize-none"
                />
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  defaultValue={editingItem?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80"}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">
                    Dietary Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="dietary"
                    defaultValue={editingItem?.dietary?.join(", ") || "Chef Special"}
                    placeholder="e.g. Spicy, Vegetarian, Halal"
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-700 block mb-1">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    name="preparationTime"
                    defaultValue={editingItem?.preparationTime || "15-20 mins"}
                    placeholder="e.g. 15-20 mins"
                    className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-stone-700 block mb-1">
                  Availability Status
                </label>
                <select
                  name="isAvailable"
                  defaultValue={editingItem ? String(editingItem.isAvailable) : "true"}
                  className="w-full h-10 px-3 rounded-lg border border-stone-300 text-stone-900 focus:outline-none focus:border-[#fbb100]"
                >
                  <option value="true">In Stock (Available for ordering)</option>
                  <option value="false">Out of Stock (Greyed out on guest menu)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAddingItem(false);
                  }}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#fbb100] hover:bg-[#e09e00] text-white font-semibold rounded-lg shadow"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Category Manager Modal ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-display text-lg text-stone-900 font-semibold mb-4">
              Menu Categories
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 divide-y divide-stone-100">
              {categories.map((c) => (
                <div key={c.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{c.name}</span>
                    <span className="text-stone-400 font-mono ml-2">#{c.order}</span>
                  </div>
                  <span className="text-stone-500 font-mono text-[11px]">
                    {items.filter((i) => i.categoryId === c.id).length} dishes
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3 pt-3 border-t border-stone-200 text-xs">
              <span className="font-bold text-stone-800 block">Add New Category</span>
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Category Name (e.g. Mocktails & Fresh Juices)"
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="order"
                  defaultValue={categories.length + 1}
                  placeholder="Display Order (e.g. 15)"
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 text-stone-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#fbb100] text-white rounded-lg font-semibold"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QR Stand / Table Tent Generator Modal ── */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-center">
            <h3 className="font-display text-xl text-stone-900 font-semibold mb-1">
              Guest Room & Table QR Stand
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Place on bedside tables, dining tables, or bar counters for instantaneous ordering.
            </p>

            <div className="mb-4 text-left">
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Prefill Room or Table Number (Optional):
              </label>
              <input
                type="text"
                value={qrRoomOrTable}
                onChange={(e) => setQrRoomOrTable(e.target.value)}
                placeholder="e.g. Room 204, Table 12, or Garden Sitout"
                className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#fbb100]"
              />
            </div>

            {/* Printable Tent Card Mockup */}
            <div
              id="printable-qr-stand"
              className="bg-[#191816] text-[#f4efe6] p-6 rounded-2xl border-2 border-[#fbb100]/40 shadow-inner my-3"
            >
              <div className="relative h-12 w-12 mx-auto mb-2">
                <Image
                  src="/images/Banky Hotel & Suites Main Logo 1.png"
                  alt="Banky Hotel"
                  fill
                  className="object-contain"
                />
              </div>

              <h4 className="font-display text-base font-semibold text-white tracking-wide">
                BANKY HOTEL & SUITES
              </h4>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#fbb100] mb-3">
                In-Room Dining & Bar Menu
              </p>

              {/* QR Code image generated via reliable QR API */}
              <div className="bg-white p-3 rounded-xl inline-block shadow-md mx-auto my-1 border border-stone-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                    qrTargetUrl
                  )}&size=160x160&margin=4`}
                  alt="QR Code"
                  className="w-36 h-36"
                />
              </div>

              {qrRoomOrTable && (
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-[#fbb100]/20 border border-[#fbb100]/40 text-[#fbb100] text-xs font-mono font-bold">
                  {qrRoomOrTable}
                </div>
              )}

              <p className="text-[11px] text-stone-300 mt-3 font-medium">
                Scan with Phone Camera to Browse & Order
              </p>
              <p className="text-[9px] text-stone-500 mt-1 font-mono">
                {qrTargetUrl}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>Print Stand</span>
              </button>

              <a
                href={qrTargetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open /qr</span>
              </a>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="px-4 py-2 text-stone-500 hover:text-stone-800 text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
