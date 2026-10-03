"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Plus,
  Shield,
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Tag,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/common/pagination";
import { StaffActionMenu } from "./staff-action-menu";
import { AddStaffModal } from "./add-staff-modal";
import { EditStaffModal } from "./edit-staff-modal";
import { DemoteConfirmationDialog } from "./demote-dialog";
import {
  toggleStaffStatusAction,
  updateStaffRoleAction,
} from "@/app/actions/admin-organizers";
import type { StaffMemberRow } from "@/types/auth";

interface StaffTableProps {
  initialStaff: StaffMemberRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  currentRole?: "all" | "admin" | "organizer";
  currentStatus?: "all" | "active" | "suspended";
  searchQuery?: string;
  currentAdminId?: string;
  availableCategories: Array<{ id: string; name: string; slug: string; icon: string | null }>;
}

export function StaffTable({
  initialStaff,
  totalCount,
  currentPage,
  totalPages,
  currentRole = "all",
  currentStatus = "all",
  searchQuery = "",
  currentAdminId,
  availableCategories,
}: StaffTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state for optimistic updates
  const [staffList, setStaffList] = useState<StaffMemberRow[]>(initialStaff);
  const [prevInitial, setPrevInitial] = useState(initialStaff);
  const [searchInput, setSearchInput] = useState(searchQuery);

  if (prevInitial !== initialStaff) {
    setPrevInitial(initialStaff);
    setStaffList(initialStaff);
  }

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMemberRow | null>(null);

  // Demote dialog state
  const [demoteTarget, setDemoteTarget] = useState<{
    staff: StaffMemberRow;
    newRole: "admin" | "organizer" | "user";
  } | null>(null);
  const [isDemoting, setIsDemoting] = useState(false);

  // Update URL params helper
  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/admin/organizers?${params.toString()}`);
    });
  };

  // Search handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ q: searchInput.trim() || null, page: "1" });
  };

  // Page change
  const handlePageChange = (newPage: number) => {
    updateQuery({ page: newPage.toString() });
  };

  // Toggle status (Active / Suspended)
  const handleToggleStatus = async (target: StaffMemberRow) => {
    if (target.id === currentAdminId) {
      toast.error("You cannot suspend your own admin account.");
      return;
    }

    const previousStatus = target.status;
    const nextStatus = previousStatus === "active" ? "suspended" : "active";

    // Optimistic UI update
    setStaffList((prev) =>
      prev.map((s) => (s.id === target.id ? { ...s, status: nextStatus } : s))
    );

    const res = await toggleStaffStatusAction({
      target_user_id: target.id,
      new_status: nextStatus,
    });

    if (!res.success) {
      // Revert on error
      setStaffList((prev) =>
        prev.map((s) => (s.id === target.id ? { ...s, status: previousStatus } : s))
      );
      toast.error(res.error || "Failed to update status.");
    } else {
      toast.success(
        `${target.full_name || target.username} is now ${
          nextStatus === "active" ? "Active" : "Suspended"
        }`
      );
      router.refresh();
    }
  };

  // Trigger role change confirmation
  const handleTriggerRoleChange = (
    target: StaffMemberRow,
    newRole: "admin" | "organizer" | "user"
  ) => {
    if (target.id === currentAdminId && newRole !== "admin") {
      toast.error("You cannot demote your own admin account.");
      return;
    }
    setDemoteTarget({ staff: target, newRole });
  };

  // Confirm role change
  const handleConfirmRoleChange = async () => {
    if (!demoteTarget) return;

    setIsDemoting(true);
    const { staff, newRole } = demoteTarget;

    const res = await updateStaffRoleAction({
      target_user_id: staff.id,
      new_role: newRole,
    });

    setIsDemoting(false);
    setDemoteTarget(null);

    if (!res.success) {
      toast.error(res.error || "Failed to update role.");
    } else {
      toast.success(
        `Role updated to ${newRole.toUpperCase()} for ${staff.full_name || staff.username}`
      );
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search staff by name, email, handle..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </form>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Role Filter */}
          <select
            value={currentRole}
            onChange={(e) => updateQuery({ role: e.target.value, page: "1" })}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Roles (Staff)</option>
            <option value="organizer">Organizers Only</option>
            <option value="admin">Administrators Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={currentStatus}
            onChange={(e) => updateQuery({ status: e.target.value, page: "1" })}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>

          {/* Add Staff Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md shadow-blue-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Main Staff Table Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4 min-w-[220px]">Staff Member</th>
                <th className="py-3 px-4 min-w-[180px]">Contact Email</th>
                <th className="py-3 px-3 w-32 text-center">Role</th>
                <th className="py-3 px-4 min-w-[180px]">Specializations</th>
                <th className="py-3 px-4 min-w-[160px]">Permissions</th>
                <th className="py-3 px-3 w-28 text-center">Status</th>
                <th className="py-3 px-4 min-w-[140px]">Registered</th>
                <th className="py-3 px-3 w-14 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {staffList.map((member) => {
                const isCurrentAdmin = member.id === currentAdminId;
                const isAdmin = member.role === "admin";
                const writeCount = member.permissions.filter((p) => p.access_level === "write").length;
                const readCount = member.permissions.filter((p) => p.access_level === "read").length;

                const formattedDate = new Date(member.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors group bg-white dark:bg-zinc-900"
                  >
                    {/* Staff Member Avatar + Name */}
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-600 dark:text-zinc-300">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt={member.full_name || member.username}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <span>{(member.full_name || member.username).slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-zinc-900 dark:text-white truncate">
                              {member.full_name || member.username}
                            </span>
                            {isCurrentAdmin && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono truncate">
                            @{member.username}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-3 px-4 align-middle">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-800 dark:text-zinc-200 font-medium truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{member.email || "No email"}</span>
                        </div>
                        {member.phone_number && (
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                            {member.phone_number}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-3 text-center align-middle">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
                          <Shield className="w-3 h-3 text-purple-500" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40">
                          <Briefcase className="w-3 h-3 text-blue-500" />
                          Organizer
                        </span>
                      )}
                    </td>

                    {/* Specializations Tags */}
                    <td className="py-3 px-4 align-middle">
                      {isAdmin ? (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                          Global Authority
                        </span>
                      ) : member.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {member.specializations.slice(0, 3).map((spec) => (
                            <span
                              key={spec}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 capitalize"
                            >
                              <Tag className="w-2.5 h-2.5 text-blue-500" />
                              {spec}
                            </span>
                          ))}
                          {member.specializations.length > 3 && (
                            <span className="text-[10px] text-zinc-400 px-1 py-0.5">
                              +{member.specializations.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                          None specified
                        </span>
                      )}
                    </td>

                    {/* Permissions Summary */}
                    <td className="py-3 px-4 align-middle">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Full Write Access
                        </span>
                      ) : member.permissions.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setEditingStaff(member)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors"
                          title="Click to view or edit permissions"
                        >
                          <KeyRound className="w-3 h-3 text-blue-500" />
                          <span>
                            {member.permissions.length} sections ({writeCount}W, {readCount}R)
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          No sections assigned
                        </span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 text-center align-middle">
                      <button
                        type="button"
                        disabled={isCurrentAdmin}
                        onClick={() => handleToggleStatus(member)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
                          member.status === "active" ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                        }`}
                        role="switch"
                        aria-checked={member.status === "active"}
                        title={
                          isCurrentAdmin
                            ? "You cannot suspend your own account"
                            : member.status === "active"
                            ? "Click to suspend"
                            : "Click to activate"
                        }
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            member.status === "active" ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-4 text-xs text-zinc-500 dark:text-zinc-400 align-middle">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>

                    {/* Action 3-Dots Menu */}
                    <td className="py-3 px-3 text-center align-middle">
                      <StaffActionMenu
                        staff={member}
                        currentAdminId={currentAdminId}
                        onEditPermissions={(s) => setEditingStaff(s)}
                        onToggleStatus={handleToggleStatus}
                        onDemoteRole={handleTriggerRoleChange}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Empty State */}
          {staffList.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-zinc-900 dark:text-white">
                No staff members found
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? `No administrators or organizers match "${searchQuery}".`
                  : "Start by provisioning your first staff member using the button above."}
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
            itemLabel="staff members"
            onPageChange={handlePageChange}
            isLoading={isPending}
          />
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => router.refresh()}
        availableCategories={availableCategories}
      />

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaffModal
          isOpen={Boolean(editingStaff)}
          onClose={() => setEditingStaff(null)}
          onSuccess={() => router.refresh()}
          staff={editingStaff}
          availableCategories={availableCategories}
        />
      )}

      {/* Demote Confirmation Dialog */}
      {demoteTarget && (
        <DemoteConfirmationDialog
          isOpen={Boolean(demoteTarget)}
          onClose={() => setDemoteTarget(null)}
          onConfirm={handleConfirmRoleChange}
          userName={demoteTarget.staff.full_name || demoteTarget.staff.username}
          targetRole={demoteTarget.newRole}
          isLoading={isDemoting}
        />
      )}
    </div>
  );
}
