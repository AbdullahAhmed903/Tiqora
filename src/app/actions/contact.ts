"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAdminCaller } from "@/lib/admin-guard";
import { rateLimiter, getClientIp } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validations/contact";
import { validateAttachmentFile } from "@/lib/file-utils";
import {
  ContactQueryParams,
  PaginatedContactSubmissionsResult,
  ContactSubmissionResult,
  ContactStatus,
  ContactSubmission,
} from "@/types/contact";

// 30-Day maximum cumulative attachment storage per email address (20 MB)
const MAX_CUMULATIVE_STORAGE_BYTES = 20 * 1024 * 1024;
// Maximum contact submissions per email within 24 hours
const MAX_DAILY_SUBMISSIONS = 5;

/**
 * Public Server Action: Submits a contact inquiry.
 * Enforces honeypot, dual-tier rate limiting, daily submission caps, 30-day cumulative storage quota,
 * secure file upload to Supabase Storage, and database insertion.
 */
export async function submitContactInquiryAction(
  formData: FormData
): Promise<ContactSubmissionResult> {
  try {
    // 1. Honeypot Anti-Bot Filter
    const honeypot = formData.get("website") as string | null;
    if (honeypot && honeypot.trim().length > 0) {
      // Silently return success to bot without consuming database or storage
      return {
        success: true,
        message: "Your inquiry has been received! Our support team will get back to you shortly.",
        ticketNumber: `TIQ-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }

    // 2. Resolve Client IP & Dual-Tier Rate Limiting
    const headersList = await headers();
    const clientIp = getClientIp(headersList);

    // Tier 1: Per-IP Limit (Max 3 submissions per 15 minutes)
    const ipLimit = rateLimiter.check(
      `contact:ip:${clientIp}`,
      3,
      15 * 60 * 1000
    );
    if (!ipLimit.allowed) {
      const waitMinutes = Math.ceil(ipLimit.resetMs / (60 * 1000));
      return {
        success: false,
        message: `Too many submissions. Please wait ${waitMinutes} minute${waitMinutes > 1 ? "s" : ""} before submitting again.`,
        code: "RATE_LIMITED",
      };
    }

    // Tier 2: Global Endpoint Guard (Max 60 requests per minute across all visitors)
    const globalLimit = rateLimiter.check(
      "contact:endpoint:global",
      60,
      60 * 1000
    );
    if (!globalLimit.allowed) {
      return {
        success: false,
        message: "Support desk is currently handling heavy traffic. Please try again in a few moments.",
        code: "SERVER_BUSY",
      };
    }

    // 3. Extract and Clean Form Fields
    const fullName = ((formData.get("fullName") as string) || "").trim();
    const email = ((formData.get("email") as string) || "").trim().toLowerCase();
    const phoneRaw = ((formData.get("phone") as string) || "").trim();
    const countryCode = ((formData.get("countryCode") as string) || "+20").trim();
    const department = ((formData.get("department") as string) || "").trim();
    const subject = ((formData.get("subject") as string) || "").trim();
    const message = ((formData.get("message") as string) || "").trim();
    const attachment = formData.get("attachment") as File | null;

    // Format phone with country code: e.g. +201012345678
    const cleanPhoneDigits = phoneRaw.replace(/[\s-]/g, "");
    const formattedPhone = cleanPhoneDigits
      ? cleanPhoneDigits.startsWith("+")
        ? cleanPhoneDigits
        : `${countryCode}${cleanPhoneDigits.replace(/^0+/, "")}`
      : "";

    // 4. Strict Zod Validation
    const validationResult = contactFormSchema.safeParse({
      fullName,
      email,
      phone: formattedPhone,
      department,
      subject: subject || undefined,
      message,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Please check your inputs.";
      return {
        success: false,
        message: firstError,
        code: "INVALID_INPUT",
      };
    }

    const supabase = await createClient();

    // 5. Daily Submission Cap Per Email (Max 5 submissions in 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: recentSubmissionsCount, error: countError } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", oneDayAgo);

    if (!countError && (recentSubmissionsCount || 0) >= MAX_DAILY_SUBMISSIONS) {
      return {
        success: false,
        message: "You have reached the daily submission limit (5 inquiries). For urgent gate access, please call our hotline.",
        code: "DAILY_LIMIT_EXCEEDED",
      };
    }

    // 6. Attachment Handling & 30-Day Storage Quota Guard
    let attachmentUrl: string | null = null;
    let attachmentPath: string | null = null;
    let attachmentName: string | null = null;
    let attachmentSizeBytes: number | null = null;
    let attachmentMimeType: string | null = null;

    const hasAttachment = attachment && attachment.size > 0 && attachment.name !== "undefined";

    if (hasAttachment) {
      // Validate file size (2 MB limit) and allowed MIME types
      const fileValidation = validateAttachmentFile(attachment);
      if (!fileValidation.valid) {
        return {
          success: false,
          message: fileValidation.error || "Invalid attachment file.",
          code: "INVALID_ATTACHMENT",
        };
      }

      // Check 30-day cumulative storage quota for this email
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: usageData, error: usageError } = await supabase
        .from("contact_submissions")
        .select("attachment_size_bytes")
        .eq("email", email)
        .gte("created_at", thirtyDaysAgo)
        .not("attachment_size_bytes", "is", null);

      if (!usageError && usageData) {
        const cumulativeUsage = usageData.reduce(
          (acc, row) => acc + (Number(row.attachment_size_bytes) || 0),
          0
        );

        if (cumulativeUsage + attachment.size > MAX_CUMULATIVE_STORAGE_BYTES) {
          return {
            success: false,
            message:
              "Attachment storage quota exceeded: you have uploaded 20MB of files within the last 30 days. You may still submit your message without an attachment or reply to our email directly.",
            code: "STORAGE_QUOTA_EXCEEDED",
          };
        }
      }

      // Generate secure file path under contact-attachments bucket
      const cleanFileName = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileExt = cleanFileName.split(".").pop() || "bin";
      const randomSuffix = crypto.randomUUID().slice(0, 8);
      attachmentPath = `inquiries/${Date.now()}-${randomSuffix}.${fileExt}`;
      attachmentName = attachment.name;
      attachmentSizeBytes = attachment.size;
      attachmentMimeType = attachment.type || "application/octet-stream";

      // Convert File to ArrayBuffer then Buffer for upload
      const arrayBuffer = await attachment.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { error: uploadError } = await supabase.storage
        .from("contact-attachments")
        .upload(attachmentPath, buffer, {
          contentType: attachmentMimeType,
          upsert: false,
        });

      if (uploadError) {
        return {
          success: false,
          message: "Failed to upload file attachment. Please try again or submit without an attachment.",
          code: "UPLOAD_FAILED",
        };
      }

      // Resolve signed URL for private bucket
      const { data: signedUrlData } = await supabase.storage
        .from("contact-attachments")
        .createSignedUrl(attachmentPath, 3600);
      attachmentUrl = signedUrlData?.signedUrl || null;
    }

    // 7. Generate Ticket Reference: TIQ-######
    const ticketNumber = `TIQ-${Math.floor(100000 + Math.random() * 900000)}`;

    // 8. Insert Record into public.contact_submissions
    const { error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        ticket_number: ticketNumber,
        full_name: validationResult.data.fullName,
        email: validationResult.data.email,
        phone: formattedPhone,
        department: validationResult.data.department,
        subject: validationResult.data.subject || null,
        message: validationResult.data.message,
        attachment_url: attachmentUrl,
        attachment_path: attachmentPath,
        attachment_name: attachmentName,
        attachment_size_bytes: attachmentSizeBytes,
        attachment_mime_type: attachmentMimeType,
        ip_address: clientIp,
        status: "new",
      });

    if (insertError) {
      // Cleanup uploaded file if DB insert failed
      if (attachmentPath) {
        await supabase.storage.from("contact-attachments").remove([attachmentPath]);
      }
      return {
        success: false,
        message: "Failed to save support inquiry. Please try again or call our hotline.",
        code: "DB_ERROR",
      };
    }

    return {
      success: true,
      message: "Your inquiry has been received! Our support team will get back to you shortly.",
      ticketNumber,
      code: "SUCCESS",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while processing your request. Please try again later.",
      code: "UNEXPECTED_ERROR",
    };
  }
}

/**
 * Admin Action: Retrieves paginated contact submissions with filters and status counters.
 * strictly restricted to authenticated administrators.
 */
export async function getAdminContactSubmissionsAction(
  params: ContactQueryParams = {}
): Promise<{ data?: PaginatedContactSubmissionsResult; error?: string }> {
  try {
    const { supabase } = await verifyAdminCaller();

    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 15));
    const offset = (page - 1) * limit;

    // 1. Fetch Aggregated Status Counters (all, new, pending, resolved)
    const [allCountRes, newCountRes, pendingCountRes, resolvedCountRes] = await Promise.all([
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "resolved"),
    ]);

    const counts = {
      all: allCountRes.count || 0,
      new: newCountRes.count || 0,
      pending: pendingCountRes.count || 0,
      resolved: resolvedCountRes.count || 0,
    };

    // 2. Build Filtered Query
    let query = supabase.from("contact_submissions").select("*", { count: "exact" });

    // Status filter
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }

    // Department filter
    if (params.department && params.department !== "all") {
      query = query.eq("department", params.department);
    }

    // Search query (matches ticket_number, full_name, or email)
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim();
      query = query.or(
        `ticket_number.ilike.%${q}%,full_name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%`
      );
    }

    // Order by created_at descending and paginate
    query = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: rows, count: filteredCount, error: fetchError } = await query;

    if (fetchError) {
      return { error: fetchError.message || "Failed to fetch contact inquiries." };
    }

    const totalCount = filteredCount || 0;
    const totalPages = Math.ceil(totalCount / limit) || 1;

    // Generate fresh signed URLs for private attachments
    const submissions = await Promise.all(
      ((rows as ContactSubmission[]) || []).map(async (sub) => {
        if (sub.attachment_path) {
          const { data: signedData } = await supabase.storage
            .from("contact-attachments")
            .createSignedUrl(sub.attachment_path, 3600);
          if (signedData?.signedUrl) {
            return { ...sub, attachment_url: signedData.signedUrl };
          }
        }
        return sub;
      })
    );

    return {
      data: {
        submissions,
        totalCount,
        page,
        limit,
        totalPages,
        counts,
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load inquiries.";
    return { error: errorMsg };
  }
}

/**
 * Admin Action: Updates ticket status and internal admin notes.
 */
export async function updateContactStatusAction(params: {
  id: string;
  status: ContactStatus;
  adminNotes?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await verifyAdminCaller();

    const updatePayload: Record<string, unknown> = {
      status: params.status,
      updated_at: new Date().toISOString(),
    };

    if (params.adminNotes !== undefined) {
      updatePayload.admin_notes = params.adminNotes.trim() || null;
    }

    if (params.status === "resolved") {
      updatePayload.resolved_at = new Date().toISOString();
    } else {
      updatePayload.resolved_at = null;
    }

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update(updatePayload)
      .eq("id", params.id);

    if (updateError) {
      return { success: false, error: updateError.message || "Failed to update inquiry." };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update inquiry.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Admin Action: Deletes a contact submission and purges any associated storage attachment file.
 */
export async function deleteContactSubmissionAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await verifyAdminCaller();

    // 1. Fetch record to inspect attachment_path
    const { data: record, error: findError } = await supabase
      .from("contact_submissions")
      .select("attachment_path")
      .eq("id", id)
      .single();

    if (findError || !record) {
      return { success: false, error: "Submission record not found." };
    }

    // 2. Cascade delete file from contact-attachments bucket if present
    if (record.attachment_path) {
      await supabase.storage
        .from("contact-attachments")
        .remove([record.attachment_path]);
    }

    // 3. Delete database record
    const { error: deleteError } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return { success: false, error: deleteError.message || "Failed to delete submission." };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete submission.";
    return { success: false, error: errorMsg };
  }
}
