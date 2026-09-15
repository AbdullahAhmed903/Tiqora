"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Reorder } from "framer-motion";
import {
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Layers,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/common/pagination";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { CategoryActionMenu } from "./category-action-menu";
import { getCategoryIconComponent } from "@/lib/category-icons";
import {
  toggleCategoryActiveAction,
  toggleCategoryPopularAction,
  reorderCategoriesAction,
  deleteCategoryAction,
} from "@/app/actions/admin-categories";
import type { CategoryRow } from "@/types/categories";

interface CategoryTableProps {
  initialCategories: CategoryRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
}

export function CategoryTable({
  initialCategories,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = "",
}: CategoryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for reordering and optimistic updates
  const [categories, setCategories] = useState<CategoryRow[]>(initialCategories);
  const [prevInitial, setPrevInitial] = useState(initialCategories);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync state during render when initialCategories props change
  if (prevInitial !== initialCategories) {
    setPrevInitial(initialCategories);
    setCategories(initialCategories);
  }

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Handle Search Input Submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/admin/categories?${params.toString()}`);
    });
  };

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`/admin/categories?${params.toString()}`);
    });
  };

  // Toggle Is Active
  const handleToggleActive = async (cat: CategoryRow) => {
    const previousState = cat.is_active;
    // Optimistic local update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_active: !previousState } : c))
    );

    const res = await toggleCategoryActiveAction(cat.id, previousState);
    if (!res.success) {
      // Revert on error
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_active: previousState } : c))
      );
      toast.error(`Failed to update status: ${res.error}`);
    } else {
      toast.success(
        `Category is now ${!previousState ? "Active (Published)" : "Hidden (Draft)"}`
      );
    }
  };

  // Toggle Is Popular
  const handleTogglePopular = async (cat: CategoryRow) => {
    const previousState = cat.is_popular;
    // Optimistic local update
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? { ...c, is_popular: !previousState } : c))
    );

    const res = await toggleCategoryPopularAction(cat.id, previousState);
    if (!res.success) {
      // Revert on error
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_popular: previousState } : c))
      );
      toast.error(`Failed to update popularity: ${res.error}`);
    } else {
      toast.success(
        `Category ${!previousState ? "marked as Popular" : "unmarked from Popular"}`
      );
    }
  };

  // Move Order with Arrow Buttons (Up / Down)
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const newOrder = [...categories];
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    // Recalculate display_order based on new indexes
    const updatedWithOrder = newOrder.map((cat, idx) => ({
      ...cat,
      display_order: idx + 1 + (currentPage - 1) * 10,
    }));

    setCategories(updatedWithOrder);

    const payload = updatedWithOrder.map((c) => ({
      id: c.id,
      display_order: c.display_order,
    }));

    const res = await reorderCategoriesAction(payload);
    if (!res.success) {
      toast.error(`Failed to reorder: ${res.error}`);
    } else {
      toast.success("Order updated successfully");
    }
  };

  // Drag and drop reorder handler (via Framer Motion Reorder.Group)
  const handleReorder = async (newOrder: CategoryRow[]) => {
    const updatedWithOrder = newOrder.map((cat, idx) => ({
      ...cat,
      display_order: idx + 1 + (currentPage - 1) * 10,
    }));

    setCategories(updatedWithOrder);

    const payload = updatedWithOrder.map((c) => ({
      id: c.id,
      display_order: c.display_order,
    }));

    const res = await reorderCategoriesAction(payload);
    if (!res.success) {
      toast.error(`Failed to save reorder: ${res.error}`);
    } else {
      toast.success("Display order saved");
    }
  };

  // Handle Deletion Confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteCategoryAction(deleteTarget.id);
    setIsDeleting(false);

    if (!res.success) {
      setDeleteError(res.error);
      toast.error(res.error);
    } else {
      toast.success(`Category "${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
      // Refresh page data
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar: Search + Create Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by category name or slug..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </form>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Category</span>
          </Link>
        </div>
      </div>

      {/* Main Categories Table Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-3 w-14 text-center">Order</th>
                <th className="py-3 px-4 min-w-[200px]">Category</th>
                <th className="py-3 px-4 min-w-[140px]">Slug</th>
                <th className="py-3 px-3 w-28 text-center">Active</th>
                <th className="py-3 px-3 w-28 text-center">Popular</th>
                <th className="py-3 px-4 min-w-[160px]">Created At</th>
                <th className="py-3 px-3 w-14 text-center">Action</th>
              </tr>
            </thead>

            {/* Reorderable Table Rows via Framer Motion */}
            <Reorder.Group
              as="tbody"
              axis="y"
              values={categories}
              onReorder={handleReorder}
              className="divide-y divide-zinc-200 dark:divide-zinc-800"
            >
              {categories.map((cat, index) => {
                const IconComponent = getCategoryIconComponent(cat.icon);
                const formattedDate = new Date(cat.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <Reorder.Item
                    key={cat.id}
                    value={cat}
                    as="tr"
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group select-none bg-white dark:bg-zinc-900"
                  >
                    {/* Order Controls (Drag Handle + Up/Down Arrows) */}
                    <td className="py-3 px-2 text-center align-middle">
                      <div className="flex items-center justify-center gap-1 text-zinc-400">
                        {/* Drag Handle */}
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 hover:text-zinc-600 dark:hover:text-zinc-200"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Arrow Up/Down */}
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(index, "up")}
                            disabled={index === 0}
                            className="p-0.5 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
                            title="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveOrder(index, "down")}
                            disabled={index === categories.length - 1}
                            className="p-0.5 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-20 transition-colors"
                            title="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-[11px] text-zinc-500 w-5 text-right font-semibold">
                          {cat.display_order}
                        </span>
                      </div>
                    </td>

                    {/* Category Thumbnail + Name + Icon */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                          {cat.pic ? (
                            <Image
                              src={cat.pic}
                              alt={cat.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400">
                              <Layers className="w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <IconComponent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="font-semibold text-zinc-900 dark:text-white truncate">
                              {cat.name}
                            </span>
                          </div>
                          {cat.small_description && (
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate max-w-xs">
                              {cat.small_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4 align-middle">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        {cat.slug}
                      </span>
                    </td>

                    {/* Is Active Toggle */}
                    <td className="py-3 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(cat)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          cat.is_active ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                        role="switch"
                        aria-checked={cat.is_active}
                        title={cat.is_active ? "Click to deactivate" : "Click to activate"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            cat.is_active ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Is Popular Toggle */}
                    <td className="py-3 px-3 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleTogglePopular(cat)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                          cat.is_popular ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                        role="switch"
                        aria-checked={cat.is_popular}
                        title={cat.is_popular ? "Click to unmark popular" : "Click to mark popular"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            cat.is_popular ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Created At */}
                    <td className="py-3 px-4 text-xs text-zinc-500 dark:text-zinc-400 align-middle">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* 3-Dots Action Menu */}
                    <td className="py-3 px-3 text-center align-middle">
                      <CategoryActionMenu
                        categoryId={cat.id}
                        categorySlug={cat.slug}
                        categoryName={cat.name}
                        onDeleteClick={() => setDeleteTarget(cat)}
                      />
                    </td>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          </table>

          {/* Empty Search / Table State */}
          {categories.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
                No categories found
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No categories match "${searchQuery}". Try clearing your search.`
                  : "Start by creating your first category using the button above."}
              </p>
            </div>
          )}
        </div>

        {/* Footer with 10-per-page Pagination */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={10}
            onPageChange={handlePageChange}
            isLoading={isPending}
          />
        </div>
      </div>

      {/* Shared Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name || ""}
        itemType="category"
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
