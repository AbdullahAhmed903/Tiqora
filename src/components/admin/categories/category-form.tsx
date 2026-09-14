"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Link2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { generateSlug } from "@/lib/slug";
import { ImageUploadWithShimmer } from "@/components/common/image-upload-with-shimmer";
import { IconPicker } from "@/components/common/icon-picker";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/app/actions/admin-categories";
import type { CategoryRow } from "@/types/categories";

interface CategoryFormProps {
  initialData?: CategoryRow | null;
  mode: "create" | "edit";
}

export function CategoryForm({ initialData, mode }: CategoryFormProps) {
  const router = useRouter();

  // Form Fields
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [autoSlug, setAutoSlug] = useState(mode === "create");
  const [smallDescription, setSmallDescription] = useState(
    initialData?.small_description || ""
  );
  const [icon, setIcon] = useState(initialData?.icon || "Trophy");
  const [isActive, setIsActive] = useState(
    initialData ? initialData.is_active : true
  );
  const [isPopular, setIsPopular] = useState(
    initialData ? initialData.is_popular : false
  );
  const [displayOrder, setDisplayOrder] = useState<number>(
    initialData ? initialData.display_order : 0
  );

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Auto-generate slug when name changes if autoSlug mode is enabled
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (autoSlug) {
      setSlug(generateSlug(newName));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setSlug(generateSlug(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client validation
    if (!name.trim()) {
      setFormError("Category name is required.");
      return;
    }
    if (!slug.trim()) {
      setFormError("Slug is required.");
      return;
    }
    if (!icon) {
      setFormError("Please choose an icon for this category.");
      return;
    }
    if (mode === "create" && !selectedFile) {
      setFormError("Category cover picture is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("slug", slug.trim());
      formData.append("small_description", smallDescription.trim());
      formData.append("icon", icon);
      formData.append("is_active", String(isActive));
      formData.append("is_popular", String(isPopular));
      formData.append("display_order", String(displayOrder));

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (mode === "edit" && initialData) {
        formData.append("id", initialData.id);
        if (initialData.pic) {
          formData.append("existingPicUrl", initialData.pic);
        }

        const res = await updateCategoryAction(formData);
        if (!res.success) {
          setFormError(res.error);
          toast.error(res.error);
        } else {
          toast.success("Category updated successfully");
          router.push("/admin/categories");
          router.refresh();
        }
      } else {
        const res = await createCategoryAction(formData);
        if (!res.success) {
          setFormError(res.error);
          toast.error(res.error);
        } else {
          toast.success("Category created successfully");
          router.push("/admin/categories");
          router.refresh();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Categories</span>
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{mode === "create" ? "Creating..." : "Saving..."}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{mode === "create" ? "Create Category" : "Save Changes"}</span>
            </>
          )}
        </button>
      </div>

      {/* Global Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-sm text-red-600 dark:text-red-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* Main Grid: Form Left, Media Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              General Information
            </h3>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. Football, Music Festivals, Theatre"
                required
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Slug Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                {mode === "create" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAutoSlug(true);
                      setSlug(generateSlug(name));
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Sync from name
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-zinc-400">
                  <Link2 className="w-4 h-4" />
                  <span className="text-xs">/events/</span>
                </div>
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="football"
                  required
                  className="w-full pl-24 pr-4 py-2.5 text-sm font-mono rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <p className="text-xs text-zinc-500">
                Lowercase kebab-case slug used in category deep-links.
              </p>
            </div>

            {/* Small Description Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
                  Brief Summary
                </label>
                <span className="text-xs text-zinc-400">
                  {smallDescription.length}/300
                </span>
              </div>
              <textarea
                value={smallDescription}
                onChange={(e) => setSmallDescription(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="A short punchy description for category cards and banners..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              />
            </div>
          </div>

          {/* Visibility & Toggles Card */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Visibility &amp; Navigation Rules
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Active Toggle */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Publish Category
                  </p>
                  <p className="text-xs text-zinc-500">
                    Visible to public visitors
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  role="switch"
                  aria-checked={isActive}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Popular Toggle */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Feature as Popular
                  </p>
                  <p className="text-xs text-zinc-500">
                    Highlight on homepage carousel
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPopular(!isPopular)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isPopular ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                  role="switch"
                  aria-checked={isPopular}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      isPopular ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Display Order */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Math.max(0, parseInt(e.target.value) || 0))}
                min={0}
                className="w-full sm:w-48 px-4 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/60 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <p className="text-xs text-zinc-500">
                Determines sort position (1-4 display in the top navigation bar, remaining under &ldquo;More&rdquo;).
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Visuals */}
        <div className="space-y-6">
          {/* Image Upload Component */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Cover Visual
            </h3>

            <ImageUploadWithShimmer
              currentImageUrl={initialData?.pic}
              onFileSelect={(file) => setSelectedFile(file)}
              isUploading={isSubmitting}
              minWidth={200}
              minHeight={200}
              label="Cover Picture"
              helperText="Images are automatically converted to optimized WebP format (max 2MB)."
            />
          </div>

          {/* Icon Picker Component */}
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Icon Representation
            </h3>

            <IconPicker
              selectedIcon={icon}
              onSelectIcon={(newIcon) => setIcon(newIcon)}
              label="Icon Identifier"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
