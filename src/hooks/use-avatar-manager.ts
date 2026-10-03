"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { uploadAvatarAction, deleteAvatarAction } from "@/app/actions/profile";

export interface UseAvatarManagerOptions {
  /** Current avatar URL to verify whether removal is allowed */
  currentAvatarUrl?: string | null;
  /** Callback fired after successfully uploading or deleting avatar */
  onAvatarChange?: (avatarUrl: string | null) => void;
  /** Minimum width and height dimension in pixels (default: 64) */
  minDimensions?: number;
  /** Maximum file size in bytes (default: 2MB) */
  maxSizeBytes?: number;
  /** Confirmation prompt message displayed before deleting avatar */
  deleteConfirmMessage?: string;
}

export function useAvatarManager({
  currentAvatarUrl,
  onAvatarChange,
  minDimensions = 64,
  maxSizeBytes = 2 * 1024 * 1024,
  deleteConfirmMessage = "Are you sure you want to remove your profile photo?",
}: UseAvatarManagerOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAvatarSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. File size check (2MB)
      if (file.size > maxSizeBytes) {
        toast.error(
          `Image size too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed is ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // 2. MIME type check
      const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validMimes.includes(file.type)) {
        toast.error(
          "Unsupported file format. Please upload JPG, PNG, WebP, or GIF."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // 3. Client-side dimension validation
      const objectUrl = URL.createObjectURL(file);
      try {
        const dimensions = await new Promise<{ width: number; height: number }>(
          (resolve, reject) => {
            const img = new window.Image();
            img.onload = () =>
              resolve({
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
              });
            img.onerror = () =>
              reject(new Error("Unable to read image file."));
            img.src = objectUrl;
          }
        );

        if (
          dimensions.width < minDimensions ||
          dimensions.height < minDimensions
        ) {
          toast.error(
            `Image resolution too low (${dimensions.width}×${dimensions.height}px). Minimum required is ${minDimensions}×${minDimensions}px.`
          );
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      } catch {
        toast.error("Unable to read image file. Please select a valid image.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      } finally {
        URL.revokeObjectURL(objectUrl);
      }

      // 4. Server upload
      const formData = new FormData();
      formData.append("avatar", file);

      setIsUploading(true);
      const toastId = toast.loading("Processing and updating avatar...");

      try {
        const res = await uploadAvatarAction(formData);
        if (res.success && res.avatarUrl) {
          onAvatarChange?.(res.avatarUrl);
          toast.success("Profile photo updated successfully!", { id: toastId });
        } else {
          toast.error(res.error || "Failed to update avatar.", { id: toastId });
        }
      } catch {
        toast.error("An unexpected error occurred while uploading avatar.", {
          id: toastId,
        });
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [maxSizeBytes, minDimensions, onAvatarChange]
  );

  const handleAvatarDelete = useCallback(async () => {
    if (!currentAvatarUrl) return;

    if (typeof window !== "undefined" && !window.confirm(deleteConfirmMessage)) {
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading("Removing profile photo...");

    try {
      const res = await deleteAvatarAction();
      if (res.success) {
        onAvatarChange?.(null);
        toast.success("Profile photo removed.", { id: toastId });
      } else {
        toast.error(res.error || "Failed to remove avatar.", { id: toastId });
      }
    } catch {
      toast.error("An unexpected error occurred.", { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  }, [currentAvatarUrl, deleteConfirmMessage, onAvatarChange]);

  return {
    fileInputRef,
    isUploading,
    isDeleting,
    isLoading: isUploading || isDeleting,
    openFilePicker,
    handleAvatarSelect,
    handleAvatarDelete,
  };
}
