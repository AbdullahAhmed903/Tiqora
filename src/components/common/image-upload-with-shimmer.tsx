"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { UploadCloud, X, AlertCircle, RefreshCw } from "lucide-react";

interface ImageUploadWithShimmerProps {
  currentImageUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  isUploading?: boolean;
  minWidth?: number;
  minHeight?: number;
  maxSizeBytes?: number;
  label?: string;
  helperText?: string;
  error?: string | null;
}

export function ImageUploadWithShimmer({
  currentImageUrl,
  onFileSelect,
  isUploading = false,
  minWidth = 200,
  minHeight = 200,
  maxSizeBytes = 2 * 1024 * 1024, // 2MB
  label = "Category Cover Picture",
  helperText = "PNG, JPG, WebP, SVG or AVIF up to 2MB. Minimum 200x200px.",
  error = null,
}: ImageUploadWithShimmerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    sizeKb: number;
    width?: number;
    height?: number;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidateAndSelect = useCallback(
    (file: File) => {
      setValidationError(null);

      // 1. Size Validation (2MB limit)
      if (file.size > maxSizeBytes) {
        setValidationError(
          `Image is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum limit is 2MB.`
        );
        return;
      }

      // 2. MIME type check
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "image/avif"];
      if (!validTypes.includes(file.type)) {
        setValidationError(
          `Unsupported file format (${file.type || "unknown"}). Allowed formats: JPG, PNG, WebP, SVG, GIF, AVIF.`
        );
        return;
      }

      // 3. Client dimension pre-check using Image constructor
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        if (img.width < minWidth || img.height < minHeight) {
          URL.revokeObjectURL(objectUrl);
          setValidationError(
            `Image resolution too low (${img.width}x${img.height}px). Minimum is ${minWidth}x${minHeight}px.`
          );
          return;
        }

        setPreviewUrl(objectUrl);
        setFileDetails({
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
          width: img.width,
          height: img.height,
        });
        onFileSelect(file);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        setValidationError("Could not read image file. It may be corrupted.");
      };

      img.src = objectUrl;
    },
    [maxSizeBytes, minWidth, minHeight, onFileSelect]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleValidateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleValidateAndSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileDetails(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileSelect(null);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-zinc-900 dark:text-white">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      {/* Upload Container */}
      <div
        className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20"
            : previewUrl
            ? "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50"
            : "border-dashed border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 bg-zinc-50/50 dark:bg-zinc-900/20"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Shimmer Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
            {/* Pulsing shimmer box */}
            <div className="w-48 h-3 rounded-full bg-zinc-700 overflow-hidden relative mb-3">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Optimizing &amp; uploading WebP...</span>
            </div>
          </div>
        )}

        {/* State A: Image Preview Active */}
        {previewUrl ? (
          <div className="relative p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-32 h-24 sm:w-40 sm:h-28 rounded-xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
              <Image
                src={previewUrl}
                alt="Category preview"
                fill
                className="object-cover"
                unoptimized={previewUrl.startsWith("blob:")}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                {fileDetails?.name || "Uploaded Picture"}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                {fileDetails?.sizeKb && <span>{fileDetails.sizeKb} KB</span>}
                {fileDetails?.width && fileDetails?.height && (
                  <>
                    <span>•</span>
                    <span>{fileDetails.width} × {fileDetails.height} px</span>
                  </>
                )}
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] uppercase font-semibold">
                  Valid Image
                </span>
              </div>

              <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  Replace Picture
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="p-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* State B: Dropzone Placeholder */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Click to upload or drag &amp; drop
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
              {helperText}
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,image/avif"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Validation Errors */}
      {(validationError || error) && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}
    </div>
  );
}
