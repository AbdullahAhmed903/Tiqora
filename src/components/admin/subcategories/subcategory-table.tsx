"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Calendar,
  FolderTree,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/common/pagination";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { CustomSelect } from "@/components/common/custom-select";
import { SubcategoryActionMenu } from "./subcategory-action-menu";
import { SubcategoryFormDialog } from "./subcategory-form-dialog";
import { CategoryIcon } from "@/lib/category-icons";
import {
  toggleSubcategoryPublishedAction,
  deleteSubcategoryAction,
} from "@/app/actions/admin-subcategories";
import type {
  SubcategoryWithCategory,
  ParentCategoryOption,
  SubcategoryStats,
} from "@/types/subcategories";

interface SubcategoryTableProps {
  initialSubcategories: SubcategoryWithCategory[];
  parentCategories: ParentCategoryOption[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  searchQuery?: string;
  selectedCategoryId?: string;
  stats?: SubcategoryStats;
}

export function SubcategoryTable({
  initialSubcategories,
  parentCategories,
  totalCount,
  currentPage,
  totalPages,
  searchQuery = "",
  selectedCategoryId = "all",
  stats,
}: SubcategoryTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for optimistic updates
  const [subcategories, setSubcategories] =
    useState<SubcategoryWithCategory[]>(initialSubcategories);
  const [prevInitial, setPrevInitial] = useState(initialSubcategories);
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync state if server props change
  if (prevInitial !== initialSubcategories) {
    setPrevInitial(initialSubcategories);
    setSubcategories(initialSubcategories);
  }

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] =
    useState<SubcategoryWithCategory | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] =
    useState<SubcategoryWithCategory | null>(null);
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
      router.push(`/admin/subcategories?${params.toString()}`);
    });
  };

  // Handle Category Filter Change
  const handleCategoryFilterChange = (catId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (catId && catId !== "all") {
      params.set("category", catId);
    } else {
      params.delete("category");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`/admin/subcategories?${params.toString()}`);
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/admin/subcategories");
    });
  };

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    startTransition(() => {
      router.push(`/admin/subcategories?${params.toString()}`);
    });
  };

  // Toggle Is Published
  const handleTogglePublished = async (sub: SubcategoryWithCategory) => {
    const previousState = sub.is_published;
    // Optimistic local update
    setSubcategories((prev) =>
      prev.map((s) =>
        s.id === sub.id ? { ...s, is_published: !previousState } : s
      )
    );

    const res = await toggleSubcategoryPublishedAction(sub.id, previousState);
    if (!res.success) {
      // Revert on error
      setSubcategories((prev) =>
        prev.map((s) =>
          s.id === sub.id ? { ...s, is_published: previousState } : s
        )
      );
      toast.error(res.error || "Failed to toggle published status");
    } else {
      toast.success(
        `"${sub.name}" is now ${!previousState ? "published" : "draft"}`
      );
    }
  };

  // Handle Delete Confirm
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteSubcategoryAction(deleteTarget.id);
    setIsDeleting(false);

    if (!res.success) {
      setDeleteError(res.error);
      toast.error(res.error);
    } else {
      toast.success("Sub-category deleted successfully");
      setDeleteTarget(null);
      setSubcategories((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      router.refresh();
    }
  };

  // Open Form Dialog for Create
  const handleOpenCreate = () => {
    setEditingSubcategory(null);
    setIsFormDialogOpen(true);
  };

  // Open Form Dialog for Edit
  const handleOpenEdit = (sub: SubcategoryWithCategory) => {
    setEditingSubcategory(sub);
    setIsFormDialogOpen(true);
  };

  // Success handler after form submit
  const handleFormSuccess = (
    item: SubcategoryWithCategory,
    mode: "create" | "edit"
  ) => {
    if (mode === "create") {
      setSubcategories((prev) => [item, ...prev]);
    } else {
      setSubcategories((prev) =>
        prev.map((s) => (s.id === item.id ? item : s))
      );
    }
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary Bar */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Total Sub-categories
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {stats.total}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Published &amp; Live
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {stats.published}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Drafts / Hidden
              </p>
              <p className="text-2xl font-bold text-zinc-500 dark:text-zinc-400 mt-1">
                {stats.drafts}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar: Search, Category Filter, and Create Button */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto flex-1 max-w-2xl">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, slug, or category..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("q");
                  params.set("page", "1");
                  startTransition(() => {
                    router.push(`/admin/subcategories?${params.toString()}`);
                  });
                }}
                aria-label="Clear search query"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Category Filter CustomSelect */}
          <div className="w-full sm:w-56">
            <CustomSelect
              value={selectedCategoryId}
              onChange={handleCategoryFilterChange}
              options={[
                {
                  value: "all",
                  label: `All Categories (${parentCategories.length})`,
                  icon: "Layers",
                },
                ...parentCategories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                  sublabel: cat.slug,
                  icon: cat.icon || "Folder",
                })),
              ]}
              placeholder="Filter by category..."
            />
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || (selectedCategoryId && selectedCategoryId !== "all")) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0 whitespace-nowrap self-start sm:self-center"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Create Sub-category Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Sub-category</span>
        </button>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Sub-category</th>
                <th className="py-3 px-4">Parent Category</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {subcategories.map((sub) => {
                const formattedDate = new Date(sub.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                );

                return (
                  <tr
                    key={sub.id}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    {/* Sub-category: Icon, Name, Slug */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                          <CategoryIcon
                            name={sub.icon || "Tag"}
                            className="w-4 h-4"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                            {sub.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 font-mono truncate">
                            /{sub.category?.slug || "category"}/{sub.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Parent Category Badge */}
                    <td className="py-3.5 px-4 align-middle">
                      {sub.category ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                          <CategoryIcon
                            name={sub.category.icon || "Folder"}
                            className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400"
                          />
                          <span>{sub.category.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Published Toggle Switch */}
                    <td className="py-3.5 px-4 text-center align-middle">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(sub)}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            sub.is_published
                              ? "bg-emerald-500"
                              : "bg-zinc-300 dark:bg-zinc-700"
                          }`}
                          role="switch"
                          aria-checked={sub.is_published}
                          title={
                            sub.is_published
                              ? "Click to unpublish"
                              : "Click to publish"
                          }
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                              sub.is_published
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[11px] font-semibold hidden sm:inline ${
                            sub.is_published
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-400"
                          }`}
                        >
                          {sub.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                    </td>

                    {/* Created At */}
                    <td className="py-3.5 px-4 text-xs text-zinc-500 dark:text-zinc-400 align-middle">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* 3-Dots Action Menu */}
                    <td className="py-3.5 px-3 text-center align-middle">
                      <SubcategoryActionMenu
                        subcategory={sub}
                        onEditClick={() => handleOpenEdit(sub)}
                        onDeleteClick={() => setDeleteTarget(sub)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty Table State */}
          {subcategories.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <FolderTree className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                No sub-categories found
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                {searchQuery ||
                (selectedCategoryId && selectedCategoryId !== "all")
                  ? "No sub-categories match your current filters. Try resetting search or category filter."
                  : "Organize your events by creating your first sub-category."}
              </p>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Sub-category</span>
              </button>
            </div>
          )}
        </div>

        {/* 10-per-page Pagination Footer */}
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

      {/* Shared Create & Edit Modal Dialog */}
      <SubcategoryFormDialog
        isOpen={isFormDialogOpen}
        onClose={() => {
          setIsFormDialogOpen(false);
          setEditingSubcategory(null);
        }}
        onSuccess={handleFormSuccess}
        parentCategories={parentCategories}
        editingSubcategory={editingSubcategory}
        preselectedCategoryId={selectedCategoryId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.name || ""}
        itemType="sub-category"
        title="Delete Sub-category"
        description="Are you sure you want to delete this sub-category? This action will remove it from the system."
        isLoading={isDeleting}
        error={deleteError}
      />
    </div>
  );
}
