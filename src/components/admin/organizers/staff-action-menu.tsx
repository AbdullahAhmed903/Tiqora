"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  UserMinus,
  KeyRound,
  UserX,
  UserCheck,
} from "lucide-react";
import type { StaffMemberRow } from "@/types/auth";

interface StaffActionMenuProps {
  staff: StaffMemberRow;
  currentAdminId?: string;
  onEditPermissions: (staff: StaffMemberRow) => void;
  onToggleStatus: (staff: StaffMemberRow) => void;
  onDemoteRole: (staff: StaffMemberRow, newRole: "admin" | "organizer" | "user") => void;
}

export function StaffActionMenu({
  staff,
  currentAdminId,
  onEditPermissions,
  onToggleStatus,
  onDemoteRole,
}: StaffActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isSelf = currentAdminId ? staff.id === currentAdminId : false;
  const isSuspended = staff.status === "suspended";
  const isAdmin = staff.role === "admin";
  const isOrganizer = staff.role === "organizer";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions"
        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-1.5 z-40 text-left">
          {/* Edit Permissions (Organizers & Admins) */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEditPermissions(staff);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
          >
            <KeyRound className="w-4 h-4 text-blue-500" />
            <span>Edit Permissions & Specialties</span>
          </button>

          {/* Suspend or Reactivate Account */}
          <button
            type="button"
            disabled={isSelf}
            onClick={() => {
              setIsOpen(false);
              onToggleStatus(staff);
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors text-left ${
              isSelf
                ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                : isSuspended
                ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            }`}
            title={isSelf ? "You cannot suspend your own account" : undefined}
          >
            {isSuspended ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Reactivate Account</span>
              </>
            ) : (
              <>
                <UserX className="w-4 h-4" />
                <span>Suspend Account</span>
              </>
            )}
          </button>

          <div className="my-1 border-t border-zinc-100 dark:border-zinc-800/80" />

          {/* Role Escalation / Demotion */}
          {isOrganizer && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDemoteRole(staff, "admin");
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors text-left"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Promote to Administrator</span>
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              disabled={isSelf}
              onClick={() => {
                setIsOpen(false);
                onDemoteRole(staff, "organizer");
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors text-left ${
                isSelf
                  ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                  : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              }`}
              title={isSelf ? "You cannot demote your own account" : undefined}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Demote to Organizer</span>
            </button>
          )}

          {/* Demote to Regular User (Revokes all staff privileges) */}
          <button
            type="button"
            disabled={isSelf}
            onClick={() => {
              setIsOpen(false);
              onDemoteRole(staff, "user");
            }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors text-left ${
              isSelf
                ? "text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
                : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
            }`}
            title={isSelf ? "You cannot demote your own account" : undefined}
          >
            <UserMinus className="w-4 h-4" />
            <span>Demote to Regular User</span>
          </button>
        </div>
      )}
    </div>
  );
}
