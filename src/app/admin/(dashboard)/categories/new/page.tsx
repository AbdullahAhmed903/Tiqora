import React from "react";
import { CategoryForm } from "@/components/admin/categories/category-form";

export const metadata = {
  title: "Create Category | Tiqora Admin",
  description: "Add a new sports or live event category.",
};

export default function AdminNewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Create New Category
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Define category taxonomy, upload optimized WebP imagery, and configure navigation ranking.
        </p>
      </div>

      <CategoryForm mode="create" />
    </div>
  );
}
