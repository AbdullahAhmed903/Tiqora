"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, File as FileIcon, X } from "lucide-react";
import { toast } from "sonner";
import {
  validateAttachmentFile,
  formatFileSize,
  isImageFile,
  createFilePreview,
  revokeFilePreview,
  DEFAULT_MAX_ATTACHMENT_SIZE_BYTES,
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_DOCUMENT_MIME_TYPES,
} from "@/lib/file-utils";

export interface FileAttachmentZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  maxSizeBytes?: number;
  allowedMimeTypes?: readonly string[] | string[];
  label?: string;
  helperText?: string;
  accept?: string;
  className?: string;
}

export function FileAttachmentZone({
  file,
  onFileChange,
  maxSizeBytes = DEFAULT_MAX_ATTACHMENT_SIZE_BYTES,
  allowedMimeTypes = [...ALLOWED_IMAGE_MIME_TYPES, ...ALLOWED_DOCUMENT_MIME_TYPES],
  label = "Attach Picture or File",
  helperText = "Screenshots, tickets, receipts, or PDF docs (Max 2 MB)",
  accept = "image/*,application/pdf",
  className = "",
}: FileAttachmentZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [prevFile, setPrevFile] = React.useState<File | null>(file);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // If file prop was reset externally (e.g. form reset), update state during render
  if (file !== prevFile) {
    setPrevFile(file);
    if (!file && previewUrl) {
      revokeFilePreview(previewUrl);
      setPreviewUrl(null);
    }
  }

  // Revoke preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        revokeFilePreview(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleProcessFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    // Validate using shared utility
    const validation = validateAttachmentFile(selectedFile, {
      maxSizeBytes,
      allowedMimeTypes,
    });

    if (!validation.valid) {
      toast.error(validation.error || "Invalid file chosen.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    if (previewUrl) {
      revokeFilePreview(previewUrl);
    }

    if (isImageFile(selectedFile)) {
      const url = createFilePreview(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    onFileChange(selectedFile);
    toast.info(`Attached: ${selectedFile.name} (${formatFileSize(selectedFile.size)})`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) {
      revokeFilePreview(previewUrl);
      setPreviewUrl(null);
    }
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-300">
          {label}{" "}
          {helperText && (
            <span className="text-zinc-500 font-normal">({helperText})</span>
          )}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleProcessFile(e.target.files[0]);
          }
        }}
      />

      {file ? (
        /* Selected File Card */
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950/90 border border-blue-500/40 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900 shrink-0">
                <Image
                  src={previewUrl}
                  alt="Attachment preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                <FileIcon className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              <div className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                {file.name}
              </div>
              <div className="text-[11px] text-zinc-400">
                {formatFileSize(file.size)} • {file.type || "Document"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-600/20 text-zinc-400 hover:text-rose-400 border border-zinc-700/80 transition-colors cursor-pointer"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
            isDragOver
              ? "border-[#2563EB] bg-blue-600/10"
              : "border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950/80"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-[#3B82F6]">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="text-xs text-zinc-300">
              <span className="font-semibold text-blue-400 hover:underline">
                Click to browse
              </span>{" "}
              or drag and drop your file here
            </div>
            <div className="text-[11px] text-zinc-500">
              PNG, JPG, WebP, SVG, GIF, AVIF or PDF (up to {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
