import React from "react";
import { notFound } from "next/navigation";
import { getCategoryByIdAction } from "@/app/actions/admin-categories";
import { CategoryForm } from "@/components/admin/categories/category-form";

export const metadata = {
  title: "Edit Category | Tiqora Admin",
  description: "Update category metadata, status, or cover image.",
};

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;

  if (!categoryId) {
    notFound();
  }

  const result = await getCategoryByIdAction(categoryId);

  if (!result.success || !result.data) {
    notFound();
  }

  const category = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Edit Category
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Editing &ldquo;{category.name}&rdquo; ({category.slug})
        </p>
      </div>

      <CategoryForm mode="edit" initialData={category} />
    </div>
  );
}
