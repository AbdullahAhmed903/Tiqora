import React from "react";
import {
  getSubcategoriesAction,
  getParentCategoriesAction,
} from "@/app/actions/admin-subcategories";
import { SubcategoryTable } from "@/components/admin/subcategories/subcategory-table";

export const metadata = {
  title: "Sub-categories Management | Tiqora Admin",
  description: "Manage event sub-categories, filter by parent category, and toggle publish status.",
};

interface SubcategoriesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
}

export default async function AdminSubcategoriesPage({
  searchParams,
}: SubcategoriesPageProps) {
  // Await searchParams per Next.js 15/16 App Router conventions
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const searchQuery = resolvedParams.q || "";
  const selectedCategoryId = resolvedParams.category || "all";

  // Pre-fetch parent categories and paginated subcategories in parallel on the server
  const [parentCategoriesResult, subcategoriesResult] = await Promise.all([
    getParentCategoriesAction(),
    getSubcategoriesAction({
      page,
      pageSize: 10,
      searchQuery,
      categoryId: selectedCategoryId,
    }),
  ]);

  const parentCategories = parentCategoriesResult.success
    ? parentCategoriesResult.data
    : [];

  const subcategories = subcategoriesResult.success
    ? subcategoriesResult.data.subcategories
    : [];

  const totalCount = subcategoriesResult.success
    ? subcategoriesResult.data.totalCount
    : 0;

  const totalPages = subcategoriesResult.success
    ? subcategoriesResult.data.totalPages
    : 1;

  const currentPage = subcategoriesResult.success
    ? subcategoriesResult.data.currentPage
    : 1;

  const stats = subcategoriesResult.success
    ? subcategoriesResult.data.stats
    : { total: 0, published: 0, drafts: 0 };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Event Sub-categories
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Organize leagues, genres, and sub-genres attached to your main event categories.
        </p>
      </div>

      {/* Interactive Subcategory Table */}
      <SubcategoryTable
        initialSubcategories={subcategories}
        parentCategories={parentCategories}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={searchQuery}
        selectedCategoryId={selectedCategoryId}
        stats={stats}
      />
    </div>
  );
}
