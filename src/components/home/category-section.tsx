import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import type { HomeCategory } from "@/types/categories";

interface CategorySectionProps {
  categories?: HomeCategory[];
}

export function CategorySection({ categories = [] }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Display top 7 categories matching the original design
  const displayedCategories = categories.slice(0, 7);

  return (
    <section className="space-y-6 pt-4">
      {/* Header matching original design */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold tracking-widest text-[#2563EB] uppercase">
            EXPLORE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Browse by <span className="text-[#2563EB]">Category</span>
          </h2>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:hover:text-blue-400 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of 7 Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5">
        {displayedCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/events/${cat.slug}`}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-[#F4F4F6] dark:bg-[#18181B] hover:border-[#2563EB]/60 hover:shadow-lg hover:shadow-[#2563EB]/5 transition-all duration-200 group text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-[#2563EB]/40 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:text-[#2563EB] group-hover:scale-110 transition-all duration-200 mb-3 shadow-xs">
              <CategoryIcon name={cat.icon} className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-[#2563EB] transition-colors line-clamp-1">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
