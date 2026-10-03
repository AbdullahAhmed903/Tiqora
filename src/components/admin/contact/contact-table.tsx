"use client";

import React, { useState, useTransition } from "react";
import {
  Search,
  MessageCircle,
  Mail,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  RefreshCw,
  Loader2,
  Ticket,
  CreditCard,
  ShieldCheck,
  Trophy,
  Wrench,
  HelpCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  ContactSubmission,
  ContactStatus,
  ContactDepartment,
  PaginatedContactSubmissionsResult,
} from "@/types/contact";
import {
  getAdminContactSubmissionsAction,
  updateContactStatusAction,
  deleteContactSubmissionAction,
} from "@/app/actions/contact";
import { formatFileSize } from "@/lib/file-utils";
import { CONTACT_DEPARTMENTS } from "@/lib/contact-data";
import { Pagination } from "@/components/common/pagination";
import { ContactDetailsDrawer } from "./contact-details-drawer";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";

interface ContactTableProps {
  initialData: PaginatedContactSubmissionsResult;
}

export function ContactTable({ initialData }: ContactTableProps) {
  const [data, setData] = useState<PaginatedContactSubmissionsResult>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // Selected ticket for slide-over drawer
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<ContactSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch updated data from Server Action
  const fetchSubmissions = (
    newPage = page,
    newStatus = statusFilter,
    newDepartment = departmentFilter,
    newSearch = search
  ) => {
    startTransition(async () => {
      const res = await getAdminContactSubmissionsAction({
        page: newPage,
        limit: 15,
        status: newStatus,
        department: newDepartment,
        search: newSearch,
      });

      if (res.data) {
        setData(res.data);
        setPage(newPage);
      } else {
        toast.error(res.error || "Failed to load contact submissions");
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubmissions(1, statusFilter, departmentFilter, search);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    fetchSubmissions(1, status, departmentFilter, search);
  };

  const handleDepartmentFilterChange = (dept: string) => {
    setDepartmentFilter(dept);
    fetchSubmissions(1, statusFilter, dept, search);
  };

  const handlePageChange = (newPage: number) => {
    fetchSubmissions(newPage, statusFilter, departmentFilter, search);
  };

  const handleQuickStatusChange = async (
    e: React.MouseEvent,
    submission: ContactSubmission,
    nextStatus: ContactStatus
  ) => {
    e.stopPropagation();
    try {
      const res = await updateContactStatusAction({
        id: submission.id,
        status: nextStatus,
      });

      if (res.success) {
        toast.success(`Updated #${submission.ticket_number} to ${nextStatus}`);
        setData((prev) => ({
          ...prev,
          submissions: prev.submissions.map((s) =>
            s.id === submission.id
              ? {
                  ...s,
                  status: nextStatus,
                  resolved_at: nextStatus === "resolved" ? new Date().toISOString() : null,
                }
              : s
          ),
          counts: {
            ...prev.counts,
            [submission.status]: Math.max(0, prev.counts[submission.status] - 1),
            [nextStatus]: prev.counts[nextStatus] + 1,
          },
        }));

        if (selectedSubmission?.id === submission.id) {
          setSelectedSubmission((prev) => (prev ? { ...prev, status: nextStatus } : null));
        }
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await deleteContactSubmissionAction(deleteTarget.id);
      if (res.success) {
        toast.success(`Inquiry #${deleteTarget.ticket_number} deleted successfully`);
        setData((prev) => ({
          ...prev,
          submissions: prev.submissions.filter((s) => s.id !== deleteTarget.id),
          totalCount: Math.max(0, prev.totalCount - 1),
          counts: {
            ...prev.counts,
            all: Math.max(0, prev.counts.all - 1),
            [deleteTarget.status]: Math.max(0, prev.counts[deleteTarget.status] - 1),
          },
        }));

        if (selectedSubmission?.id === deleteTarget.id) {
          setSelectedSubmission(null);
        }
        setDeleteTarget(null);
      } else {
        toast.error(res.error || "Failed to delete inquiry");
      }
    } catch {
      toast.error("Failed to delete inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const getDepartmentBadge = (dept: ContactDepartment) => {
    switch (dept) {
      case "tickets":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Ticket className="w-3 h-3" />
            <span>Tickets</span>
          </span>
        );
      case "payments":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-3 h-3" />
            <span>Payments</span>
          </span>
        );
      case "stadium":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-3 h-3" />
            <span>Stadium Gates</span>
          </span>
        );
      case "organizers":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Trophy className="w-3 h-3" />
            <span>Organizers</span>
          </span>
        );
      case "technical":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Wrench className="w-3 h-3" />
            <span>Technical</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-500/10 text-zinc-300 border border-zinc-500/20">
            <HelpCircle className="w-3 h-3" />
            <span>General</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>New</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Resolved</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Quick Status Metric Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Contact & Support Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review fan inquiries, respond via WhatsApp or Email, and manage support tickets.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => fetchSubmissions(page, statusFilter, departmentFilter, search)}
          disabled={isPending}
          className="gap-2 self-start sm:self-auto cursor-pointer text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => handleStatusFilterChange("all")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "all"
              ? "bg-zinc-900 text-white border-blue-500/40 shadow-sm"
              : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
          }`}
        >
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Inquiries</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-zinc-900 dark:text-white">
            {data.counts.all}
          </div>
        </div>

        <div
          onClick={() => handleStatusFilterChange("new")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "new"
              ? "bg-blue-950/60 border-blue-500/60 shadow-sm"
              : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40"
          }`}
        >
          <div className="text-xs font-semibold text-blue-500">New / Unread</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-blue-500">
            {data.counts.new}
          </div>
        </div>

        <div
          onClick={() => handleStatusFilterChange("pending")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "pending"
              ? "bg-amber-950/60 border-amber-500/60 shadow-sm"
              : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-amber-500/40"
          }`}
        >
          <div className="text-xs font-semibold text-amber-500">Pending Review</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-amber-500">
            {data.counts.pending}
          </div>
        </div>

        <div
          onClick={() => handleStatusFilterChange("resolved")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === "resolved"
              ? "bg-emerald-950/60 border-emerald-500/60 shadow-sm"
              : "bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/40"
          }`}
        >
          <div className="text-xs font-semibold text-emerald-500">Resolved</div>
          <div className="text-xl sm:text-2xl font-black mt-1 text-emerald-500">
            {data.counts.resolved}
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket #, sender, email, or subject..."
            className="w-full bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-600 transition-all"
          />
        </form>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
          <select
            value={departmentFilter}
            onChange={(e) => handleDepartmentFilterChange(e.target.value)}
            className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="all">All Departments</option>
            {CONTACT_DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Submissions Table */}
      <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-xs relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-2xs flex items-center justify-center z-20">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Attachment</th>
                <th className="py-3.5 px-4">Received</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {data.submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No contact submissions found matching current filters.
                  </td>
                </tr>
              ) : (
                data.submissions.map((submission) => {
                  const cleanPhone = submission.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${submission.full_name}, this is Tiqora Support regarding ticket ${submission.ticket_number}.`
                  )}`;
                  const emailUrl = `mailto:${submission.email}?subject=${encodeURIComponent(
                    `Re: [${submission.ticket_number}] ${submission.subject || "Tiqora Inquiry"}`
                  )}`;

                  return (
                    <tr
                      key={submission.id}
                      onClick={() => setSelectedSubmission(submission)}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                    >
                      {/* Ticket # */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-500 whitespace-nowrap">
                        {submission.ticket_number}
                      </td>

                      {/* Sender */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-white truncate max-w-[160px]">
                          {submission.full_name}
                        </div>
                        <div className="text-[11px] text-zinc-500 truncate max-w-[160px]">
                          {submission.email}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-zinc-600 dark:text-zinc-300 text-xs">
                        {submission.phone}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getDepartmentBadge(submission.department)}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            const nextMap: Record<ContactStatus, ContactStatus> = {
                              new: "pending",
                              pending: "resolved",
                              resolved: "new",
                            };
                            handleQuickStatusChange(e, submission, nextMap[submission.status]);
                          }}
                          className="cursor-pointer transition-transform active:scale-95"
                          title="Click to cycle status (New → Pending → Resolved)"
                          aria-label={`Cycle status for ticket ${submission.ticket_number}`}
                        >
                          {getStatusBadge(submission.status)}
                        </button>
                      </td>

                      {/* Attachment indicator */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {submission.attachment_url ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            <Paperclip className="w-3 h-3 text-blue-500" />
                            <span>
                              {submission.attachment_size_bytes
                                ? formatFileSize(submission.attachment_size_bytes)
                                : "File"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-zinc-400">-</span>
                        )}
                      </td>

                      {/* Received Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-zinc-500">
                        {new Date(submission.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                            title="Reply on WhatsApp"
                            aria-label={`Reply to ${submission.full_name} on WhatsApp`}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <a
                            href={emailUrl}
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                            title="Reply via Email"
                            aria-label={`Reply to ${submission.full_name} via Email`}
                          >
                            <Mail className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(submission)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                            title="View Full Details"
                            aria-label={`View details for ticket ${submission.ticket_number}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(submission)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete Ticket"
                            aria-label={`Delete ticket ${submission.ticket_number}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination (strictly 15 per page) */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            totalItems={data.totalCount}
            pageSize={15}
            onPageChange={handlePageChange}
            isLoading={isPending}
          />
        </div>
      </div>

      {/* Slide-Over Drawer Window */}
      <ContactDetailsDrawer
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onStatusUpdated={(id, newStatus, adminNotes) => {
          setData((prev) => ({
            ...prev,
            submissions: prev.submissions.map((s) =>
              s.id === id
                ? {
                    ...s,
                    status: newStatus,
                    admin_notes: adminNotes !== undefined ? adminNotes : s.admin_notes,
                    resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
                  }
                : s
            ),
          }));
        }}
        onDeleted={(id) => {
          setData((prev) => ({
            ...prev,
            submissions: prev.submissions.filter((s) => s.id !== id),
            totalCount: Math.max(0, prev.totalCount - 1),
          }));
        }}
      />

      {/* Table Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Support Ticket"
        description="Are you sure you want to permanently delete this support inquiry? If an attachment exists, it will also be purged from storage."
        itemName={deleteTarget?.ticket_number || "Inquiry"}
        itemType="ticket"
        isLoading={isDeleting}
      />
    </div>
  );
}
