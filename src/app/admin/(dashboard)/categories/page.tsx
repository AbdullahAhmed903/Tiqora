import React from "react";
import { getCategoriesAction } from "@/app/actions/admin-categories";
import { CategoryTable } from "@/components/admin/categories/category-table";

export const metadata = {
  title: "Categories Management | Tiqora Admin",
  description: "Browse, reorder, search, and manage categories.",
};

interface CategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  // Await searchParams per Next.js 15/16 App Router conventions
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const searchQuery = resolvedParams.q || "";

  // Fetch initial category list and total count on the server (RSC)
  const result = await getCategoriesAction({
    page,
    pageSize: 10,
    searchQuery,
  });

  const categories = result.success ? result.data.categories : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const totalPages = result.success ? result.data.totalPages : 1;
  const currentPage = result.success ? result.data.currentPage : 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Event Categories
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage categories, customize display order, toggle live visibility, and optimize imagery.
        </p>
      </div>

      {/* Interactive Category Table */}
      <CategoryTable
        initialCategories={categories}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={searchQuery}
      />
    </div>
  );
}
