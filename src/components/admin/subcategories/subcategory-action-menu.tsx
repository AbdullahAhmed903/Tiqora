"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical, Edit, Trash2, ExternalLink } from "lucide-react";
import type { SubcategoryWithCategory } from "@/types/subcategories";

interface SubcategoryActionMenuProps {
  subcategory: SubcategoryWithCategory;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function SubcategoryActionMenu({
  subcategory,
  onEditClick,
  onDeleteClick,
}: SubcategoryActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
    openUpwards: boolean;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = 140;
    const menuWidth = 176;

    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards = spaceBelow < menuHeight && rect.top > menuHeight;

    let left = rect.right - menuWidth;
    if (left < 10) left = 10;

    setMenuPosition({
      top: openUpwards ? rect.top - 6 : rect.bottom + 6,
      left,
      openUpwards,
    });
  };

  const toggleMenu = () => {
    if (!isOpen) {
      calculatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      setIsOpen(false);
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const publicUrl = subcategory.category?.slug
    ? `/events/${subcategory.category.slug}?sub=${subcategory.slug}`
    : `/events?sub=${subcategory.slug}`;

  return (
    <div className="inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Open actions menu"
        className={`p-1.5 rounded-lg border transition-colors ${
          isOpen
            ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
            : "border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              transform: menuPosition.openUpwards ? "translateY(-100%)" : "none",
              zIndex: 99999,
            }}
            className="w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Edit Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEditClick();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors text-left"
            >
              <Edit className="w-3.5 h-3.5 text-blue-500" />
              <span>Edit Sub-category</span>
            </button>

            {/* View on public site */}
            <Link
              href={publicUrl}
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              <span>View Public Page</span>
            </Link>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />

            {/* Delete Action */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDeleteClick();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Sub-category</span>
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
