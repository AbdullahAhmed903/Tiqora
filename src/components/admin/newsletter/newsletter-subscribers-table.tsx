"use client";

import React, { useState, useTransition } from "react";
import {
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  NewsletterSubscriber,
  NewsletterStatus,
  PaginatedSubscribersResult,
} from "@/types/newsletter";
import {
  getNewsletterSubscribersAction,
  updateNewsletterSubscriberStatusAction,
  deleteNewsletterSubscriberAction,
} from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";

interface NewsletterSubscribersTableProps {
  initialData: PaginatedSubscribersResult;
}

export function NewsletterSubscribersTable({ initialData }: NewsletterSubscribersTableProps) {
  const [data, setData] = useState<PaginatedSubscribersResult>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NewsletterStatus>("all");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const fetchSubscribers = (newPage = page, newStatus = statusFilter, newSearch = search) => {
    startTransition(async () => {
      const res = await getNewsletterSubscribersAction({
        page: newPage,
        limit: 20,
        status: newStatus,
        search: newSearch,
      });

      if (res.success && res.data) {
        setData(res.data);
        setPage(newPage);
      } else {
        toast.error(res.error || "Failed to load newsletter subscribers");
      }
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubscribers(1, statusFilter, search);
  };

  const handleStatusFilterChange = (status: "all" | NewsletterStatus) => {
    setStatusFilter(status);
    fetchSubscribers(1, status, search);
  };

  const handleToggleStatus = async (subscriber: NewsletterSubscriber) => {
    const nextStatus: NewsletterStatus =
      subscriber.status === "active" ? "unsubscribed" : "active";

    setActionInProgressId(subscriber.id);
    try {
      const res = await updateNewsletterSubscriberStatusAction(subscriber.id, nextStatus);
      if (res.success) {
        toast.success(`Subscriber marked as ${nextStatus}`);
        setData((prev) => ({
          ...prev,
          subscribers: prev.subscribers.map((item) =>
            item.id === subscriber.id
              ? {
                  ...item,
                  status: nextStatus,
                  unsubscribed_at:
                    nextStatus === "unsubscribed" ? new Date().toISOString() : null,
                }
              : item
          ),
        }));
      } else {
        toast.error(res.error || "Failed to update subscriber status");
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to permanently delete ${email}?`)) {
      return;
    }

    setActionInProgressId(id);
    try {
      const res = await deleteNewsletterSubscriberAction(id);
      if (res.success) {
        toast.success("Subscriber permanently deleted");
        setData((prev) => ({
          ...prev,
          totalCount: prev.totalCount - 1,
          subscribers: prev.subscribers.filter((s) => s.id !== id),
        }));
      } else {
        toast.error(res.error || "Failed to delete subscriber");
      }
    } catch {
      toast.error("Failed to delete subscriber");
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleExportCSV = () => {
    if (data.subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const headers = ["Email", "Status", "Source", "Subscribed At", "Unsubscribed At"];
    const rows = data.subscribers.map((s) => [
      s.email,
      s.status,
      s.source,
      new Date(s.subscribed_at).toISOString(),
      s.unsubscribed_at ? new Date(s.unsubscribed_at).toISOString() : "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tiqora_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscribers list exported as CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[#2563EB]" />
            <span>Newsletter Subscribers</span>
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage public email subscriptions, moderate status, and export audience lists.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchSubscribers()}
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(["all", "active", "unsubscribed"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusFilterChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-[#2563EB] text-white shadow-xs"
                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscribers by email..."
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-[#2563EB]"
          />
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80 text-zinc-500 dark:text-zinc-400 font-semibold">
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Subscribed At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80">
              {data.subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    No subscribers found matching your query.
                  </td>
                </tr>
              ) : (
                data.subscribers.map((subscriber) => {
                  const isOperating = actionInProgressId === subscriber.id;
                  const isActive = subscriber.status === "active";

                  return (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-white">
                        {subscriber.email}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            isActive
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-zinc-500/10 border-zinc-500/30 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {isActive ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-zinc-400" />
                          )}
                          <span className="capitalize">{subscriber.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                        {subscriber.source}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400 text-xs">
                        {new Date(subscriber.subscribed_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(subscriber)}
                            disabled={isOperating}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isActive
                                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                : "bg-blue-500/10 hover:bg-blue-500/20 text-[#2563EB] dark:text-blue-400 border-blue-500/30"
                            }`}
                          >
                            {isOperating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : isActive ? (
                              "Unsubscribe"
                            ) : (
                              "Reactivate"
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteSubscriber(subscriber.id, subscriber.email)
                            }
                            disabled={isOperating}
                            aria-label={`Delete ${subscriber.email}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* Pagination Footer */}
        {data.totalPages > 1 && (
          <div className="py-3.5 px-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>
              Page {data.page} of {data.totalPages} ({data.totalCount} total)
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fetchSubscribers(page - 1)}
                disabled={page <= 1 || isPending}
                className="rounded-lg text-xs cursor-pointer"
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fetchSubscribers(page + 1)}
                disabled={page >= data.totalPages || isPending}
                className="rounded-lg text-xs cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
