"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, AlertCircle, Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/slug";
import { IconPicker } from "@/components/common/icon-picker";
import { CustomSelect } from "@/components/common/custom-select";
import { CategoryIcon } from "@/lib/category-icons";
import {
  createSubcategoryAction,
  updateSubcategoryAction,
} from "@/app/actions/admin-subcategories";
import type {
  SubcategoryWithCategory,
  ParentCategoryOption,
} from "@/types/subcategories";

interface SubcategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (item: SubcategoryWithCategory, mode: "create" | "edit") => void;
  parentCategories: ParentCategoryOption[];
  editingSubcategory?: SubcategoryWithCategory | null;
  preselectedCategoryId?: string;
}

function SubcategoryFormInner({
  onClose,
  onSuccess,
  parentCategories,
  editingSubcategory,
  preselectedCategoryId,
}: {
  onClose: () => void;
  onSuccess: (item: SubcategoryWithCategory, mode: "create" | "edit") => void;
  parentCategories: ParentCategoryOption[];
  editingSubcategory?: SubcategoryWithCategory | null;
  preselectedCategoryId?: string;
}) {
  const mode = editingSubcategory ? "edit" : "create";

  const [categoryId, setCategoryId] = useState<string>(
    editingSubcategory?.category_id ||
      (preselectedCategoryId && preselectedCategoryId !== "all"
        ? preselectedCategoryId
        : parentCategories[0]?.id || "")
  );
  const [name, setName] = useState<string>(editingSubcategory?.name || "");
  const [slug, setSlug] = useState<string>(editingSubcategory?.slug || "");
  const [autoSlug, setAutoSlug] = useState<boolean>(!editingSubcategory);
  const [icon, setIcon] = useState<string>(editingSubcategory?.icon || "Tag");
  const [isPublished, setIsPublished] = useState<boolean>(
    editingSubcategory ? editingSubcategory.is_published : true
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    editingSubcategory?.display_order || 0
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (autoSlug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!categoryId) {
      setFormError("Please select a parent category.");
      return;
    }
    if (!name.trim()) {
      setFormError("Sub-category name is required.");
      return;
    }
    if (!slug.trim()) {
      setFormError("URL slug is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "edit" && editingSubcategory) {
        const res = await updateSubcategoryAction({
          id: editingSubcategory.id,
          category_id: categoryId,
          name: name.trim(),
          slug: slug.trim(),
          icon: icon || "Tag",
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });

        if (!res.success) {
          setFormError(res.error);
          toast.error(res.error);
        } else {
          toast.success("Sub-category updated successfully");
          onSuccess(res.data, "edit");
          onClose();
        }
      } else {
        const res = await createSubcategoryAction({
          category_id: categoryId,
          name: name.trim(),
          slug: slug.trim(),
          icon: icon || "Tag",
          is_published: isPublished,
          display_order: Number(displayOrder) || 0,
        });

        if (!res.success) {
          setFormError(res.error);
          toast.error(res.error);
        } else {
          toast.success("Sub-category created successfully");
          onSuccess(res.data, "create");
          onClose();
        }
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedParent = parentCategories.find((c) => c.id === categoryId);

  const categoryOptions = parentCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    sublabel: cat.slug,
    icon: cat.icon || "Folder",
  }));

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 min-h-0 overflow-hidden"
    >
      {/* 1. Header (Fixed at top) */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight">
            {mode === "create" ? "Create Sub-category" : "Edit Sub-category"}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {mode === "create"
              ? "Define taxonomy to organize sports leagues, genres, and event types."
              : `Editing "${editingSubcategory?.name}"`}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent">
        {/* Global Error Alert */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-600 dark:text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        {/* Parent Category Selection with CustomSelect */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Parent Category <span className="text-red-500">*</span>
          </label>
          <CustomSelect
            value={categoryId}
            onChange={(newVal) => setCategoryId(newVal)}
            options={categoryOptions}
            placeholder="Select parent category..."
          />
          <p className="text-[11px] text-zinc-400">
            Every sub-category must be linked directly to exactly one parent category.
          </p>
        </div>

        {/* Name Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Sub-category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Premier League, Rock, Stand-up Comedy"
            required
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Slug Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
              URL Slug <span className="text-red-500">*</span>
            </label>
            {mode === "create" && (
              <button
                type="button"
                onClick={() => {
                  setAutoSlug(true);
                  setSlug(generateSlug(name));
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sync from name
              </button>
            )}
          </div>
          <div className="flex items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 shrink-0 select-none">
              <Link2 className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                /{selectedParent?.slug || "category"}/
              </span>
            </div>
            <input
              type="text"
              value={slug}
              onChange={handleSlugChange}
              placeholder="premier-league"
              required
              className="w-full px-3 py-2.5 text-xs font-mono bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Visual Icon Picker */}
        <div className="space-y-1.5">
          <IconPicker
            selectedIcon={icon}
            onSelectIcon={(newIcon) => setIcon(newIcon)}
            label="Visual Icon"
          />
        </div>

        {/* Live Interactive Preview Pill */}
        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Live Badge Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 shadow-sm">
              <CategoryIcon name={icon} className="w-3.5 h-3.5 text-blue-500" />
              <span>{name.trim() || "Sub-category Name"}</span>
            </div>
            {selectedParent && (
              <span className="text-[11px] text-zinc-400">
                under <strong className="text-zinc-600 dark:text-zinc-300">{selectedParent.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Controls: Publish Status & Display Order */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Publish Toggle */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                Publish Status
              </p>
              <p className="text-[11px] text-zinc-400">
                {isPublished ? "Visible to public" : "Draft / Hidden"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isPublished ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
              role="switch"
              aria-checked={isPublished}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isPublished ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Display Order */}
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                Display Order
              </p>
              <p className="text-[11px] text-zinc-400">Lower = first</p>
            </div>
            <input
              type="number"
              min={0}
              value={displayOrder}
              onChange={(e) =>
                setDisplayOrder(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-16 px-2.5 py-1 text-xs font-mono text-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Sticky Footer Buttons (Always visible at the bottom) */}
      <div className="px-6 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-end gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{mode === "create" ? "Create Sub-category" : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export function SubcategoryFormDialog({
  isOpen,
  onClose,
  onSuccess,
  parentCategories,
  editingSubcategory = null,
  preselectedCategoryId = "",
}: SubcategoryFormDialogProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window: max-h-[88vh] with flex-col layout so buttons are always visible */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg max-h-[88vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-10 flex flex-col overflow-hidden"
        >
          <SubcategoryFormInner
            key={editingSubcategory ? editingSubcategory.id : "new-subcategory"}
            onClose={onClose}
            onSuccess={onSuccess}
            parentCategories={parentCategories}
            editingSubcategory={editingSubcategory}
            preselectedCategoryId={preselectedCategoryId}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
