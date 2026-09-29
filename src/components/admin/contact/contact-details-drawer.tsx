"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageCircle,
  Mail,
  Phone,
  Paperclip,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Save,
  ExternalLink,
  Loader2,
  Ticket,
  CreditCard,
  ShieldCheck,
  Trophy,
  Wrench,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ContactSubmission, ContactStatus, ContactDepartment } from "@/types/contact";
import { updateContactStatusAction, deleteContactSubmissionAction } from "@/app/actions/contact";
import { formatFileSize, isImageFile } from "@/lib/file-utils";
import { DeleteConfirmationDialog } from "@/components/common/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";

interface ContactDetailsDrawerProps {
  submission: ContactSubmission | null;
  onClose: () => void;
  onStatusUpdated: (id: string, newStatus: ContactStatus, adminNotes?: string) => void;
  onDeleted: (id: string) => void;
}

export function ContactDetailsDrawer({
  submission,
  onClose,
  onStatusUpdated,
  onDeleted,
}: ContactDetailsDrawerProps) {
  const [currentStatus, setCurrentStatus] = useState<ContactStatus>(
    submission?.status || "new"
  );
  const [adminNotes, setAdminNotes] = useState<string>(submission?.admin_notes || "");
  const [prevSubmissionId, setPrevSubmissionId] = useState(submission?.id);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sync state when submission prop changes (without useEffect)
  if (submission && submission.id !== prevSubmissionId) {
    setPrevSubmissionId(submission.id);
    setCurrentStatus(submission.status);
    setAdminNotes(submission.admin_notes || "");
  }

  if (!submission) return null;

  // Clean phone number for WhatsApp wa.me link (digits only)
  const cleanPhoneForWhatsApp = submission.phone.replace(/[^0-9]/g, "");

  // Pre-filled WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hello ${submission.full_name}, this is Tiqora Support regarding your inquiry (${submission.ticket_number}) about ${submission.department}.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhoneForWhatsApp}?text=${whatsappMessage}`;

  // Pre-filled Email subject & body
  const emailSubject = encodeURIComponent(
    `Re: [${submission.ticket_number}] ${submission.subject || "Tiqora Support Inquiry"}`
  );
  const emailMailto = `mailto:${submission.email}?subject=${emailSubject}`;

  const getDepartmentIcon = (dept: ContactDepartment) => {
    switch (dept) {
      case "tickets":
        return <Ticket className="w-4 h-4 text-blue-400" />;
      case "payments":
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case "stadium":
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case "organizers":
        return <Trophy className="w-4 h-4 text-purple-400" />;
      case "technical":
        return <Wrench className="w-4 h-4 text-rose-400" />;
      default:
        return <HelpCircle className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>New</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending</span>
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </span>
        );
    }
  };

  const handleStatusChange = async (nextStatus: ContactStatus) => {
    setCurrentStatus(nextStatus);
    setIsUpdatingStatus(true);
    try {
      const res = await updateContactStatusAction({
        id: submission.id,
        status: nextStatus,
      });

      if (res.success) {
        toast.success(`Ticket status updated to ${nextStatus}`);
        onStatusUpdated(submission.id, nextStatus);
      } else {
        toast.error(res.error || "Failed to update status");
        setCurrentStatus(submission.status);
      }
    } catch {
      toast.error("Failed to update status");
      setCurrentStatus(submission.status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const res = await updateContactStatusAction({
        id: submission.id,
        status: currentStatus,
        adminNotes,
      });

      if (res.success) {
        toast.success("Admin notes saved successfully");
        onStatusUpdated(submission.id, currentStatus, adminNotes);
      } else {
        toast.error(res.error || "Failed to save notes");
      }
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteContactSubmissionAction(submission.id);
      if (res.success) {
        toast.success(`Ticket ${submission.ticket_number} deleted successfully`);
        setIsDeleteDialogOpen(false);
        onDeleted(submission.id);
        onClose();
      } else {
        toast.error(res.error || "Failed to delete submission");
      }
    } catch {
      toast.error("Failed to delete submission");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col h-full z-10 overflow-hidden text-zinc-100"
          >
            {/* 1. Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-black text-blue-400 text-base sm:text-lg">
                    {submission.ticket_number}
                  </span>
                  {getStatusBadge(currentStatus)}
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                    Received on{" "}
                    {new Date(submission.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                title="Close drawer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
              {/* Status & Quick Actions Bar */}
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Update Workflow Status
                  </span>
                  <div className="flex items-center gap-2">
                    {(["new", "pending", "resolved"] as ContactStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(st)}
                        disabled={isUpdatingStatus}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          currentStatus === st
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-zinc-800/80 my-2" />

                {/* Quick Reply Channels */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply via WhatsApp</span>
                  </a>

                  <a
                    href={emailMailto}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Reply via Email</span>
                  </a>

                  <a
                    href={`tel:${cleanPhoneForWhatsApp}`}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Phone</span>
                  </a>
                </div>
              </div>

              {/* Sender Info Card */}
              <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Full Name</span>
                    <span className="font-bold text-white text-sm">{submission.full_name}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Email Address</span>
                    <a
                      href={`mailto:${submission.email}`}
                      className="font-medium text-blue-400 hover:underline"
                    >
                      {submission.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Phone Number</span>
                    <span className="font-mono text-zinc-200">{submission.phone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Department</span>
                    <div className="inline-flex items-center gap-1.5 font-semibold text-zinc-200 capitalize">
                      {getDepartmentIcon(submission.department)}
                      <span>{submission.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Message & Inquiry Details
                </h4>
                {submission.subject && (
                  <div className="text-sm font-bold text-white bg-zinc-950/80 p-3 rounded-xl border border-zinc-800">
                    Subject: {submission.subject}
                  </div>
                )}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs sm:text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {submission.message}
                </div>
              </div>

              {/* Attachment Showcase */}
              {submission.attachment_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                      <span>Attached File</span>
                    </h4>
                    {submission.attachment_size_bytes && (
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {formatFileSize(submission.attachment_size_bytes)}
                      </span>
                    )}
                  </div>

                  {isImageFile(submission.attachment_name || submission.attachment_url) ? (
                    /* Image preview */
                    <div className="space-y-2">
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
                        <Image
                          src={submission.attachment_url}
                          alt={submission.attachment_name || "Attachment"}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-zinc-400 truncate max-w-xs">
                          {submission.attachment_name || "Attachment Image"}
                        </span>
                        <a
                          href={submission.attachment_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          <span>Open Full Size</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* PDF or document card */
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-xs font-bold text-white truncate max-w-xs">
                            {submission.attachment_name || "Document"}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {submission.attachment_mime_type || "PDF Document"}
                          </div>
                        </div>
                      </div>

                      <a
                        href={submission.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                      >
                        <span>View Document</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Internal Admin Notes */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Internal Staff Notes
                  </h4>
                  <span className="text-[11px] text-zinc-500">Only visible to administrators</span>
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record internal resolution details, actions taken, or follower staff notes here..."
                  className="w-full bg-zinc-950/80 border border-zinc-800 focus:border-blue-600 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-blue-600 transition-all"
                />
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="gap-1.5 cursor-pointer text-xs"
                  >
                    {isSavingNotes ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Notes</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* 3. Drawer Footer: Delete Button */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-2 cursor-pointer text-xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Ticket</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Support Ticket"
        description="Are you sure you want to permanently delete this support inquiry? If an attachment exists, it will also be purged from storage."
        itemName={submission.ticket_number}
        itemType="ticket"
        isLoading={isDeleting}
      />
    </>
  );
}
