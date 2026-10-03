import React from "react";
import { createClient } from "@/lib/supabase/server";
import {
  getStaffMembersAction,
  getActiveCategoriesForStaffAction,
} from "@/app/actions/admin-organizers";
import { StaffTable } from "@/components/admin/organizers/staff-table";

export const metadata = {
  title: "Staff & Organizer Management | Tiqora Admin",
  description: "Browse, manage, and provision administrators and organizers with role-scoped permissions.",
};

interface OrganizersPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    role?: "all" | "admin" | "organizer";
    status?: "all" | "active" | "suspended";
  }>;
}

export default async function AdminOrganizersPage({
  searchParams,
}: OrganizersPageProps) {
  // Await searchParams per Next.js 15/16 App Router conventions
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const searchQuery = resolvedParams.q || "";
  const role = resolvedParams.role || "all";
  const status = resolvedParams.status || "all";

  // Get current admin user ID to protect against self-lockout
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch staff list and categories in parallel
  const [staffResult, categoriesResult] = await Promise.all([
    getStaffMembersAction({
      page,
      pageSize: 10,
      role,
      status,
      searchQuery,
    }),
    getActiveCategoriesForStaffAction(),
  ]);

  const staff = staffResult.success ? staffResult.data.staff : [];
  const totalCount = staffResult.success ? staffResult.data.totalCount : 0;
  const totalPages = staffResult.success ? staffResult.data.totalPages : 1;
  const currentPage = staffResult.success ? staffResult.data.currentPage : 1;
  const categories = categoriesResult.success ? categoriesResult.data : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Staff & Organizer Governance
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage platform administrators and organizers, assign event specializations, and configure granular access levels.
        </p>
      </div>

      {/* Interactive Staff Table */}
      <StaffTable
        initialStaff={staff}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        currentRole={role}
        currentStatus={status}
        searchQuery={searchQuery}
        currentAdminId={user?.id}
        availableCategories={categories}
      />
    </div>
  );
}
